const { TypesFactory } = require('@ah/core').Types;
const { MetadataTypes } = require('@ah/core').Values;
const { Utils, Validator } = require('@ah/core').Utils;
const { XMLParser } = require('@ah/core').Languages;
const { FileChecker, FileReader, FileWriter, PathUtils } = require('@ah/core').FileSystem;
const XMLCompressor = require('@ah/xml-compresor');

const TYPES_XML_RELATION = {
    AssignmentRules: {
        singularName: MetadataTypes.ASSIGNMENT_RULE,
        collection: 'assignmentRule',
        fieldKey: 'fullName',
    },
    AutoResponseRules: {
        singularName: MetadataTypes.AUTORESPONSE_RULE,
        collection: 'autoresponseRule',
        fieldKey: 'fullName',
    },
    EscalationRules: {
        singularName: MetadataTypes.ESCALATION_RULE,
        collection: 'escalationRule',
        fieldKey: 'fullName',
    },
    MatchingRules: {
        singularName: MetadataTypes.MATCHING_RULE,
        collection: 'matchingRules',
        fieldKey: 'fullName',
    },
    CustomLabels: {
        singularName: MetadataTypes.CUSTOM_LABEL,
        collection: 'labels',
        fieldKey: 'fullName',
    },
    SharingCriteriaRule: {
        parentName: MetadataTypes.SHARING_RULE + 's',
        collection: 'sharingCriteriaRules',
        fieldKey: 'fullName',
    },
    SharingOwnerRule: {
        parentName: MetadataTypes.SHARING_RULE + 's',
        collection: 'sharingOwnerRules',
        fieldKey: 'fullName',
    },
    SharingGuestRule: {
        parentName: MetadataTypes.SHARING_RULE + 's',
        collection: 'sharingGuestRules',
        fieldKey: 'fullName',
    },
    SharingTerritoryRule: {
        parentName: MetadataTypes.SHARING_RULE + 's',
        collection: 'sharingTerritoryRules',
        fieldKey: 'fullName',
    },
    WorkflowAlert: {
        parentName: MetadataTypes.WORKFLOW,
        collection: 'alerts',
        fieldKey: 'fullName',
    },
    WorkflowKnowledgePublish: {
        parentName: MetadataTypes.WORKFLOW,
        collection: 'knowledgePublishes',
        fieldKey: 'fullName',
    },
    WorkflowFieldUpdate: {
        parentName: MetadataTypes.WORKFLOW,
        collection: 'fieldUpdates',
        fieldKey: 'fullName',
    },
    WorkflowRule: {
        parentName: MetadataTypes.WORKFLOW,
        collection: 'rules',
        fieldKey: 'fullName',
    },
    WorkflowTask: {
        parentName: MetadataTypes.WORKFLOW,
        collection: 'tasks',
        fieldKey: 'fullName',
    },
    WorkflowOutboundMessage: {
        parentName: MetadataTypes.WORKFLOW,
        collection: 'outboundMessages',
        fieldKey: 'fullName',
    }
};

const METADATA_WITH_CHILDS = {
    Workflow: [
        MetadataTypes.WORKFLOW_ALERT,
        MetadataTypes.WORKFLOW_KNOWLEDGE_PUBLISH,
        MetadataTypes.WORKFLOW_FIELD_UPDATE,
        MetadataTypes.WORKFLOW_RULE,
        MetadataTypes.WORKFLOW_TASK,
        MetadataTypes.WORKFLOW_OUTBOUND_MESSAGE
    ],
    SharingRules: [
        MetadataTypes.SHARING_CRITERIA_RULE,
        MetadataTypes.SHARING_OWNER_RULE,
        MetadataTypes.SHARING_GUEST_RULE,
        MetadataTypes.SHARING_TERRITORY_RULE
    ],
    CustomObject: [
        MetadataTypes.CUSTOM_FIELD,
        MetadataTypes.INDEX,
        MetadataTypes.BUSINESS_PROCESS,
        MetadataTypes.COMPACT_LAYOUT,
        MetadataTypes.RECORD_TYPE,
        MetadataTypes.WEBLINK,
        MetadataTypes.VALIDATION_RULE,
        MetadataTypes.SHARING_REASON,
        MetadataTypes.LISTVIEW,
        MetadataTypes.FIELD_SET
    ]
};

class Ignore {

