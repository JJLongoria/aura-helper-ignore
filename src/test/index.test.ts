import { Ignore } from '../index';
import { MetadataFactory } from '@aurahelper/metadata-factory';
import { FileWriter } from '@aurahelper/core';

describe('Testing ./index.js', () => {
    test('Testing ignoreMetadata()', () => {
        new Ignore().setCompress(true).setIgnoreFile('').setSortOrder('').setTypesToIgnore([]).sortAlphabetAsc().sortAlphabetDesc().sortComplexFirst().sortSimpleFirst().removeData(true);
        try {
            new Ignore('./src/test/assets/.ahignores.json').ignoreMetadata('./src/test/assets/.ahignores.json');
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it');
        }
        try {
            new Ignore('./src/test/assets/package.xml').ignoreMetadata('./src/test/assets/package.xml');
        } catch (error) {
            expect(error.message).toMatch('does not have a valid JSON content');
        }
        let metadata = MetadataFactory.createMetadataTypesFromPackageXML('./src/test/assets/package.xml');
        try {
            new Ignore('./src/test/assets/package.xml').ignoreMetadata('./src/test/assets/metadataTypes.xml');
        } catch (error) {
            expect(error.message).toMatch('Wrong JSON Format');
        }
        try {
            new Ignore('./src/test/assets/.ahignores.json').ignoreMetadata(metadata);
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it');
        }
        try {
            new Ignore('./src/test/assets/package.xml').ignoreMetadata(metadata);
        } catch (error) {
            expect(error.message).toMatch('does not have a valid JSON content');
        }
        // Terting ignore without * without remove
        let result = new Ignore('./src/test/assets/.ahignore.json').ignoreMetadata(metadata);
        expect(result['ApexClass']!.getChild('AccountProcessor')!.checked).toBeFalsy();
        expect(result['ApexComponent']!.getChild('SiteFooter')!.checked).toBeFalsy();
        expect(result['ApexPage']!.getChild('AnswersHome')!.checked).toBeFalsy();
        expect(result['ApexTrigger']!.getChild('ALMARecordTrigger')!.checked).toBeFalsy();
        expect(result['AuraDefinitionBundle']!.getChild('VoiceOrderConfiguratorComponent')!.checked).toBeFalsy();
        expect(result['CustomField']!.getChild('Voice_Order__c')!.getChild('Search_Clause_Evaluation__c')!.checked).toBeFalsy();
        expect(result['CustomField']!.getChild('Configured_Voice_Order__c')!.getChild('Assistant_Response__c')!.checked).toBeFalsy();
        expect(result['CustomField']!.getChild('Configured_Voice_Order__c')!.getChild('Field_1_Name__c')!.checked).toBeFalsy();
        expect(result['CustomField']!.getChild('Configured_Voice_Order__c')!.getChild('Field_1_Value__c')!.checked).toBeFalsy();
        expect(result['CustomObject']!.getChild('ALMA_Record__c')!.checked).toBeFalsy();
        expect(result['ListView']!.getChild('Voice_Order__c')!.getChild('All')!.checked).toBeFalsy();
        expect(result['StaticResource']!.getChild('Voice_Management_Logo')!.checked).toBeFalsy();
        expect(result['WebLink']!.getChild('Field_Transform__c')!.getChild('Advance_Transforms_Visualizer')!.checked).toBeFalsy();
        expect(result['CustomLabel']!.getChild('Label1')!.checked).toBeFalsy();
        expect(result['MatchingRule']!.getChild('Account')!.getChild('AccountMatchingRule1')!.checked).toBeFalsy();
        expect(result['WorkflowAlert']!.getChild('Account')!.getChild('Alert2')!.checked).toBeFalsy();
        expect(result['Report']!.getChild('folder1')!.getChild('report1')!.checked).toBeFalsy();
        expect(result['Report']!.getChild('folder2')!.getChild('report2')!.checked).toBeFalsy();

        // Terting ignore without * and specified types for ignore
        result = new Ignore('./src/test/assets/.ahignore.json').setTypesToIgnore(['ApexClass', 'ApexComponent', 'ApexPage']).ignoreMetadata(metadata);
        expect(result['ApexClass']!.getChild('AccountProcessor')!.checked).toBeFalsy();
        expect(result['ApexComponent']!.getChild('SiteFooter')!.checked).toBeFalsy();
        expect(result['ApexPage']!.getChild('AnswersHome')!.checked).toBeFalsy();

        // Terting ignore without * with remove
        result = new Ignore('./src/test/assets/.ahignore.json').removeData(true).ignoreMetadata(metadata);
        expect(result['ApexClass']!.getChild('AccountProcessor')).toBeUndefined();
        expect(result['ApexComponent']!.getChild('SiteFooter')).toBeUndefined();
        expect(result['ApexPage']!.getChild('AnswersHome')).toBeUndefined();
        expect(result['ApexTrigger'].getChild('ALMARecordTrigger')).toBeUndefined();
        expect(result['AuraDefinitionBundle']!.getChild('VoiceOrderConfiguratorComponent')).toBeUndefined();
        expect(result['CustomField']!.getChild('Voice_Order__c')!.getChild('Search_Clause_Evaluation__c')).toBeUndefined();
        expect(result['CustomField']!.getChild('Configured_Voice_Order__c')!.getChild('Assistant_Response__c')).toBeUndefined();
        expect(result['CustomField']!.getChild('Configured_Voice_Order__c')!.getChild('Field_1_Name__c')).toBeUndefined();
        expect(result['CustomField']!.getChild('Configured_Voice_Order__c')!.getChild('Field_1_Value__c')).toBeUndefined();
        expect(result['CustomObject']!.getChild('ALMA_Record__c')).toBeUndefined();
        expect(result['ListView']!.getChild('Voice_Order__c')!.getChild('All')).toBeUndefined();
        expect(result['StaticResource']!.getChild('Voice_Management_Logo')).toBeUndefined();
        expect(result['WebLink']!.getChild('Field_Transform__c')!.getChild('Advance_Transforms_Visualizer')).toBeUndefined();
        expect(result['CustomLabel']!.getChild('Label1')).toBeUndefined();
        expect(result['MatchingRule']!.getChild('Account')!.getChild('AccountMatchingRule1')).toBeUndefined();
        expect(result['WorkflowAlert']!.getChild('Account')!.getChild('Alert2')).toBeUndefined();
        expect(result['Report']!.getChild('folder1')!.getChild('report1')).toBeUndefined();
        expect(result['Report']!.getChild('folder2')!.getChild('report2')).toBeUndefined();

        // Testing ignore with * and without remove
        result = new Ignore('./src/test/assets/.ahignore2.json').ignoreMetadata(metadata);
        expect(result['ApexClass']!.getChild('AccountProcessor')!.checked).toBeFalsy();
        expect(result['ApexComponent']!.getChild('SiteFooter')!.checked).toBeFalsy();
        expect(result['ApexPage']!.getChild('AnswersHome')!.checked).toBeFalsy();
        expect(result['ApexTrigger']!.getChild('ALMARecordTrigger')!.checked).toBeFalsy();
        expect(result['AuraDefinitionBundle']!.getChild('VoiceOrderConfiguratorComponent')!.checked).toBeFalsy();
        expect(result['CustomField']!.getChild('Voice_Order__c')!.getChild('Search_Clause_Evaluation__c')!.checked).toBeFalsy();
        expect(result['CustomObject']!.getChild('ALMA_Record__c')!.checked).toBeFalsy();
        expect(result['ListView']!.getChild('Voice_Order__c')!.getChild('All')!.checked).toBeFalsy();
        expect(result['StaticResource']!.getChild('Voice_Management_Logo')!.checked).toBeFalsy();
        expect(result['WebLink']!.getChild('Field_Transform__c')!.getChild('Advance_Transforms_Visualizer')!.checked).toBeFalsy();
        expect(result['CustomLabel']!.getChild('Label1')!.checked).toBeFalsy();
        expect(result['MatchingRule']!.getChild('Account')!.getChild('AccountMatchingRule1')!.checked).toBeFalsy();
        expect(result['WorkflowAlert']!.getChild('Account')!.getChild('Alert2')!.checked).toBeFalsy();
        expect(result['Report']!.getChild('folder1')!.getChild('report1')!.checked).toBeFalsy();

        // Testing ignore with * and remove
        result = new Ignore('./src/test/assets/.ahignore2.json').removeData(true).ignoreMetadata(metadata);
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
        result = new Ignore('./src/test/assets/.ahignore3.json').ignoreMetadata(metadata);
        expect(result['ApexClass']!.getChild('AccountProcessor')!.checked).toBeFalsy();
        expect(result['ApexComponent']!.getChild('SiteFooter')!.checked).toBeFalsy();
        expect(result['ApexPage']!.getChild('AnswersHome')!.checked).toBeFalsy();
        expect(result['ApexTrigger']!.getChild('ALMARecordTrigger')!.checked).toBeFalsy();
        expect(result['AuraDefinitionBundle']!.getChild('VoiceOrderConfiguratorComponent')!.checked).toBeFalsy();
        expect(result['CustomField']!.getChild('Voice_Order__c')!.getChild('Search_Clause_Evaluation__c')!.checked).toBeFalsy();
        expect(result['CustomObject']!.getChild('ALMA_Record__c')!.checked).toBeFalsy();
        expect(result['ListView']!.getChild('Voice_Order__c')!.getChild('All')!.checked).toBeFalsy();
        expect(result['StaticResource']!.getChild('Voice_Management_Logo')!.checked).toBeFalsy();
        expect(result['WebLink']!.getChild('Field_Transform__c')!.getChild('Advance_Transforms_Visualizer')!.checked).toBeFalsy();
        expect(result['CustomLabel']!.getChild('Label1')!.checked).toBeFalsy();
        expect(result['MatchingRule']!.getChild('Account')!.getChild('AccountMatchingRule1')!.checked).toBeFalsy();
        expect(result['WorkflowAlert']!.getChild('Account')!.getChild('Alert2')!.checked).toBeFalsy();

        // Testing ignore with *:* and remove
        result = new Ignore('./src/test/assets/.ahignore3.json').removeData(true).ignoreMetadata(metadata);
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
        const metadataDetails = MetadataFactory.createMetadataDetails('./src/test/assets/metadataTypes.json');
        try {
            new Ignore('./src/test/assets/.ahignores.json').ignoreProjectMetadata('./src/test/assets/SFDXProjects', metadataDetails);
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it');
        }
        try {
            new Ignore('./src/test/assets/package.xml').ignoreProjectMetadata('./src/test/assets/package.xml', metadataDetails);
        } catch (error) {
            expect(error.message).toMatch('is not a valid directory path');
        }
        try {
            const ignore = new Ignore('./src/test/assets/.ahignores.json');
            ignore.ignoreProjectMetadata('./src/test/assets/SFDXProject', metadataDetails);
        } catch (error) {
            expect(error.message).toMatch('does not exists or not have access to it');
        }
        try {
            new Ignore('./src/test/assets/package.xml').ignoreProjectMetadata('./src/test/assets/SFDXProject', metadataDetails);
        } catch (error) {
            expect(error.message).toMatch('does not have a valid JSON content');
        }
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore.json').ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore.json').setTypesToIgnore(['ApexClass', 'ApexComponent', 'ApexPage']).ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore.json').setCompress(true).ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore2.json').ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore2.json').setCompress(true).ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore3.json').ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
        FileWriter.copyFolderSync('./src/test/assets/SFDXProject', './src/test/assets/SFDXProjectCopy', true);
        new Ignore('./src/test/assets/.ahignore3.json').setCompress(true).ignoreProjectMetadata('./src/test/assets/SFDXProjectCopy', metadataDetails);
    });
});