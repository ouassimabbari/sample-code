import { LightningElement, api, wire } from "lwc";
import { CloseActionScreenEvent } from "lightning/actions";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import getProductInfo from "@salesforce/apex/NewLocalComplaintController.getProductInfo";
import LOCAL_COMPLAINT_OBJECT from "@salesforce/schema/LocalComplaint__c";
import ALLEGATION_FIELD from "@salesforce/schema/LocalComplaint__c.Allegation__c";
import CALL_CENTER_SOLUTION_FIELD from "@salesforce/schema/LocalComplaint__c.CallCenterSolution__c";
import TSG_SOLUTION_FIELD from "@salesforce/schema/LocalComplaint__c.TSG_Solution__c";
import PRODUCT_NAME_FIELD from "@salesforce/schema/LocalComplaint__c.ProductName__c";
import TSG_URL_FIELD from "@salesforce/schema/LocalComplaint__c.TSGURL__c";
import LOCAL_COMPLAINT_DESCRIPTION_FIELD from "@salesforce/schema/LocalComplaint__c.LocalComplaintDescription__c";
import CODE_NON_ROCHE_FIELD from "@salesforce/schema/LocalComplaint__c.Code_non_Roche__c";
import SOLVED_AT_SERVICE_CENTER_FIELD from "@salesforce/schema/LocalComplaint__c.Solved_at_service_centre__c";
import CASE_FIELD from "@salesforce/schema/LocalComplaint__c.Case__c";
import STATUS_FIELD from "@salesforce/schema/LocalComplaint__c.Status__c";
import COMPLAINT_SOURCE_FIELD from "@salesforce/schema/LocalComplaint__c.ComplaintSource__c";
import FLI_SOLUTION_FIELD from "@salesforce/schema/LocalComplaint__c.FLISolution__c";
import CASE_COUNTRY_FIELD from "@salesforce/schema/LocalComplaint__c.CaseCountry__c";
import REPORTABLE_FIELD from "@salesforce/schema/LocalComplaint__c.Reportable__c";
import LOCAL_COMPLAINT_CONTACT_FIELD from "@salesforce/schema/LocalComplaint__c.LocalComplaintContact__c";
import AFFILIATE_ACTIONS_TAKEN_FIELD from "@salesforce/schema/LocalComplaint__c.Affiliate_Actions_Taken__c";
import CLINICAL_TRIAL_ID_FIELD from "@salesforce/schema/LocalComplaint__c.ClinicalTrialID__c";
import CLINICAL_TRIAL_PATIENT_ID_FIELD from "@salesforce/schema/LocalComplaint__c.ClinicalTrialPatientID__c";
import EVENT_DESCRIPTION_FIELD from "@salesforce/schema/LocalComplaint__c.Event_Description__c";
import REASON_FOR_NOT_ACCEPTING_FIELD from "@salesforce/schema/LocalComplaint__c.CHReasonforNotAccepting__c";
import SAFETY_OFFICER_CONCLUSION_FIELD from "@salesforce/schema/LocalComplaint__c.SafetyOfficerConclusion__c";
import CM_CLARIFY_ID_FIELD from "@salesforce/schema/LocalComplaint__c.CMClarifyID__c";
import OWNER_ID_FIELD from "@salesforce/schema/LocalComplaint__c.OwnerId";
import LAST_MODIFICATION_BY_ID_FIELD from "@salesforce/schema/LocalComplaint__c.LastModificationById__c";
import EXTERNAL_REFERENCE1_FIELD from "@salesforce/schema/LocalComplaint__c.External_Reference1__c";
import LAST_MODIFIED_DATE_FIELD from "@salesforce/schema/LocalComplaint__c.LastModifiedDate__c";