    static ignoreMetadata(metadataOrPath, ignorefile, typesForIgnore, remove) {
        let metadata;
        let ignoredMetadata;
        if (typeof metadataOrPath === 'object') {
            metadata = Utils.clone(metadataOrPath);
        } else {
            metadata = Validator.validateJSONFile(metadataOrPath, 'Metadata');
        }
        ignoredMetadata = Validator.validateJSONFile(ignorefile, 'Ignore');
        for (const metadataTypeName of Object.keys(ignoredMetadata)) {
            let typeData = TYPES_XML_RELATION[metadataTypeName];
            if (metadata[metadataTypeName] || (typeData && typeData.singularName)) {
                if (typesForIgnore && !typesForIgnore.includes(metadataTypeName))
                    continue;
                switch (metadataTypeName) {
                    case MetadataTypes.CUSTOM_LABELS:
                        ignoreMetadataCustomLabels(metadata[metadataTypeName], ignoredMetadata[metadataTypeName], metadata[typeData.singularName], remove);
                        break;
                    case MetadataTypes.MATCHING_RULES:
                    case MetadataTypes.ASSIGNMENT_RULES:
                    case MetadataTypes.AUTORESPONSE_RULES:
                    case MetadataTypes.ESCALATION_RULES:
                        if (metadata[typeData.singularName])
                            ignoreMetadataRules(metadata[metadataTypeName], ignoredMetadata[metadataTypeName], metadata[typeData.singularName], remove);
                        break;
                    case MetadataTypes.SHARING_CRITERIA_RULE:
                    case MetadataTypes.SHARING_OWNER_RULE:
                    case MetadataTypes.SHARING_GUEST_RULE:
                    case MetadataTypes.SHARING_TERRITORY_RULE:
                    case MetadataTypes.WORKFLOW_ALERT:
                    case MetadataTypes.WORKFLOW_KNOWLEDGE_PUBLISH:
                    case MetadataTypes.WORKFLOW_FIELD_UPDATE:
                    case MetadataTypes.WORKFLOW_RULE:
                    case MetadataTypes.WORKFLOW_TASK:
                    case MetadataTypes.WORKFLOW_OUTBOUND_MESSAGE:
                    case MetadataTypes.WORKFLOW:
                    case MetadataTypes.SHARING_RULE:
                        ignoreMetadataWithChilds(metadata[metadataTypeName], ignoredMetadata[metadataTypeName], metadata, remove);
                        break;
                    case MetadataTypes.CUSTOM_OBJECT:
                    case MetadataTypes.CUSTOM_FIELD:
                    case MetadataTypes.INDEX:
                    case MetadataTypes.BUSINESS_PROCESS:
                    case MetadataTypes.COMPACT_LAYOUT:
                    case MetadataTypes.RECORD_TYPE:
                    case MetadataTypes.WEBLINK:
                    case MetadataTypes.VALIDATION_RULE:
                    case MetadataTypes.SHARING_REASON:
                    case MetadataTypes.LISTVIEW:
                    case MetadataTypes.FIELD_SET:
                        ignoreMetadataFromCustomObjects(metadata[metadataTypeName], ignoredMetadata[metadataTypeName], metadata, remove);
                        break;
                    default:
                        ignoreOtherMetadataTypes(metadata[metadataTypeName], ignoredMetadata[metadataTypeName], remove);
                        break;
                }
            }
        }
        return TypesFactory.deserializeMetadataTypes(metadata, true);
    }

