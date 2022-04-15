/**  
 * * @author        Ouassim Abbari
 * * @date          14/04/2022
 * * @description   Controller for the new local complaint lwc component which performs searching the product name and id.
 * @version         <1.0>
 * @reference       Services Core 1.0 Build
 */
public with sharing class NewLocalComplaintController {
    @AuraEnabled(cacheable=true)
    public static String getProductName(String caseId){

        CaseAsset__c firstCA = [select id,Asset__c,Asset__r.CH_GCH_Product__c  from CaseAsset__c 
                   where Case__c =:caseId AND Asset__r.CH_GCH_Product__c = true order by createddate limit 1];

        Asset an = [select Product2.Name, Product2.InstrumentLineID__c,Product2.ProductID__c, SerialNumber, LotNumber__c,
              Asset_Usage__c from Asset where id = :firstCA.Asset__c];

        return an.Product2.Name;
    }
}
