import { SerialNumberType } from "cypress/support/enums/admin/serialNumberType";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { SerialNumberTypeDetailCard } from "cypress/support/pages/admin/serialNumberTypeDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'serialNumberTypes'], () => {
  describe('Serial Number Types Card', () => {
    const listCardPage = new ListCard();
    const serialNumberTypeDetailCardPage = new SerialNumberTypeDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const nameColumn = 'serialNumberTypeName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(SerialNumberType.SERIAL_NUMBER_TYPES);
    });

    /**
     * Checks the Serial Number Types Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18911} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 24, 2023
     */
    it('checks the Serial Number Types Card', { tags: 'serial-number-types' }, () => {
      const name = 'New Serial Number Type_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(nameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(nameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(nameColumn, 1);
      listCardPage.clearColumnFilter(nameColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      serialNumberTypeDetailCardPage.createSerialNumberType(name);
      cy.closeCardByTitle(SerialNumberType.SERIAL_NUMBER_TYPE);
      listCardPage.searchRecord(nameColumn, name);
    });
  });
});
