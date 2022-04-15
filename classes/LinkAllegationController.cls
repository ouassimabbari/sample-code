/**  
 * * @author        Ouassim Abbari
 * * @date          14/04/2022
 * * @description   Controller for Lookup Page which performs searching codes and displaying on lookup window.
 * @version         <1.0>
 */
public with sharing class LinkAllegationController {
    
    @AuraEnabled(cacheable=true)
    public static List<Code__c> getAllegations(String caseId){

        CaseAsset__c firstCA = [select id,Asset__c,Asset__r.CH_GCH_Product__c  from CaseAsset__c 
                   where Case__c =:caseId AND Asset__r.CH_GCH_Product__c = true order by createddate limit 1];

        Asset an = [select Product2.Name, Product2.InstrumentLineID__c,Product2.ProductID__c, SerialNumber, LotNumber__c,
              Asset_Usage__c from Asset where id = :firstCA.Asset__c];

        String prodLineID = an.Product2.InstrumentLineID__c;

        System.debug('an.Product2.Name --------------------------- : ' + an.Product2.Name);

        List<Code__c> availableCodes = [Select Id, Code__c, CategoryCode__c, CategoryDescription__c,
            LineDescription__c, DescriptionOld__c, ValidFrom__c, ValidTo__c, Name from 
            Code__c Where name!=:system.label.PleaseSpecify1 and name!=:system.label.PleaseSpecify2 and
             name!=:system.label.NotApplicable and gpchId__c =:prodLineID and 
             CodeType__c =:system.label.CodeTypeCallCenterError and ValidFrom__c<=Today and
               ValidTo__c>Today Order by 
               Code__c.CategoryDescription__c limit 101];

        return availableCodes;
    }
}