    static ignoreProjectMetadata(projectPath, metadataDetails, ignorefile, options) {
        if (!options)
            options = {
                compress: false,
                sortOrder: undefined,
                typesForIgnore: undefined
            }
        projectPath = Validator.validateFolderPath(projectPath, 'Project');
        const ignoredMetadata = Validator.validateJSONFile(ignorefile, 'Ignore');
        metadataDetails = TypesFactory.createMetadataDetails(metadataDetails);
        const folderMetadataMap = TypesFactory.createFolderMetadataMap(metadataDetails);
        const metadataFromFileSystem = TypesFactory.createMetadataTypesFromFileSystem(folderMetadataMap, projectPath);
        //console.log(JSON.stringify(metadataFromFileSystem, null, 2));
        for (const metadataTypeName of Object.keys(ignoredMetadata)) {
            let typeData = TYPES_XML_RELATION[metadataTypeName];
            if (metadataFromFileSystem[metadataTypeName] || (typeData && typeData.singularName)) {
                if (options.typesForIgnore && !options.typesForIgnore.includes(metadataTypeName))
                    continue;
                switch (metadataTypeName) {
                    case MetadataTypes.CUSTOM_LABELS:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreFileCustomLabels(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName], typeData, options);
                        break;
                    case MetadataTypes.MATCHING_RULES:
                    case MetadataTypes.ASSIGNMENT_RULES:
                    case MetadataTypes.AUTORESPONSE_RULES:
                    case MetadataTypes.ESCALATION_RULES:
                        if (metadataFromFileSystem[typeData.singularName])
                            ignoreFileRules(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName], metadataFromFileSystem[typeData.singularName], options);
                        break;
                    case MetadataTypes.SHARING_CRITERIA_RULE:
                    case MetadataTypes.SHARING_OWNER_RULE:
                    case MetadataTypes.SHARING_GUEST_RULE:
                    case MetadataTypes.SHARING_TERRITORY_RULE:
                    case MetadataTypes.WORKFLOW_ALERT:
                    case MetadataTypes.WORKFLOW_KNOWLEDGE_PUBLISH:
                    case MetadataTypes.WORKFLOW_FIELD_UPDATE:
                    case MetadataTypes.WORKFLOW_RULE:
                    case MetadataTypes.WORKFLOW_TASK:
                    case MetadataTypes.WORKFLOW_OUTBOUND_MESSAGE:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreFileMetadataFromFiles(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName], options);
                        break;
                    case MetadataTypes.CUSTOM_OBJECT:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreFileCustomObjects(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName]);
                        break;
                    case MetadataTypes.CUSTOM_FIELD:
                    case MetadataTypes.INDEX:
                    case MetadataTypes.BUSINESS_PROCESS:
                    case MetadataTypes.COMPACT_LAYOUT:
                    case MetadataTypes.RECORD_TYPE:
                    case MetadataTypes.WEBLINK:
                    case MetadataTypes.VALIDATION_RULE:
                    case MetadataTypes.SHARING_REASON:
                    case MetadataTypes.LISTVIEW:
                    case MetadataTypes.FIELD_SET:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreFileFromCustomObjects(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName]);
                        break;
                    case MetadataTypes.EMAIL_TEMPLATE:
                    case MetadataTypes.REPORT:
                    case MetadataTypes.DASHBOARD:
                    case MetadataTypes.DOCUMENT:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreFileMetadataFromFolders(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName]);
                        break;
                    case MetadataTypes.PROFILE:
                    case MetadataTypes.PERMISSION_SET:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreFromPermissionFiles(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName], options);
                        break;
                    default:
                        if (metadataFromFileSystem[metadataTypeName] && ignoredMetadata[metadataTypeName])
                            ignoreMetadataFiles(metadataFromFileSystem[metadataTypeName], ignoredMetadata[metadataTypeName]);
                        break;
                }
            }
        }
    }

}
module.exports = Ignore;

function createIgnoreMap(objectsForIgnore) {
    let objectToIgnoreMap = {};
    for (let objectToIgnore of objectsForIgnore) {
        if (objectToIgnore.indexOf(':') !== -1) {
            let splits = objectToIgnore.split(':');
            if (splits.length === 2) {
                if (!objectToIgnoreMap[splits[0]])
                    objectToIgnoreMap[splits[0]] = [];
                objectToIgnoreMap[splits[0]].push(splits[1]);
            } else if (splits.length === 3 && splits[0].toLowerCase() === 'userpermission') {
                if (!objectToIgnoreMap[splits[1]])
                    objectToIgnoreMap[splits[1]] = [];
                objectToIgnoreMap[splits[1]].push({ permission: splits[2] });
            }
        } else {
            objectToIgnoreMap[objectToIgnore] = [objectToIgnore];
        }
    }
    return objectToIgnoreMap;
}

function ignoreMetadataCustomLabels(metadataType, ignoredMetadata, singularType, remove) {
    let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
    if (ignoredMetadata.includes('*')) {
        if (metadataType) {
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove)
                    delete metadataType.childs[objectKey];
                else
                    metadataType.childs[objectKey].checked = false;
            });
        }
    }
    if (singularType) {
        let dataToRemove = [];
        let dataToKeep = [];
        Object.keys(singularType.childs).forEach(function (objectKey) {
            if (ignoredMetadata.includes('*') || (ignoredFromTypeMap[objectKey] && ignoredFromTypeMap[objectKey].includes(objectKey))) {
                if (remove) {
                    delete singularType.childs[objectKey];
                } else {
                    singularType.childs[objectKey].checked = false;
                }
                dataToRemove.push(objectKey);
            } else {
                dataToKeep.push(objectKey);
            }
        });
        if (dataToRemove.length > 0) {
            if (metadataType) {
                Object.keys(metadataType.childs).forEach(function (objectKey) {
                    if (remove)
                        delete metadataType.childs[objectKey];
                    else
                        metadataType.childs[objectKey].checked = false;
                });
            }
        }
    }
}

