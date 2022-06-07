/// <reference types="cypress" />

import { sort } from "../../src/agGrid/sort.enum";
import {
  deleteKey,
  sortedCollectionByProperty,
} from "../../src/helpers/arrayHelpers";
import { filterOperator } from "../../src/agGrid/filterOperator.enum";
import "../support"

const _pageSize = 5;
const agGridSelector = "#app";

function removePropertyFromCollection(expectedTableData, columnsToExclude) {
    //Exclude any specified columns
    if (columnsToExclude) {
      columnsToExclude.forEach((excludedColumn) => {
        expectedTableData.forEach((obj) => deleteKey(obj, excludedColumn));
      });
    }
    return expectedTableData;
  }

describe("ag-grid scenarios", () => {
    beforeEach(() => {
      cy.visit("https://poc.helu.ninja/#/");
      cy.get(".ag-cell", {timeout: 10000}).should("be.visible");
    });

    it("verify table data",{ tags: '@smoke' } ,() => {
        const expectedTableData = [
            {"EUR":"Revenues","Value":"67.942,59"},
            {"EUR":"Cost","Value":"38.012,46"},
            {"EUR":"Expense","Value":"73.920,19"},
            {"EUR":"Other operating revenue","Value":"688,60"},
        ];
        cy.get(agGridSelector)
          .getAgGridData()
          .then((actualTableData) => {
            cy.get(agGridSelector).agGridValidateRowsExactOrder(actualTableData, expectedTableData);
          });
    });

    it("filter table by checkbox",{ tags: '@smoke' } ,() => {


        const expectedTableData = [
            {"EUR":"Revenues","Year":"","Value":"42.160,87"},
            {"EUR":"Cost","Year":"","Value":"25.697,38"},
            {"EUR":"Expense","Year":"","Value":"44.233,57"},
            {"EUR":"Other operating revenue","Year":"","Value":"688,60"},
        ];
       
        cy.get('[aria-posinset="5"] > .ag-column-select-column > .ag-column-select-checkbox > .ag-wrapper').click()
        cy.get(agGridSelector).agGridColumnFilterCheckboxMenu({
          searchCriteria: {
            columnName: "Year",
            filterValue: "2022",
          },
          hasApplyButton: false,
        });
        cy.wait(1000)
        cy.get(agGridSelector)
          .getAgGridData()
          .then((actualTableData) => {
            cy.get(agGridSelector).agGridValidateRowsExactOrder(actualTableData, expectedTableData);
          });
    });

    it("only validate select column data", () => {
        const expectedTableData = [
            {"Value":"67.942,59"},
            {"Value":"38.012,46"},
            {"Value":"73.920,19"},
            {"Value":"688,60"},
        ];
        cy.get(agGridSelector)
          .getAgGridData({ onlyColumns: ["Value"] })
          .then((actualTableData) => {
            cy.get(agGridSelector).agGridValidateRowsSubset(actualTableData, expectedTableData);
          });
    });

    it("remove column from grid and verify select column data", () => {
        cy.get(agGridSelector).agGridToggleColumnsSideBar("Value", true);
        cy.fixture("validata").then((expectedTableData) => {
          const expectedData_yearColumnRemoved = removePropertyFromCollection(
            expectedTableData,
            ["Value"]
          );
          cy.wait(1000)
          cy.get(agGridSelector)
            .getAgGridData()
            .then((actualTableData) => {
              cy.get(agGridSelector).agGridValidateRowsExactOrder(
                actualTableData,
                expectedData_yearColumnRemoved.slice(0, _pageSize)
              );
            });
        });
    });

    it("add column", () => {
        cy.get("#app").agGridToggleColumnsSideBar("Year", false);
    });

    it("expand row and verify table", () => {
        cy.get('.ag-group-value').contains('Expense').parent().children('.ag-group-contracted').click()
        cy.wait(1000)
        const expectedTableData = [
          {"EUR":"Revenues","Value":"67.942,59"},
          {"EUR":"Cost","Value":"38.012,46"},
          {"EUR":"Expense","Value":"73.920,19"},
          {"EUR":"Personnel","Value":"7.115,16"},
          {"EUR":"Other","Value":"35.172,13"},
          {"EUR":"Insurance & contribution","Value":"6.738,41"},
          {"EUR":"Advertising & travel","Value":"15.835,83"},
          {"EUR":"Physical space","Value":"4.087,75"},
          {"EUR":"Repair & maintenance","Value":"2.137,16"},
          {"EUR":"Vehicle","Value":"2.833,75"},
          {"EUR":"Other operating revenue","Value":"688,60"},
        ];
        cy.get(agGridSelector)
          .getAgGridData()
          .then((actualTableData) => {
            cy.get(agGridSelector).agGridValidateRowsExactOrder(actualTableData, expectedTableData);
          });

    });

    it ("failing/fixed test", () => {

      //throw new Error('Test fails here');
      cy.visit("https://poc.helu.ninja/#/");
    });
})