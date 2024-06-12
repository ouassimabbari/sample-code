import { LightningElement, track, api, wire } from "lwc";
import getCallCenterSolutions from "@salesforce/apex/LinkCallCenterSolutionController.getCallCenterSolutions";

export default class SearchCallCenterSolutions extends LightningElement {
  @api recordId;

  isOpenCallCenterSolutionModal = true;
  callCenterSolutionSearchValue = "";
  callCenterSolutionChosen = "";
  fixedWidth = "width:8rem;";
  callCenterSolutionRecords;
  @track callCenterSolutionsToDisplay = [];

  //GETTING DATA FROM APEX
  @wire(getCallCenterSolutions, { caseId: "$recordId" })
  callCenterSolutions(result) {
    this.callCenterSolutionsToDisplay = result.data;
    this.callCenterSolutionRecords = result.data;
  }

  //CLOSES THE CALL CENTER SOLUTION MODAL
  handleCloseCallCenterSolutionModal() {
    const closeCallCenterSolutionModalEvent = new CustomEvent(
      "closecallcentersolutionmodal",
      {}
    );
    this.dispatchEvent(closeCallCenterSolutionModalEvent);
  }

  //TAKES THE SEARCH STRING ENTERED BY USER AND FILTERS THE RECORDS TO BE DISPLAYED ACCORDINGLY
  handleKeyChange(event) {
    this.callCenterSolutionSearchValue = event.target.value;
    this.filterCallCenterSolutions(this.callCenterSolutionSearchValue);
  }

  filterCallCenterSolutions(callCenterSolutionSearchValue) {
    if (callCenterSolutionSearchValue) {
      this.callCenterSolutionsToDisplay = this.callCenterSolutionRecords;

      if (this.callCenterSolutionsToDisplay) {
        let recs = [];
        for (let rec of this.callCenterSolutionsToDisplay) {
          let valuesArray = Object.values(rec);

          for (let val of valuesArray) {
            if (val) {
              if (val.toLowerCase().includes(callCenterSolutionSearchValue)) {
                recs.push(rec);
                break;
              }
            }
          }
        }
        this.callCenterSolutionsToDisplay = recs;
      }
    } else {
      this.callCenterSolutionsToDisplay = this.callCenterSolutionRecords;
    }
  }

  //#region ***************** RESIZABLE COLUMNS *************************************/
  handlemousemove(e) {
    if (this._tableThColumn && this._tableThColumn.tagName === "TH") {
      this._diffX = e.pageX - this._pageX;

      this.template.querySelector("table").style.width =
        this.template.querySelector("table") - this._diffX + "px";

      this._tableThColumn.style.width = this._tableThWidth + this._diffX + "px";
      this._tableThInnerDiv.style.width = this._tableThColumn.style.width;

      let tableThs = this.template.querySelectorAll(
        "table thead .dv-dynamic-width"
      );
      let tableBodyRows = this.template.querySelectorAll("table tbody tr");
      tableBodyRows.forEach((row) => {
        let rowTds = row.querySelectorAll(".dv-dynamic-width");
        rowTds.forEach((td, ind) => {
          rowTds[ind].style.width = tableThs[ind].style.width;
        });
      });
    }
  }

  handlemouseup(e) {
    this._tableThColumn = undefined;
    this._tableThInnerDiv = undefined;
    this._pageX = undefined;
    this._tableThWidth = undefined;
  }

  handlemousedown(e) {
    if (!this._initWidths) {
      this._initWidths = [];
      let tableThs = this.template.querySelectorAll(
        "table thead .dv-dynamic-width"
      );
      tableThs.forEach((th) => {
        this._initWidths.push(th.style.width);
      });
    }

    this._tableThColumn = e.target.parentElement;
    this._tableThInnerDiv = e.target.parentElement;
    while (this._tableThColumn.tagName !== "TH") {
      this._tableThColumn = this._tableThColumn.parentNode;
    }
    while (!this._tableThInnerDiv.className.includes("slds-cell-fixed")) {
      this._tableThInnerDiv = this._tableThInnerDiv.parentNode;
    }
    this._pageX = e.pageX;

    this._padding = this.paddingDiff(this._tableThColumn);

    this._tableThWidth = this._tableThColumn.offsetWidth - this._padding;
  }

  paddingDiff(col) {
    if (this.getStyleVal(col, "box-sizing") === "border-box") {
      return 0;
    }

    this._padLeft = this.getStyleVal(col, "padding-left");
    this._padRight = this.getStyleVal(col, "padding-right");
    return parseInt(this._padLeft, 10) + parseInt(this._padRight, 10);
  }

  getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css);
  }

  //FOR HANDLING THE HORIZONTAL SCROLL OF TABLE MANUALLY
  tableOuterDivScrolled(event) {
    this._tableViewInnerDiv = this.template.querySelector(".tableViewInnerDiv");
    if (this._tableViewInnerDiv) {
      if (
        !this._tableViewInnerDivOffsetWidth ||
        this._tableViewInnerDivOffsetWidth === 0
      ) {
        this._tableViewInnerDivOffsetWidth =
          this._tableViewInnerDiv.offsetWidth;
      }
      this._tableViewInnerDiv.style =
        "width:" +
        (event.currentTarget.scrollLeft + this._tableViewInnerDivOffsetWidth) +
        "px;" +
        this.tableBodyStyle;
    }
    this.tableScrolled(event);
  }

  tableScrolled(event) {
    if (this.enableInfiniteScrolling) {
      if (
        event.target.scrollTop + event.target.offsetHeight >=
        event.target.scrollHeight
      ) {
        this.dispatchEvent(
          new CustomEvent("showmorerecords", {
            bubbles: true,
          })
        );
      }
    }
    if (this.enableBatchLoading) {
      if (
        event.target.scrollTop + event.target.offsetHeight >=
        event.target.scrollHeight
      ) {
        this.dispatchEvent(
          new CustomEvent("shownextbatch", {
            bubbles: true,
          })
        );
      }
    }
  }

  //SELECTS THE RECORD CLICKED ON BY THE USER AND SENDS IT BACK TO THE PARENT COMPONENT
  selectRow(event) {
    this.callCenterSolutionChosen =
      this.callCenterSolutionsToDisplay[event.currentTarget.dataset.index].Id;
    const selectCallCenterSolutionEvent = new CustomEvent(
      "selectcallcentersolution",
      {
        detail: this.callCenterSolutionChosen,
      }
    );
    this.dispatchEvent(selectCallCenterSolutionEvent);
  }
}