function ignoreMetadataRules(metadataType, ignoredMetadata, singularType, remove) {
    let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
    if (ignoredMetadata.includes('*')) {
        if (metadataType) {
            metadataType.checked = false;
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove)
                    delete metadataType.childs[objectKey];
                else
                    metadataType.childs[objectKey].checked = false;
            });
        }
    }
    if (singularType) {
        let dataToRemove = [];
        Object.keys(singularType.childs).forEach(function (objectKey) {
            if (singularType.childs[objectKey].childs && Object.keys(singularType.childs[objectKey].childs).length > 0) {
                Object.keys(singularType.childs[objectKey].childs).forEach(function (itemKey) {
                    if (ignoredMetadata.includes('*') || (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(itemKey) || ignoredFromTypeMap[objectKey].includes('*')))) {
                        if (remove) {
                            delete singularType.childs[objectKey].childs[itemKey];
                        }
                        else {
                            singularType.childs[objectKey].checked = false;
                            singularType.childs[objectKey].childs[itemKey].checked = false;
                        }
                        dataToRemove.push(objectKey + ':' + itemKey);
                    }
                });
                if (remove && singularType.childs[objectKey] && Object.keys(singularType.childs[objectKey].childs).length === 0)
                    delete singularType.childs[objectKey];
            } else if (ignoredMetadata.includes('*') || (ignoredFromTypeMap[objectKey] && ignoredFromTypeMap[objectKey].includes('*'))) {
                if (remove) {
                    delete singularType.childs[objectKey];
                } else {
                    singularType.childs[objectKey].checked = false;
                }
                dataToRemove.push(objectKey + ':*');
            }
        });
        if (dataToRemove.length > 0) {
            if (metadataType) {
                Object.keys(metadataType.childs).forEach(function (objectKey) {
                    if (remove)
                        delete metadataType.childs[objectKey];
                    else
                        metadataType.childs[objectKey].checked = false;
                });
            }
        }
    }
}

function ignoreMetadataWithChilds(metadataType, ignoredMetadata, allTypes, remove) {
    if (METADATA_WITH_CHILDS[metadataType.name]) {
        if (ignoredMetadata.includes('*')) {
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove)
                    delete metadataType.childs[objectKey];
                else
                    metadataType.childs[objectKey].checked = false;
            });
            for (let childType of METADATA_WITH_CHILDS[metadataType.name]) {
                if (allTypes[childType]) {
                    Object.keys(allTypes[childType].childs).forEach(function (objectKey) {
                        if (allTypes[childType] && allTypes[childType].childs[objectKey]) {
                            if (remove) {
                                delete allTypes[childType].childs[objectKey];
                            } else {
                                allTypes[childType].childs[objectKey].checked = false;
                                Object.keys(allTypes[childType].childs[objectKey].childs).forEach(function (itemKey) {
                                    allTypes[childType].childs[objectKey].childs[itemKey].checked = false;
                                });
                            }
                        }
                    });
                }
            }
        } else {
            let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(objectKey) || ignoredFromTypeMap[objectKey].includes('*'))) {
                    if (remove) {
                        delete metadataType.childs[objectKey];
                    } else {
                        metadataType.childs[objectKey].checked = false;
                    }
                    for (let childType of METADATA_WITH_CHILDS[metadataType.name]) {
                        if (allTypes[childType] && allTypes[childType].childs[objectKey]) {
                            Object.keys(allTypes[childType].childs[objectKey].childs).forEach(function (itemKey) {
                                if (remove) {
                                    delete allTypes[childType].childs[objectKey].childs[itemKey];
                                } else {
                                    allTypes[childType].childs[objectKey].childs[itemKey].checked = false;
                                }
                            });
                        }
                    }
                }
            });
        }
    } else {
        if (ignoredMetadata.includes('*')) {
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove) {
                    delete metadataType.childs[objectKey];
                } else {
                    metadataType.childs[objectKey].checked = false;
                    Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                        metadataType.childs[objectKey].childs[itemKey].checked = false;
                    });
                }
            });
        } else {
            let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                let removeData = [];
                Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                    if (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(itemKey) || ignoredFromTypeMap[objectKey].includes('*'))) {
                        if (remove) {
                            delete metadataType.childs[objectKey].childs[itemKey];
                        } else {
                            metadataType.childs[objectKey].childs[itemKey].checked = false;
                        }
                        removeData.push(objectKey + ':' + itemKey);
                    }
                });
            });
        }

    }
}

