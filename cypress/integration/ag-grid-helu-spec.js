/// <reference types="cypress" />

import { sort } from "../../src/agGrid/sort.enum";
import {
  deleteKey,
  sortedCollectionByProperty,
} from "../../src/helpers/arrayHelpers";
import { filterOperator } from "../../src/agGrid/filterOperator.enum";

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

    it("verify table data", () => {
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

    it("filter table by checkbox", () => {


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
        cy.get('.ag-group-value').contains('Cost').parent().children('.ag-group-contracted').click()

        const expectedTableData = [
            {"EUR":"Revenues","Value":"67.942,59"},
            {"EUR":"Cost","Value":"38.012,46"},
            {"EUR":"5400 Cost of merchandise, 19% input tax","Value":"215,03"},
            {"EUR":"5400 Cost of merchandise, 19% input tax","Value":"163,86"},
            {"EUR":"5400 Cost of merchandise, 19% input tax","Value":"161,88"},
            {"EUR":"5400 Cost of merchandise, 19% input tax","Value":"114,61"},
            {"EUR":"5400 Cost of merchandise, 19% input tax","Value":"249,57"},
            {"EUR":"5425 Intra-European Union acquisitions, 19% input tax and 19% VAT","Value":"445,67"},
            {"EUR":"5425 Intra-European Union acquisitions, 19% input tax and 19% VAT","Value":"449,12"},
            {"EUR":"5425 Intra-European Union acquisitions, 19% input tax and 19% VAT","Value":"468,41"},
            {"EUR":"5425 Intra-European Union acquisitions, 19% input tax and 19% VAT","Value":"466,14"},
            {"EUR":"5425 Intra-European Union acquisitions, 19% input tax and 19% VAT","Value":"399,58"},
            {"EUR":"5552 Acquisition by 1st purchaser in a triangular transaction","Value":"1.297,59"},
            {"EUR":"5552 Acquisition by 1st purchaser in a triangular transaction","Value":"1.273,91"},
            {"EUR":"5552 Acquisition by 1st purchaser in a triangular transaction","Value":"1.329,21"},
            {"EUR":"5552 Acquisition by 1st purchaser in a triangular transaction","Value":"1.214,83"},
            {"EUR":"5552 Acquisition by 1st purchaser in a triangular transaction","Value":"1.318,70"},
            {"EUR":"5900 Purchased services","Value":"451,85"},
            {"EUR":"5900 Purchased services","Value":"318,41"},
            {"EUR":"5900 Purchased services","Value":"368,28"},
            {"EUR":"5900 Purchased services","Value":"452,19"},
            {"EUR":"5900 Purchased services","Value":"426,25"},
            {"EUR":"5901 Purchased services","Value":"507,73"},
            {"EUR":"Expense","Value":"73.920,19"},
            {"EUR":"Other operating revenue","Value":"688,60"},
        ];
        cy.get(agGridSelector)
          .getAgGridData()
          .then((actualTableData) => {
            cy.get(agGridSelector).agGridValidateRowsExactOrder(actualTableData, expectedTableData);
          });

      });
})