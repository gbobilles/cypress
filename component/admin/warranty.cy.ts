import { Warranty } from "cypress/support/enums/admin/warranty";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { WarrantyDetailCard } from "cypress/support/pages/admin/warrantyDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'warranties'], () => {
  describe('Warranties Card', () => {
    const listCardPage = new ListCard();
    const warrantyDetailCardPage = new WarrantyDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const nameColumn = 'name';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Warranty.WARRANTIES);
    });

    /**
     * Checks the Warranties Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3190} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 28, 2023
     */
    it('checks the Warranties Card', { tags: 'warranties' }, () => {
      const name = 'New Warranty_' + MathUtils.generateRandomNumber(5);
      const description = 'Regression';
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(nameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(nameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(nameColumn, 1);
      listCardPage.clearColumnFilter(nameColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      warrantyDetailCardPage.createWarranty(name, description);
      cy.closeCardByTitle(Warranty.WARRANTY);
      listCardPage.searchRecord(nameColumn, name);
    });
  });
});