function ignoreMetadataFromCustomObjects(metadataType, ignoredMetadata, allTypes, remove) {
    if (METADATA_WITH_CHILDS[metadataType.name]) {
        if (ignoredMetadata.includes('*:*')) {
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove) {
                    delete metadataType.childs[objectKey];
                } else {
                    metadataType.childs[objectKey].checked = false;
                }
            });
            for (let childType of METADATA_WITH_CHILDS[metadataType.name]) {
                if (allTypes[childType]) {
                    Object.keys(allTypes[childType].childs).forEach(function (objectKey) {
                        if (remove) {
                            delete allTypes[childType].childs[objectKey];
                        } else {
                            allTypes[childType].childs[objectKey].checked = false;
                            Object.keys(allTypes[childType].childs[objectKey].childs).forEach(function (itemKey) {
                                allTypes[childType].childs[objectKey].childs[itemKey].checked = false;
                            });
                        }
                    });
                }
            }
        } else if (ignoredMetadata.includes('*')) {
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove) {
                    delete metadataType.childs[objectKey];
                } else {
                    metadataType.childs[objectKey].checked = false;
                }
            });
        } else {
            let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(objectKey) || ignoredFromTypeMap[objectKey].includes('*'))) {
                    if (remove) {
                        delete metadataType.childs[objectKey];
                    } else {
                        metadataType.childs[objectKey].checked = false;
                    }
                    if (ignoredFromTypeMap[objectKey].includes('*')) {
                        for (let childType of METADATA_WITH_CHILDS[metadataType.name]) {
                            if (allTypes[childType] && allTypes[childType].childs[objectKey]) {
                                Object.keys(allTypes[childType].childs[objectKey].childs).forEach(function (itemKey) {
                                    if (remove) {
                                        delete allTypes[childType].childs[objectKey].childs[itemKey];
                                    } else {
                                        allTypes[childType].childs[objectKey].childs[itemKey].checked = false;
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    } else {
        if (ignoredMetadata.includes('*')) {
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                if (remove) {
                    delete metadataType.childs[objectKey];
                } else {
                    metadataType.childs[objectKey].checked = false;
                    Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                        metadataType.childs[objectKey].childs[itemKey].checked = false;
                    });
                }
            });
        } else {
            let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
            Object.keys(metadataType.childs).forEach(function (objectKey) {
                Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                    if (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(itemKey) || ignoredFromTypeMap[objectKey].includes('*'))) {
                        if (remove) {
                            delete metadataType.childs[objectKey].childs[itemKey];
                        } else {
                            metadataType.childs[objectKey].childs[itemKey].checked = false;
                        }
                    }
                });

            });
        }
    }
}

function ignoreOtherMetadataTypes(metadataType, ignoredMetadata, remove) {
    if (ignoredMetadata.includes('*')) {
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            if (remove) {
                delete metadataType.childs[objectKey];
            } else {
                metadataType.childs[objectKey].checked = false;
                Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                    metadataType.childs[objectKey].childs[itemKey].checked = false;
                });
            }
        });
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            if (ignoredFromTypeMap[objectKey]) {
                if (ignoredFromTypeMap[objectKey].includes('*') || ignoredFromTypeMap[objectKey].includes(objectKey)) {
                    if (remove && (!metadataType.childs[objectKey].childs || Object.keys(metadataType.childs[objectKey].childs).length === 0)) {
                        delete metadataType.childs[objectKey];
                    } else {
                        if(!metadataType.childs[objectKey].childs || Object.keys(metadataType.childs[objectKey].childs).length === 0)
                            metadataType.childs[objectKey].checked = false;
                        Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                            if (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(itemKey) || ignoredFromTypeMap[objectKey].includes('*'))) {
                                if (remove) {
                                    delete metadataType.childs[objectKey].childs[itemKey];
                                } else {
                                    metadataType.childs[objectKey].childs[itemKey].checked = false;
                                }
                            }
                        });
                    }
                } else {
                    Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                        if (ignoredFromTypeMap[objectKey] && (ignoredFromTypeMap[objectKey].includes(itemKey) || ignoredFromTypeMap[objectKey].includes('*'))) {
                            if (remove) {
                                delete metadataType.childs[objectKey].childs[itemKey];
                            } else {
                                metadataType.childs[objectKey].childs[itemKey].checked = false;
                            }
                        }
                    });
                }
            }
        });
    }
}

