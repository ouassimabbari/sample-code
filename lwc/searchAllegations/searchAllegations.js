import { LightningElement, track, api, wire } from "lwc";
import getAllegations from "@salesforce/apex/LinkAllegationController.getAllegations";

export default class SearchAllegations extends LightningElement {
  @api recordId;
  isOpenAllegationModal = true;
  allegationSearchValue = "";
  allegationChosen = "";
  fixedWidth = "width:8rem;";
  allegationRecords;
  @track allegationsToDisplay = [];

  //GETTING DATA FROM APEX
  @wire(getAllegations, { caseId: "$recordId" })
  allegations(result) {
    this.allegationsToDisplay = result.data;
    this.allegationRecords = result.data;
  }

  //CLOSES THE ALLEGATION MODAL
  handleCloseAllegationModal() {
    const closeAllegationModalEvent = new CustomEvent(
      "closeallegationmodal",
      {}
    );
    this.dispatchEvent(closeAllegationModalEvent);
  }

  //TAKES THE SEARCH STRING ENTERED BY USER AND FILTERS THE RECORDS TO BE DISPLAYED ACCORDINGLY
  handleKeyChange(event) {
    this.allegationSearchValue = event.target.value;
    this.filterAllegations(this.allegationSearchValue);
  }

  filterAllegations(allegationSearchValue) {
    if (allegationSearchValue) {
      this.allegationsToDisplay = this.allegationRecords;

      if (this.allegationsToDisplay) {
        let recs = [];
        for (let rec of this.allegationsToDisplay) {
          let valuesArray = Object.values(rec);

          for (let val of valuesArray) {
            if (val) {
              if (val.toLowerCase().includes(allegationSearchValue)) {
                recs.push(rec);
                break;
              }
            }
          }
        }
        this.allegationsToDisplay = recs;
      }
    } else {
      this.allegationsToDisplay = this.allegationRecords;
    }
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

  //#region ***************** RESIZABLE COLUMNS *************************************/
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

  //SELECTS THE RECORD CLICKED ON BY THE USER AND SENDS IT BACK TO THE PARENT COMPONENT
  selectRow(event) {
    this.allegationChosen =
      this.allegationsToDisplay[event.currentTarget.dataset.index].Id;
    const selectAllegationEvent = new CustomEvent("selectallegation", {
      detail: this.allegationChosen,
    });
    this.dispatchEvent(selectAllegationEvent);
  }
}
