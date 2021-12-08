# **Aura Helper Ignore Module**

[![Version](https://img.shields.io/npm/v/@aurahelper/ignore?logo=npm)](https://www.npmjs.com/package/@aurahelper/ignore)
[![Total Downloads](https://img.shields.io/npm/dt/@aurahelper/ignore?logo=npm)](https://www.npmjs.com/package/@aurahelper/ignore)
[![Downloads/Month](https://img.shields.io/npm/dm/@aurahelper/ignore?logo=npm)](https://www.npmjs.com/package/@aurahelper/ignore)
[![Issues](https://img.shields.io/github/issues/jjlongoria/aura-helper-ignore)](https://github.com/JJLongoria/aura-helper-ignore/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/aura-helper-ignore/badge.svg)](https://snyk.io/test/github/JJLongoria/aura-helper-ignore)
[![Code Size](https://img.shields.io/github/languages/code-size/jjlongoria/aura-helper-ignore)](https://github.com/JJLongoria/aura-helper-ignore)
[![License](https://img.shields.io/github/license/jjlongoria/aura-helper-ignore?logo=github)](https://github.com/JJLongoria/aura-helper-ignore/blob/master/LICENSE)

Module to ignore metadata from your salesforce projects or from a JSON metadata object. This module will be specially util in some use cases, like Custom Label values unique for every environment (like ids...), or to avoid deploy some user permissions, or when you creating autogenerated package (from git for example) and like to excludo some metadata automatically. To understund the .ahignore.json file, see [Ignore File](#ignore-file) section.

This module is used to [@ah/package-generator](https://github.com/JJLongoria/aura-helper-package-generator) for ignore metadata types when created the package or detructive XML files. Also use [@aurahelper/xml-compressor](https://github.com/JJLongoria/aura-helper-xml-compressor) to compress the XML Files.

---

## *Table of Contents*

- [**Ignore Class**](#ignore-class)

- [**Metadata JSON Format**](#metadata-json-format)
  
- [**Ignore File**](#ignore-file)

---

# [**Ignore Class**](#ignore-class)
Class to ignore metadata from your salesforce projects or from a JSON metadata object. This class will be specially util in some use cases, like Custom Label values unique for every environment (like ids...), or to avoid deploy some user permissions, or when you creating autogenerated package (from git for example) and like to excludo some metadata automatically

The setters methods are defined like a builder pattern to make it more usefull

### *Class Members*
- [**Fields**](#fields)

- [**Constructors**](#constructors)

- [**Methods**](#methods)

</br>

# [**Fields**](#fields)
The fields that start with _ are for internal use only (Does not modify this fields to a correct Ignore work). To the rest of fields, setter methods are recommended instead modify fields.

### [**ignoreFile**](#ignore-fields-ignorefile)
Path to the ignore file
- `string`

### [**typesToIgnore**](#ignore-fields-typestoignore)
List with the Metadata Type API Names to ignore. This parameter is used to ignore only the specified metadata (also must be in ignore file) and avoid ignore all metadata types specified on the file.
- `string` | `{ [key:string]: MetadataType }`

### [**remove**](#ignore-fields-remove)
True to remove ignored elements from the result object, false only for unselect elements 
- `boolean`

### [**compress**](#ignore-fields-compress)
True to compress the XML Files, false in otherwise
- `boolean`

### [**sortOrder**](#ignore-fields-sortorder)
Sort order to order the XML elements. Values: simpleFirst, complexFirst, alphabetAsc or alphabetDesc. (alphabetDesc by default)
- `boolean`

</br>

# [**Constructors**](#constructors)

## [**constructor(ignorefile)**](#ignore-class-constructors-construct)
Constructor to instance a new Ignore object. All parameters are optional and you can use the setters methods to set the values when you want.

### **Parameters:**
  - **ignorefile**: Path to the ignore file
    - `string`

</br>

# [**Methods**](#methods)

  - [**onStartProcessType(callback)**](#onstartprocesstypecallback)

    Method to set the callback function to handle the event Start Process Metadata Type to handle the ignore progress 

  - [**onEndProcessType(callback)**](#onendprocesstypecallback)

    Method to set the callback function to handle the event End Process Metadata Type to handle the ignore progress

  - [**setIgnoreFile(ignoreFile)**](#setignorefileignorefile)

    Method to set the ignore file to ignore the metadata types

  - [**setTypesToIgnore(typesToIgnore)**](#settypestoignoretypestoignore)

    Method to set the Metadata Name or Names to ignore

  - [**removeData(remove)**](#removedataremove)

    Method to set if remove metadata from Metadata Object or only unselect it

  - [**setCompress(compress)**](#setcompresscompress)

    Method to set if compress the affected XML Files when the ignore project metadata

  - [**setSortOrder(sortOrder)**](#setsortordersortorder)

    Method to set the sort order for the XML Elements when compress the files

  - [**sortSimpleFirst()**](#sortsimplefirst)

    Method to set Simple XML Elements first as sort order (simpleFirst)

  - [**sortComplexFirst()**](#sortcomplexfirst)

    Method to set Complex XML Elements first as sort order (complexFirst)

  - [**sortAlphabetAsc()**](#sortalphabetasc)

    Method to set Alphabet Asc as sort order (alphabetAsc)

  - [**sortAlphabetDesc()**](#sortalphabetdesc)

    Method to set Alphabet Desc as sort order (alphabetDesc)

  - [**ignoreMetadata(metadataOrPath)**](#ignoremetadatametadataorpath)

    Method to ignore Metadata types from a Metadata JSON Object or Metadata JSON file. You can choose to uncheck elements or remove it from Metadata JSON.

  - [**ignoreProjectMetadata(projectPath, metadataDetails)**](#ignoreprojectmetadataprojectpath-metadatadetails)

    Method to ignore Metadata types from your local project. This method can delete some data from XML Files or entire XML files or folders according the ignore file data

---

## [**onStartProcessType(callback)**](#onstartprocesstypecallback)
Method to set the callback function to handle the event Start Process Metadata Type to handle the ignore progress 

### **Parameters:**
  - **callback**: callback function to handle the Start Process Metadata Type Event 
    - `Function`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Handle progress with on Start Process Type Event**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const ignore = new Ignore();
    ignore.onStartProcessType((metadataTypeAPIName) => {
        console.log(metadataTypeAPIName);
    });
```
---

## [**onEndProcessType(callback)**](#onendprocesstypecallback)
Method to set the callback function to handle the event End Process Metadata Type to handle the ignore progress  

### **Parameters:**
  - **callback**: callback function to handle the End Process Metadata Type Event 
    - `Function`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Handle progress with on End Process Type Event**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const ignore = new Ignore();
    ignore.onEndProcessType((metadataTypeAPIName) => {
        console.log(metadataTypeAPIName);
    });
```
---

## [**setIgnoreFile(ignoreFile)**](#setignorefileignorefile)
Method to set the ignore file to ignore the metadata types  

### **Parameters:**
  - **ignorefile**: Path to the ignore file
    - `string`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Set the ignore file**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const ignore = new Ignore();
    ignore.setIgnoreFile('path/to/the/ignore/file.json');
```
---

## [**setTypesToIgnore(typesToIgnore)**](#settypestoignoretypestoignore)
Method to set the Metadata Name or Names to ignore

### **Parameters:**
  - **typesToIgnore**: List with the Metadata Type API Names to ignore. This parameter is used to ignore only the specified metadata (also must be in ignore file) and avoid ignore all metadata types specified on the file.
    - `string[]`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Set the types to ignore**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const ignore = new Ignore();
    ignore.setTypesToIgnore(['CustomObject', 'CustomField', 'CustomTab']);
```
---

## [**removeData(remove)**](#removedataremove)
Method to set if remove metadata from Metadata Object or only unselect it

### **Parameters:**
  - **remove**: True to remove ignored elements from the result object, false only for unselect elements. If undefined or not pass parameter, also set to true 
    - `boolean`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Set remove data from Metadata Object result**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const ignore = new Ignore();
    ignore.removeData(true);
```
---

## [**setCompress(compress)**](#setcompresscompress)
True to compress the XML Files, false in otherwise. If undefined or not pass parameter, also set to true.

### **Parameters:**
  - **compress**: True to compress the XML Files, false in otherwise
    - `boolean`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Set compress affected XML Files**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const ignore = new Ignore();
    ignore.setCompress(true);
```
---

## [**setSortOrder(sortOrder)**](#setsortordersortorder)
Method to set the sort order value to sort the XML Elements when compress

### **Parameters:**
  - **sortOrder**: Sort order to order the XML elements. Values: simpleFirst, complexFirst, alphabetAsc or alphabetDesc. (alphabetDesc by default).
    - `string`

### **Return:**
Return the ignore object instance
- `Ignore`

### **Examples:**
**Set Sort order to order XML Elements**
```javascript
    import { XMLCompressor } from '@aurahelper/xml-compressor';
    import { Ignore } from '@aurahelper/ignore';
    
    const sortOrder = XMLCompressor.getSortOrderValues();
    const ignore = new Ignore();
    ignore.setSortOrder(sortOrder.SIMPLE_FIRST);
```
---

## [**sortSimpleFirst()**](#sortsimplefirst)
Method to set Simple XML Elements first as sort order (simpleFirst)

### **Return:**
Return the ignore object instance
- `Ignore`


### **Examples:**
**Set Simple first sort order to order XML Elements**
```javascript
    import { Ignore } from '@aurahelper/ignore';

    const ignore = new Ignore();    
    ignore.setIgnoreFile('path/to/the/ignore/file.json').sortSimpleFirst();
```
---

## [**sortComplexFirst()**](#sortcomplexfirst)
Method to set Complex XML Elements first as sort order (complexFirst)

### **Return:**
Return the ignore object instance
- `Ignore`


### **Examples:**
**Set Complex first sort order to order XML Elements**
```javascript
    import { Ignore } from '@aurahelper/ignore';

    const ignore = new Ignore();    
    ignore.setIgnoreFile('path/to/the/ignore/file.json').sortComplexFirst();
```
---

## [**sortAlphabetAsc()**](#sortalphabetasc)
Method to set Alphabet Asc as sort order (alphabetAsc)

### **Return:**
Return the ignore object instance
- `Ignore`


### **Examples:**
**Set Alphabet asc sort order to order XML Elements**
```javascript
    import { Ignore } from '@aurahelper/ignore';

    const ignore = new Ignore();    
    ignore.setIgnoreFile('path/to/the/ignore/file.json').sortAlphabetAsc();
```
---

## [**sortAlphabetDesc()**](#sortalphabetdesc)
Method to set Alphabet Desc as sort order (alphabetDesc)

### **Return:**
Return the ignore object instance
- `Ignore`


### **Examples:**
**Set Alphabet desc sort order to order XML Elements**
```javascript
    import { Ignore } from '@aurahelper/ignore';

    const ignore = new Ignore();    
    ignore.setIgnoreFile('path/to/the/ignore/file.json').sortAlphabetDesc();
```
---

## [**ignoreMetadata(metadataOrPath)**](#ignoremetadatametadataorpath)
Method to ignore Metadata types from a Metadata JSON Object or Metadata JSON file. You can choose to uncheck elements or remove it from Metadata JSON. See [Metadata JSON Format](#metadata-file) section to understand the JSON Metadata Format 

### **Parameters:**
  - **metadataOrPath**: Metadata JSON Object or Metadata JSON file path
    - `string` | `{ [key: string]: MetadataType }`

### **Return:**
Return a Metadata JSON Object with the ignored metadata unselected or removed
- `{ [key: string]: MetadataType }`

### **Throws:**
This method can throw the next exceptions:

- **`WrongFilePathException`**: If the metadata file path or ignore file path is not a String or can't convert to absolute path
- **`FileNotFoundException`**: If the metadata file path or ignore file not exists or not have access to it
- **`InvalidFilePathException`**: If the metadata file path or ignore file is not a file
- **`WrongFormatException`**: If metadata file path or ignore file is not a JSON file or Metadata Object are wrong

### **Examples:**
**Ignore Metadata from Metadata JSON Object**
```javascript
    import { Ignore } from '@aurahelper/ignore';
    const metadataObjects = {
        CustomObject: {
            name: 'CustomObject',
            childs: {
                Account: {
                    name: 'Account',
                    checked: true,
                    childs: {}
                }
            },
            checked: true,
        },
        CustomField: {
            name: 'CustomField',
            childs: {
                Account: {
                    name: 'Account',
                    checked: true,
                    childs: {
                        Name: {
                            name: 'Name',
                            checked: true
                        }
                    }
                }
            },
            checked: true,
        },
        {
            ...
        }
    }
    const ignoreFile = './path/to/ignore/file';
    const ignore = new Ignore(ignoreFile);
    const metadataTypes = ignore.ignoreMetadata(metadataObjects);

    console.log(metadataTypes);
```
**Ignore Specified Metadata from Metadata JSON File**
```javascript
    import { Ignore } from '@aurahelper/ignore';

    const typesForIgnore = ['CustomObject'];
    const metadataPath = 'path/to/json/file';
    const ignoreFile = './path/to/ignore/file';
    const ignore = new Ignore(ignoreFile).setTypesToIgnore(typesForIgnore);
    const metadataTypes = Ignore.ignoreMetadata(metadataPath);
    
    console.log(metadataTypes); 
```
**Ignore Metadata and Remove from Metadata JSON File**
```javascript
    import { Ignore } from '@aurahelper/ignore';

    const remove = true;
    const metadataPath = 'path/to/json/file';
    const ignoreFile = './path/to/ignore/file';
    const ignore = new Ignore(ignoreFile);
    ignore.removeData(remove);
    const metadataTypes = Ignore.ignoreMetadata(metadataPath);

    console.log(metadataTypes);
```
---

## [**ignoreProjectMetadata(projectPath, metadataDetails)**](#ignoreprojectmetadataprojectpath-metadatadetails)
Method to ignore Metadata types from your local project. This method can delete some data from XML Files or entire XML files or folders according the ignore file data

### **Parameters:**
  - **projectPath**: Salesforce Project root path
    - `string`
  - **metadataDetails**: Metadata details list
    - `MetadataDetail[]`

### **Throws:**
This method can throw the next exceptions:

- **`WrongFilePathException`**: If the ignore file path is not a String or can't convert to absolute path
- **`FileNotFoundException`**: If the ignore file not exists or not have access to it
- **`InvalidFilePathException`**: If the ignore file is not a file
- **`WrongFormatException`**: If ignore file is not a JSON file
- **`WrongDirectoryPathException`**: If the project path is not a String or can't convert to absolute path
- **`DirectoryNotFoundException`**: If the project path directory not exists or not have access to it
- **`InvalidDirectoryPathException`**: If the project path is not a directory

### **Examples:**
**Ignore Metadata from Project**

This option can remove entire file or folders from your project, or remove some metadata into your files like some custom labels from the custom labels file, or workflow alerts from your Account workflow file for example. For this operation, also need a Metadata Details from your salesforce project. You can get it with [@ah/connector](https://github.com/JJLongoria/aura-helper-connector) from your org using the listMetadataTypes() method. Also allow to you to compress files with the [@aurahelper/xml-compressor](https://github.com/JJLongoria/aura-helper-xml-compressor)

```javascript
    import { Ignore } from '@aurahelper/ignore';
    import { XMLCompressor, SORT_ORDER } from '@aurahelper/xml-compressor';
    import { Connection } from '@aurahelper/connector';
    // Get Metadata Details from your org using @ah/connector
    const connection = new Connection('MyOrg', '50');
    connection.setUsernameOrAlias('MyOrg');
    connection.setSingleThread();
    connection.listMetadataTypes().then((metadataDetails) => {
        const ignore = new Ignore('./path/to/ignore/file');

        ignore.ignoreProjectMetadata('path/to/your/project', metadataDetails);

        // Like on Ignore Metadata method, you can choose an optional metadata types for ignore
        ignore.setTypesToIgnore(['CustomObject', 'CustomField', 'ApexClass']);
        Ignore.ignoreProjectMetadata('path/to/your/project', metadataDetails);

        // Also you can choose to compress the modified files with @aurahelper/xml-compressor
        ignore.setCompress().sortSimpleFirst().setTypesToIgnore(['CustomObject', 'CustomField', 'ApexClass']);
        ignore.ignoreProjectMetadata('path/to/your/project', metadataDetails);
        
    }).catch((error) => {
        // Handle errors
    });
```
# [**Metadata JSON Format**](#metadata-file)

The Metadata JSON Format used by Aura Helper Framework and modules have the next structure. Some fields are required and the datatypes checked to ensure the correct file structure. 

```json
    {
        "MetadataAPIName": {
            "name": "MetadataAPIName",                                  // Required (String). Contains the Metadata Type API Name (like object Key)
            "checked": false,                                           // Required (Boolean). Field for include this type on package or not
            "path": "path/to/the/metadata/folder",                      // Optional (String). Path to the Metadata Type folder in local project
            "suffix": "fileSuffix",                                     // Optional (String). Metadata File suffix
            "childs": {                                                 // Object with a collection of childs (Field required (JSON Object) but can be an empty object)
                "MetadataObjectName":{
                    "name": "MetadataObjectName",                       // Required (String). Contains the Metadata Object API Name (like object Key)
                    "checked": false,                                   // Required (Boolean). Field for include this object on package or not
                    "path": "path/to/the/metadata/file/or/folder",      // Optional (String). Path to the object file or folder path
                    "childs": {                                         // Object with a collection of childs (Field required (JSON Object) but can be an empty object)
                        "MetadataItemName": {
                            "name": "MetadataItemName",                 // Required (String). Contains the Metadata Item API Name (like object Key)
                            "checked": false,                           // Required (Boolean). Field for include this object on package or not
                            "path": "path/to/the/metadata/file"
                        },
                        "MetadataItemName2": {
                            ...
                        },
                        ...,
                        ...,
                        ...
                    }
                }
                "MetadataObjectName2":{
                   ...
                },
                ...,
                ...,
                ...
            }
        }
    }
```
### **Example**:

```json

    {
        "CustomObject": {
            "name": "CustomObject",
            "checked": false,
            "path":  "path/to/root/project/force-app/main/default/objects",
            "suffix": "object",
            "childs": {
                "Account": {
                    "name": "Account",
                    "checked": true,            // Add Account Object to the package
                    "path": "path/to/root/project/force-app/main/default/objects/Account/Account.object-meta.xml",
                    "childs": {}
                },
                "Case": {
                    "name": "Case",
                    "checked": true,            // Add Case Object to the package
                    "path": "path/to/root/project/force-app/main/default/objects/Case/Case.object-meta.xml",
                    "childs": {}
                },
                ...,
                ...,
                ...
            }
        },
        "CustomField": {
            "name": "CustomField",
            "checked": false,
            "path":  "path/to/root/project/force-app/main/default/objects",
            "suffix": "field",
            "childs": {
                "Account": {
                    "name": "Account",
                    "checked": false,            
                    "path": "path/to/root/project/force-app/main/default/objects/Account/fields",
                    "childs": {
                        "customField__c": {
                            "name": "customField__c",
                            "checked": true,    // Add customField__c to the package
                            "path": "path/to/root/project/force-app/main/default/objects/Account/fields/customField__c.field-meta.xml",
                        },
                        ...,
                        ...,
                        ...
                    }
                },
                "Case": {
                    "name": "Case",
                    "checked": false,           
                    "path": "path/to/root/project/force-app/main/default/objects/Case/fields",
                    "childs": {
                        "CaseNumber": {
                            "name": "CaseNumber",
                            "checked": true,    // Add CaseNumber to the package
                            "path": "path/to/root/project/force-app/main/default/objects/Account/fields/CaseNumber.field-meta.xml",
                        },
                        ...,
                        ...,
                        ...
                    }
                },
                ...,
                ...,
                ...
            }
        }
    }
```

# [**Ignore File**](#ignore-file)

The ignore file is a JSON file used on ignore, create package or repair dependencies modules. On this file you can specify metadata types, objects and elements for ignore or delete from your local project or package files. You can have a main ignore file on your root project (like gitignore) named .ahignore.json for use automatically, or have different ignore files and specify it on the commands when you need tou use.

The ignore file have the next structure

```json
    {
        // Basic structure
        "MetadataTypeAPIName": {
            "MetadataObject1",
            "MetadataObject2"
        }

        // Advance Structure
        "MetadataTypeAPIName": {
            "MetadataObject1:MetadataItem1",
            "MetadataObject1:MetadataItem2",
            "MetadataObject2:*",
            "*",
            "*:*" // Only valid on Custom Objects
        }

        // Special for Permissions
        "MetadataTypeAPIName": {
            "UserPermission:MetadataObject1:PermissionName",
            "UserPermission:MetadataObject2:*",
            "UserPermission:*:PermissionName"
        }
    }

```

### **Example**:

```json
    {
        "CustomLabels": {
            "labelName1",                   // Ignore or remove the custom label "labelName1"
            "labelName2",                   // Ignore or remove the custom label "labelName2",
            "*"                             // Ignore or remove all Custom Labels
        },
        "AssignmentRules":{
            "Case:Assign1",                 // Ignore or remove the Assignent Rule "Assign1" from the object Case
            "Lead:*",                       // Ignore or remove all Assignment Rules from Lead
            "*"                             // Ignore or remove all Assignment Rules
        },
        "CustomObject": {
            "Account",                      // Ignore or remove the Account Object
            "Case:*",                       // Ignore or remove all related objects from case, including the object (Bussines Process, Fields, Validation Rules...),
            "*",                            // Ignore or remove all custom objects (only the object not the related metadata)
            "*:*",                          // Ignore or remove all custom objects and the related metadata (Bussines Process, Fields, Validation Rules...)
        },
        "Report": {
            "ReportFolder",                 // Ignore or remove the entire folder
            "ReportFolder1:ReportName2",    // Ignore or remove the report "ReportName2" from "ReportFolder1" folder.
            "*",                            // Ignore or remove all reports.
        },
        "Workflow": {
            "Account",                      // Ignore or remove the Account worflows (Rules, Task, Alerts...)
            "*"                             // Ignore or  remove all workflows (Rules, Task, Alerts...) from all objects 
        },
        "WorkflowRule": {
            "Case:*",                       // Ignore or remove all Workflow rules from case object
            "Account:Rule1",                // Ignore or remove "Rule1" from Account workflows,
            "*"                             // Ignore or remove all Worflow rules from all objects
        },
        "Profile": {
            "UserPermission:*:Permission1", // Remove the "Permission1" User Permission from all profiles
            "UserPermission:TestProfile:*", // Remove all User permissions from TestProfile file
            "UserPermission:Admin:Perm1",   // Remove the Perm1 User Permission from Admin profile
            "TestProfile2",                 // Ignore or remove  the "TestProfile" profile 
            "*"                             // Ignore or remove all profiles
        }
    }

```

#### IMPORTANT

    Some Metadata Types have singular and plural name like CustomLabels, MatchingRules, EscalationRules... For ignore or remove this types you must use the plural name, if use the singular name the ignore process not take effect with this types.