function ignoreFromPermissionFiles(metadataType, ignoredMetadata, options) {
    if (ignoredMetadata.includes('*')) {
        if (FileChecker.isExists(metadataType.path))
            FileWriter.delete(metadataType.path);
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        let permissionsToIgnore = {};
        Object.keys(ignoredFromTypeMap).forEach(function (ignoredObjectKey) {
            let ignoredTypes = ignoredFromTypeMap[ignoredObjectKey];
            for (let ignoredType of ignoredTypes) {
                if (ignoredType.permission) {
                    if (!permissionsToIgnore[ignoredObjectKey])
                        permissionsToIgnore[ignoredObjectKey] = [];
                    if (!permissionsToIgnore[ignoredObjectKey].includes(ignoredType.permission))
                        permissionsToIgnore[ignoredObjectKey].push(ignoredType.permission);
                }
            }
        });
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            if (ignoredFromTypeMap[objectKey]) {
                if (ignoredFromTypeMap[objectKey].includes(objectKey)) {
                    if (FileChecker.isExists(metadataType.childs[objectKey].path))
                        FileWriter.delete(metadataType.childs[objectKey].path);
                }
            }
        });
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            if (permissionsToIgnore[objectKey] || permissionsToIgnore['*']) {
                let xmlRoot = XMLParser.parseXML(FileReader.readFileSync(metadataType.childs[objectKey].path), false);
                if (xmlRoot[metadataType.name] && xmlRoot[metadataType.name].userPermissions) {
                    xmlRoot[metadataType.name].userPermissions = Utils.forceArray(xmlRoot[metadataType.name].userPermissions);
                    let dataToRemove = [];
                    let dataToKeep = [];
                    for (let permission of xmlRoot[metadataType.name].userPermissions) {
                        if ((permissionsToIgnore[objectKey] && (permissionsToIgnore[objectKey].includes(permission.name) || permissionsToIgnore[objectKey].includes('*'))) || (permissionsToIgnore['*'] && permissionsToIgnore['*'].includes(permission.name))) {
                            dataToRemove.push(permission);
                        }
                    }
                    xmlRoot[metadataType.name].userPermissions = dataToKeep;
                    if (dataToRemove.length > 0) {
                        let content;
                        if (options.compress) {
                            content = XMLCompressor.getCompressedContentSync(xmlRoot, options.sortOrder);
                        } else {
                            content = XMLParser.toXML(xmlRoot);
                        }
                        FileWriter.createFileSync(metadataType.childs[objectKey].path, content);
                    }
                }
            }
        });
    }
}

function ignoreFileCustomObjects(metadataType, ignoredMetadata) {
    if (ignoredMetadata.includes('*:*')) {
        if (FileChecker.isExists(metadataType.path))
            FileWriter.delete(metadataType.path);
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            if (ignoredFromTypeMap[objectKey]) {
                if (ignoredFromTypeMap[objectKey].includes(objectKey) || ignoredMetadata.includes('*')) {
                    if (FileChecker.isExists(metadataType.childs[objectKey].path))
                        FileWriter.delete(metadataType.childs[objectKey].path);
                    let metaFile = metadataType.childs[objectKey].path + '-meta.xml';
                    if (FileChecker.isExists(metaFile))
                        FileWriter.delete(metaFile);
                } else if (ignoredFromTypeMap[objectKey].includes('*')) {
                    let folder = PathUtils.getDirname(metadataType.childs[objectKey].path);
                    if (FileChecker.isExists(folder))
                        FileWriter.delete(folder);

                }
            }
        });
    }
}

function ignoreFileFromCustomObjects(metadataType, ignoredMetadata) {
    let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
    Object.keys(metadataType.childs).forEach(function (objectKey) {
        if (ignoredMetadata.includes('*') || (ignoredFromTypeMap[objectKey] && ignoredFromTypeMap[objectKey].includes('*'))) {
            if (FileChecker.isExists(metadataType.childs[objectKey].path))
                FileWriter.delete(metadataType.childs[objectKey].path);
        } else if (ignoredFromTypeMap[objectKey]) {
            Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                if (ignoredFromTypeMap[objectKey].includes(itemKey)) {
                    if (FileChecker.isExists(metadataType.childs[objectKey].childs[itemKey].path))
                        FileWriter.delete(metadataType.childs[objectKey].childs[itemKey].path);
                }
            });
        }
    });
}

