import { BillingMethod } from "cypress/support/enums/admin/billingMethod";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { BillingMethodDetailCard } from "cypress/support/pages/admin/billingMethodDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'billingMethods'], () => {
  describe('Billing Methods Card', () => {
    const listCardPage = new ListCard();
    const billingMethodDetailCardPage = new BillingMethodDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const nameColumn = 'billingMethodName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(BillingMethod.BILLING_METHODS);
    });

    /**
     * Checks the Billing Methods Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18883} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 24, 2023
     */
    it('checks the Billing Methods Card', { tags: 'billing-methods' }, () => {
      const name = 'New Billing Method_' + MathUtils.generateRandomNumber(5);
      const description = 'Cash';
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(nameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(nameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(nameColumn, 1);
      listCardPage.clearColumnFilter(nameColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      billingMethodDetailCardPage.createBillingMethod(name, description);
      cy.closeCardByTitle(BillingMethod.BILLING_METHOD);
      listCardPage.searchRecord(nameColumn, name);
    });
  });
});
