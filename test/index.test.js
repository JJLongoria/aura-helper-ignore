const Ignore = require('../index');
const TypesFactory = require('@ah/metadata-factory');
const { FileWriter } = require('@ah/core').FileSystem;

describe('Testing ./index.js', () => {
    test('Testing ignoreMetadata()', () => {
        try {
            Ignore.ignoreMetadata();
        } catch (error) {
            expect(error.message).toMatch('You must to provied a Metadata JSON file path or Metadata JSON Object')
        }
        try {
            Ignore.ignoreMetadata('./test/assets/.ahignores.json', './test/assets/.ahignores.json');
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it')
        }
        try {
            Ignore.ignoreMetadata('./test/assets/package.xml', './test/assets/package.xml');
        } catch (error) {
            expect(error.message).toMatch('does not have a valid JSON content')
        }
        let metadata = TypesFactory.createMetadataTypesFromPackageXML('./test/assets/package.xml');
        try {
            Ignore.ignoreMetadata({});
        } catch (error) {
            expect(error.message).toMatch('Wrong JSON Format file. The main object has no keys and values')
        }
        try {
            Ignore.ignoreMetadata(metadata);
        } catch (error) {
            expect(error.message).toMatch('Wrong Ignore file path. Expect a file path and receive')
        }
        try {
            Ignore.ignoreMetadata(metadata, './test/assets/.ahignores.json');
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it')
        }
        try {
            Ignore.ignoreMetadata(metadata, './test/assets/package.xml');
        } catch (error) {
            expect(error.message).toMatch('does not have a valid JSON content')
        }
        // Terting ignore without * without remove
        let result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore.json');
        expect(result['ApexClass'].getChild('AccountProcessor').checked).toBeFalsy();
        expect(result['ApexComponent'].getChild('SiteFooter').checked).toBeFalsy();
        expect(result['ApexPage'].getChild('AnswersHome').checked).toBeFalsy();
        expect(result['ApexTrigger'].getChild('ALMARecordTrigger').checked).toBeFalsy();
        expect(result['AuraDefinitionBundle'].getChild('VoiceOrderConfiguratorComponent').checked).toBeFalsy();
        expect(result['CustomField'].getChild('Voice_Order__c').getChild('Search_Clause_Evaluation__c').checked).toBeFalsy();
        expect(result['CustomField'].getChild('Configured_Voice_Order__c').getChild('Assistant_Response__c').checked).toBeFalsy();
        expect(result['CustomField'].getChild('Configured_Voice_Order__c').getChild('Field_1_Name__c').checked).toBeFalsy();
        expect(result['CustomField'].getChild('Configured_Voice_Order__c').getChild('Field_1_Value__c').checked).toBeFalsy();
        expect(result['CustomObject'].getChild('ALMA_Record__c').checked).toBeFalsy();
        expect(result['ListView'].getChild('Voice_Order__c').getChild('All').checked).toBeFalsy();
        expect(result['StaticResource'].getChild('Voice_Management_Logo').checked).toBeFalsy();
        expect(result['WebLink'].getChild('Field_Transform__c').getChild('Advance_Transforms_Visualizer').checked).toBeFalsy();
        expect(result['CustomLabel'].getChild('Label1').checked).toBeFalsy();
        expect(result['MatchingRule'].getChild('Account').getChild('AccountMatchingRule1').checked).toBeFalsy();
        expect(result['WorkflowAlert'].getChild('Account').getChild('Alert2').checked).toBeFalsy();
        expect(result['Report'].getChild('folder1').getChild('report1').checked).toBeFalsy();
        expect(result['Report'].getChild('folder2').getChild('report2').checked).toBeFalsy();

        // Terting ignore without * and specified types for ignore
        result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore.json', ['ApexClass', 'ApexComponent', 'ApexPage']);
        expect(result['ApexClass'].getChild('AccountProcessor').checked).toBeFalsy();
        expect(result['ApexComponent'].getChild('SiteFooter').checked).toBeFalsy();
        expect(result['ApexPage'].getChild('AnswersHome').checked).toBeFalsy();

        // Terting ignore without * with remove
        result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore.json', undefined, true);
        expect(result['ApexClass'].getChild('AccountProcessor')).toBeUndefined();
        expect(result['ApexComponent'].getChild('SiteFooter')).toBeUndefined();
        expect(result['ApexPage'].getChild('AnswersHome')).toBeUndefined();
        expect(result['ApexTrigger'].getChild('ALMARecordTrigger')).toBeUndefined();
        expect(result['AuraDefinitionBundle'].getChild('VoiceOrderConfiguratorComponent')).toBeUndefined();
        expect(result['CustomField'].getChild('Voice_Order__c').getChild('Search_Clause_Evaluation__c')).toBeUndefined();
        expect(result['CustomField'].getChild('Configured_Voice_Order__c').getChild('Assistant_Response__c')).toBeUndefined();
        expect(result['CustomField'].getChild('Configured_Voice_Order__c').getChild('Field_1_Name__c')).toBeUndefined();
        expect(result['CustomField'].getChild('Configured_Voice_Order__c').getChild('Field_1_Value__c')).toBeUndefined();
        expect(result['CustomObject'].getChild('ALMA_Record__c')).toBeUndefined();
        expect(result['ListView'].getChild('Voice_Order__c').getChild('All')).toBeUndefined();
        expect(result['StaticResource'].getChild('Voice_Management_Logo')).toBeUndefined();
        expect(result['WebLink'].getChild('Field_Transform__c').getChild('Advance_Transforms_Visualizer')).toBeUndefined();
        expect(result['CustomLabel'].getChild('Label1')).toBeUndefined();
        expect(result['MatchingRule'].getChild('Account').getChild('AccountMatchingRule1')).toBeUndefined();
        expect(result['WorkflowAlert'].getChild('Account').getChild('Alert2')).toBeUndefined();
        expect(result['Report'].getChild('folder1').getChild('report1')).toBeUndefined();
        expect(result['Report'].getChild('folder2').getChild('report2')).toBeUndefined();

        // Testing ignore with * and without remove
        result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore2.json');
        expect(result['ApexClass'].getChild('AccountProcessor').checked).toBeFalsy();
        expect(result['ApexComponent'].getChild('SiteFooter').checked).toBeFalsy();
        expect(result['ApexPage'].getChild('AnswersHome').checked).toBeFalsy();
        expect(result['ApexTrigger'].getChild('ALMARecordTrigger').checked).toBeFalsy();
        expect(result['AuraDefinitionBundle'].getChild('VoiceOrderConfiguratorComponent').checked).toBeFalsy();
        expect(result['CustomField'].getChild('Voice_Order__c').getChild('Search_Clause_Evaluation__c').checked).toBeFalsy();
        expect(result['CustomObject'].getChild('ALMA_Record__c').checked).toBeFalsy();
        expect(result['ListView'].getChild('Voice_Order__c').getChild('All').checked).toBeFalsy();
        expect(result['StaticResource'].getChild('Voice_Management_Logo').checked).toBeFalsy();
        expect(result['WebLink'].getChild('Field_Transform__c').getChild('Advance_Transforms_Visualizer').checked).toBeFalsy();
        expect(result['CustomLabel'].getChild('Label1').checked).toBeFalsy();
        expect(result['MatchingRule'].getChild('Account').getChild('AccountMatchingRule1').checked).toBeFalsy();
        expect(result['WorkflowAlert'].getChild('Account').getChild('Alert2').checked).toBeFalsy();
        expect(result['Report'].getChild('folder1').getChild('report1').checked).toBeFalsy();

        // Testing ignore with * and remove
        result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore2.json', undefined, true);
        expect(result['ApexClass']).toBeUndefined();
        expect(result['ApexComponent']).toBeUndefined();
        expect(result['ApexPage']).toBeUndefined();
        expect(result['ApexTrigger']).toBeUndefined();
        expect(result['AuraDefinitionBundle']).toBeUndefined();
        expect(result['CustomField']).toBeUndefined();
        expect(result['CustomObject']).toBeUndefined();
        expect(result['ListView']).toBeUndefined();
        expect(result['StaticResource']).toBeUndefined();
        expect(result['WebLink']).toBeUndefined();
        expect(result['CustomLabel']).toBeUndefined();
        expect(result['MatchingRule']).toBeUndefined();
        expect(result['WorkflowAlert']).toBeUndefined();
        expect(result['Report']).toBeUndefined();

        // Testing ignore with *:* and without remove
        result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore3.json');
        expect(result['ApexClass'].getChild('AccountProcessor').checked).toBeFalsy();
        expect(result['ApexComponent'].getChild('SiteFooter').checked).toBeFalsy();
        expect(result['ApexPage'].getChild('AnswersHome').checked).toBeFalsy();
        expect(result['ApexTrigger'].getChild('ALMARecordTrigger').checked).toBeFalsy();
        expect(result['AuraDefinitionBundle'].getChild('VoiceOrderConfiguratorComponent').checked).toBeFalsy();
        expect(result['CustomField'].getChild('Voice_Order__c').getChild('Search_Clause_Evaluation__c').checked).toBeFalsy();
        expect(result['CustomObject'].getChild('ALMA_Record__c').checked).toBeFalsy();
        expect(result['ListView'].getChild('Voice_Order__c').getChild('All').checked).toBeFalsy();
        expect(result['StaticResource'].getChild('Voice_Management_Logo').checked).toBeFalsy();
        expect(result['WebLink'].getChild('Field_Transform__c').getChild('Advance_Transforms_Visualizer').checked).toBeFalsy();
        expect(result['CustomLabel'].getChild('Label1').checked).toBeFalsy();
        expect(result['MatchingRule'].getChild('Account').getChild('AccountMatchingRule1').checked).toBeFalsy();
        expect(result['WorkflowAlert'].getChild('Account').getChild('Alert2').checked).toBeFalsy();

        // Testing ignore with *:* and remove
        result = Ignore.ignoreMetadata(metadata, './test/assets/.ahignore3.json', undefined, true);
        expect(result['ApexClass']).toBeUndefined();
        expect(result['ApexComponent']).toBeUndefined();
        expect(result['ApexPage']).toBeUndefined();
        expect(result['ApexTrigger']).toBeUndefined();
        expect(result['AuraDefinitionBundle']).toBeUndefined();
        expect(result['CustomField']).toBeUndefined();
        expect(result['CustomObject']).toBeUndefined();
        expect(result['ListView']).toBeUndefined();
        expect(result['StaticResource']).toBeUndefined();
        expect(result['WebLink']).toBeUndefined();
        expect(result['CustomLabel']).toBeUndefined();
        expect(result['MatchingRule']).toBeUndefined();
        expect(result['WorkflowAlert']).toBeUndefined();
    });
    test('Testing ignoreProjectMetadata()', () => {
        const metadataDetails = TypesFactory.createMetadataDetails('./test/assets/metadataTypes.json');
        try {
            Ignore.ignoreProjectMetadata({}, metadataDetails);
        } catch (error) {
            expect(error.message).toMatch('Wrong Project path. Expect a folder path and receive')
        }
        try {
            Ignore.ignoreProjectMetadata('./test/assets/SFDXProjects', metadataDetails, './test/assets/.ahignores.json');
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it')
        }
        try {
            Ignore.ignoreProjectMetadata('./test/assets/package.xml', metadataDetails, './test/assets/package.xml');
        } catch (error) {
            expect(error.message).toMatch('is not a valid directory path')
        }
        try {
            Ignore.ignoreProjectMetadata('./test/assets/SFDXProject', metadataDetails);
        } catch (error) {
            expect(error.message).toMatch('Wrong Ignore file path. Expect a file path and receive')
        }
        try {
            Ignore.ignoreProjectMetadata('./test/assets/SFDXProject', metadataDetails, './test/assets/.ahignores.json');
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it')
        }
        try {
            Ignore.ignoreProjectMetadata('./test/assets/SFDXProject', metadataDetails, './test/assets/package.xml');
        } catch (error) {
            expect(error.message).toMatch('does not have a valid JSON content')
        }
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore.json');
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore.json', {
            typesForIgnore: ['ApexClass', 'ApexComponent', 'ApexPage']
        });
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore.json', {
            compress: true
        });
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore2.json');
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore2.json', {
            compress: true
        });
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore3.json');
        FileWriter.copyFolderSync('./test/assets/SFDXProject', './test/assets/SFDXProjectCopy', true);
        Ignore.ignoreProjectMetadata('./test/assets/SFDXProjectCopy', metadataDetails, './test/assets/.ahignore3.json', {
            compress: true
        });
    });
});