function ignoreMetadataFiles(metadataType, ignoredMetadata) {
    if (ignoredMetadata.includes('*')) {
        if (FileChecker.isExists(metadataType.path))
            FileWriter.delete(metadataType.path);
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            if (ignoredFromTypeMap[objectKey]) {
                if (metadataType.childs[objectKey].childs && Object.keys(metadataType.childs[objectKey].childs).length > 0) {
                    Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                        if (ignoredFromTypeMap[objectKey].includes(itemKey) || ignoredFromTypeMap[objectKey].includes('*')) {
                            if (FileChecker.isExists(metadataType.childs[objectKey].childs[itemKey].path))
                                FileWriter.delete(metadataType.childs[objectKey].childs[itemKey].path);
                            let metaFile = metadataType.childs[objectKey].childs[itemKey].path + '-meta.xml';
                            if (FileChecker.isExists(metaFile))
                                FileWriter.delete(metaFile);
                        }
                    });
                } else {
                    if (ignoredFromTypeMap[objectKey].includes(objectKey) || ignoredFromTypeMap[objectKey].includes('*')) {
                        if (FileChecker.isExists(metadataType.childs[objectKey].path))
                            FileWriter.delete(metadataType.childs[objectKey].path);
                        let metaFile = metadataType.childs[objectKey].path + '-meta.xml';
                        if (FileChecker.isExists(metaFile))
                            FileWriter.delete(metaFile);
                    }
                }
            }
        });
    }
}

function ignoreFileMetadataFromFolders(metadataType, ignoredMetadata) {
    if (ignoredMetadata.includes('*')) {
        if (FileChecker.isExists(metadataType.path))
            FileWriter.delete(metadataType.path);
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        console.log(ignoredFromTypeMap);
        Object.keys(metadataType.childs).forEach(function (objectKey) {
            console.log(objectKey);
            if (ignoredFromTypeMap[objectKey]) {
                if (ignoredFromTypeMap[objectKey].includes('*')) {
                    if (FileChecker.isExists(metadataType.childs[objectKey].path))
                        FileWriter.delete(metadataType.childs[objectKey].path);
                    let metaFile = metadataType.childs[objectKey].path + '.' + metadataType.suffix + 'Folder-meta.xml';
                    if (FileChecker.isExists(metaFile))
                        FileWriter.delete(metaFile);
                } else {
                    Object.keys(metadataType.childs[objectKey].childs).forEach(function (itemKey) {
                        if (ignoredFromTypeMap[objectKey].includes(itemKey)) {
                            if (FileChecker.isExists(metadataType.childs[objectKey].childs[itemKey].path))
                                FileWriter.delete(metadataType.childs[objectKey].childs[itemKey].path);
                            let metaFile = metadataType.childs[objectKey].childs[itemKey].path + '-meta.xml';
                            if (FileChecker.isExists(metaFile))
                                FileWriter.delete(metaFile);
                        }
                    });
                }
            }
        });
    }
}

function ignoreFileMetadataFromFiles(metadataType, ignoredMetadata, options) {
    let typeData = TYPES_XML_RELATION[metadataType.name];
    let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
    Object.keys(metadataType.childs).forEach(function (objectKey) {
        if (ignoredFromTypeMap[objectKey] || ignoredMetadata.includes('*')) {
            let path = metadataType.path + '/' + objectKey + '.' + metadataType.suffix + '-meta.xml';
            if (FileChecker.isExists(path)) {
                let xmlRoot = XMLParser.parseXML(FileReader.readFileSync(path), false);
                if (xmlRoot[typeData.parentName] && xmlRoot[typeData.parentName][typeData.collection]) {
                    if ((ignoredFromTypeMap[objectKey] && ignoredFromTypeMap[objectKey].includes('*')) || ignoredMetadata.includes('*')) {
                        xmlRoot[typeData.parentName][typeData.collection] = [];
                    } else if (ignoredFromTypeMap[objectKey]) {
                        xmlRoot[typeData.parentName][typeData.collection] = Utils.forceArray(xmlRoot[typeData.parentName][typeData.collection]);
                        let dataToRemove = [];
                        let dataToKeep = [];
                        for (let xmlElement of xmlRoot[typeData.parentName][typeData.collection]) {
                            let elementKey = xmlElement[typeData.fieldKey]
                            if (ignoredFromTypeMap[objectKey].includes(elementKey)) {
                                dataToRemove.push(xmlElement);
                            }
                        }
                        xmlRoot[typeData.parentName][typeData.collection] = dataToKeep;
                    }
                    let content;
                    if (options.compress) {
                        content = XMLCompressor.getCompressedContentSync(xmlRoot, options.sortOrder);
                    } else {
                        content = XMLParser.toXML(xmlRoot);
                    }
                    FileWriter.createFileSync(path, content);
                }
            }
        }
    });
}