export default class NewLocalComplaint extends NavigationMixin(
  LightningElement
) {
  @api recordId;

  localComplaintObject = LOCAL_COMPLAINT_OBJECT;
  allegationField = ALLEGATION_FIELD;
  CallCenterSolutionField = CALL_CENTER_SOLUTION_FIELD;
  TsgSolutionField = TSG_SOLUTION_FIELD;
  ProductName = PRODUCT_NAME_FIELD;
  TsgUrlField = TSG_URL_FIELD;
  LocalComplaintDescriptionField = LOCAL_COMPLAINT_DESCRIPTION_FIELD;
  CodeNonRocheField = CODE_NON_ROCHE_FIELD;
  SolvedAtServiceCenterField = SOLVED_AT_SERVICE_CENTER_FIELD;
  CaseField = CASE_FIELD;
  StatusField = STATUS_FIELD;
  ComplaintSourceField = COMPLAINT_SOURCE_FIELD;
  FLISolutionField = FLI_SOLUTION_FIELD;
  CaseCountryField = CASE_COUNTRY_FIELD;
  ReportableField = REPORTABLE_FIELD;

  LocalComplaintContactField = LOCAL_COMPLAINT_CONTACT_FIELD;
  AffiliateActionsTakenField = AFFILIATE_ACTIONS_TAKEN_FIELD;
  ClinicalTrialIDField = CLINICAL_TRIAL_ID_FIELD;
  ClinicalTrialPatientIDField = CLINICAL_TRIAL_PATIENT_ID_FIELD;
  EventDescriptionField = EVENT_DESCRIPTION_FIELD;
  ReasonForNotAcceptingField = REASON_FOR_NOT_ACCEPTING_FIELD;
  SafetyOfficerConclusionField = SAFETY_OFFICER_CONCLUSION_FIELD;
  CMClarifyIDField = CM_CLARIFY_ID_FIELD;

  OwnerIdField = OWNER_ID_FIELD;
  LastModificationByIdField = LAST_MODIFICATION_BY_ID_FIELD;
  ExternalReference1Field = EXTERNAL_REFERENCE1_FIELD;
  LastModifiedDateField = LAST_MODIFIED_DATE_FIELD;
  disableSaveButton = false;

  allegationChosen = "";
  callCenterSolutionChosen = "";
  isOpenAllegationModal = false;
  isOpenCallCenterSolutionModal = false;
  productNameValue;

  get isOpenModal() {
    return this.isOpenCallCenterSolutionModal || this.isOpenAllegationModal;
  }
  // GET DATA FROM APEX
  @wire(getProductInfo, {
    caseId: "$recordId",
  })
  productNameValue;

  //EXECUTED AFTER SAVE IS SUCCESSFUL
  //SHOWS SUCCESS MESSAGE AND REDIRECTS TO THE DETAIL PAGE OF THE CREATED RECORD
  handleLocalComplaintCreated(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.detail.id,
        objectApiName: "LocalComplaint__c",
        actionName: "view",
      },
    });
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Local Complaint Created Successfully !!",
        variant: "success",
        mode: "dismissable",
      })
    );
  }

  //NAVIGATES TO THE CUSTOM LOOKUP COMPONENT FOR THE ALLEGATION FIELD
  handleOpenAllegationModal() {
    this.isOpenAllegationModal = true;
    this.isOpenModal = true;
  }

  //NAVIGATES TO THE CUSTOM LOOKUP COMPONENT FOR THE CALL CENTER SOLUTION FIELD
  handleOpenCallCenterSolutionModal() {
    this.isOpenCallCenterSolutionModal = true;
    this.isOpenModal = true;
  }

  //TO INTERCEPT THE SAVE EVENT AND DISABLE THE SAVE BUTTON
  handleSubmit(event) {
    event.preventDefault(); // stop the form from submitting
    const fields = event.detail.fields;
    this.disableSaveButton = true;
    this.template.querySelector("lightning-record-edit-form").submit(fields);
  }

  //CLOSES THE QUICK ACTION MODAL
  closeQuickAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
  }

  //TO EXIT THE CUSTOM LOOKUP COMPONENT FOR THE ALLEGATION FIELD AND COME BACK TO THE PARENT
  handleCloseAllegationModal() {
    this.isOpenAllegationModal = false;
  }

  //TO EXIT THE CUSTOM LOOKUP COMPONENT FOR THE CALL CENTER SOLUTION FIELD AND COME BACK TO THE PARENT
  handleCloseCallCenterSolutionModal() {
    this.isOpenCallCenterSolutionModal = false;
  }

  //GETS THE CODE CHOSEN IN THE CUSTOM LOOKUP COMPONENT FOR THE ALLEGATION FIELD
  handleSelectAllegation(event) {
    this.allegationChosen = event.detail;
    this.isOpenAllegationModal = false;
  }

  //GETS THE CODE CHOSEN IN THE CUSTOM LOOKUP COMPONENT FOR THE CALL CENTER SOLUTION FIELD
  handleSelectCallCenterSolution(event) {
    this.callCenterSolutionChosen = event.detail;
    this.isOpenCallCenterSolutionModal = false;
  }
}