function ignoreFileRules(metadataType, ignoredMetadata, singularType, options) {
    let typeData = TYPES_XML_RELATION[metadataType.name];
    if (ignoredMetadata.includes('*')) {
        if (FileChecker.isExists(metadataType.path))
            FileWriter.delete(metadataType.path);
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        if (singularType) {
            Object.keys(singularType.childs).forEach(function (objectKey) {
                if (ignoredFromTypeMap[objectKey]) {
                    if (ignoredFromTypeMap[objectKey].includes('*')) {
                        if (FileChecker.isExists(singularType.childs[objectKey].path))
                            FileWriter.delete(singularType.childs[objectKey].path);
                    } else {
                        let path = metadataType.path + '/' + objectKey + '.' + metadataType.suffix + '-meta.xml';
                        if (FileChecker.isExists(path)) {
                            let xmlRoot = XMLParser.parseXML(FileReader.readFileSync(path), false);
                            let dataToKeep = [];
                            let dataToRemove = [];
                            Object.keys(singularType.childs[objectKey].childs).forEach(function (itemKey) {
                                if (xmlRoot[metadataType.name] && xmlRoot[metadataType.name][typeData.collection]) {
                                    xmlRoot[metadataType.name][typeData.collection] = Utils.forceArray(xmlRoot[metadataType.name][typeData.collection]);
                                    for (let xmlElement of xmlRoot[metadataType.name][typeData.collection]) {
                                        let elementKey = xmlElement[typeData.fieldKey];
                                        if (ignoredFromTypeMap[objectKey] && ignoredFromTypeMap[objectKey].includes(elementKey)) {
                                            dataToRemove.push(xmlElement);
                                        }
                                    }
                                    xmlRoot[metadataType.name][typeData.collection] = dataToKeep;
                                }
                            });
                            if (dataToRemove.length > 0) {
                                let content;
                                if (options.compress) {
                                    content = XMLCompressor.getCompressedContentSync(xmlRoot, options.sortOrder);
                                } else {
                                    content = XMLParser.toXML(xmlRoot);
                                }
                                FileWriter.createFileSync(path, content);
                            }
                        }
                    }
                }
            });
        }
    }
}

function ignoreFileCustomLabels(metadataType, ignoredMetadata, options) {
    let typeData = TYPES_XML_RELATION[metadataType.name];
    if (ignoredMetadata.includes('*')) {
        if (FileChecker.isExists(metadataType.path))
            FileWriter.delete(metadataType.path);
    } else {
        let ignoredFromTypeMap = createIgnoreMap(ignoredMetadata);
        let path = metadataType.childs[metadataType.name].path;
        if (FileChecker.isExists(path)) {
            let xmlRoot = XMLParser.parseXML(FileReader.readFileSync(path), false);
            if (xmlRoot[metadataType.name] && xmlRoot[metadataType.name][typeData.collection]) {
                let dataToKeep = [];
                let dataToRemove = [];
                xmlRoot[metadataType.name][typeData.collection] = Utils.forceArray(xmlRoot[metadataType.name][typeData.collection]);
                for (let xmlElement of xmlRoot[metadataType.name][typeData.collection]) {
                    let elementKey = xmlElement[typeData.fieldKey]
                    if (ignoredFromTypeMap[elementKey] && ignoredFromTypeMap[elementKey].includes(elementKey)) {
                        dataToRemove.push(xmlElement);
                    }
                }
                xmlRoot[metadataType.name][typeData.collection] = dataToKeep;
                if (dataToRemove.length > 0) {
                    let content;
                    if (options.compress) {
                        content = XMLCompressor.getCompressedContentSync(xmlRoot, options.sortOrder);
                    } else {
                        content = XMLParser.toXML(xmlRoot);
                    }
                    FileWriter.createFileSync(path, content);
                }
            }
        }
    }
}