import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { PurchaseReturn } from 'cypress/support/enums/inv/purchaseReturn';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'purchaseReturn'], () => {
  describe('Purchase Return List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PurchaseReturn.PURCHASE_RETURNS).wait(5000);
    });

    /**
     * Checks the functionalities of the Purchase Return List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/628} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 29, 2023
     */
    it('checks the Purchase Return List Card', { tags: 'purchase-return-list-card' }, () => {
      const purchaseReturnIdColumn = 'purchaseReturnIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const siteName = 'Site';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(purchaseReturnIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(purchaseReturnIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(purchaseReturnIdColumn);
      listCardPage.filterColumn(purchaseReturnIdColumn, 1);
      listCardPage.clearColumnFilter(purchaseReturnIdColumn, 10);
      listCardPage.showInstantInsights(0, purchaseReturnIdColumn);
      listCardPage.groupColumn(siteName);
      listCardPage.ungroupColumn(siteName);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(purchaseReturnIdColumn, 'Purchase Return ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', PurchaseReturn.PURCHASE_RETURN).and('be.visible');
      cy.closeCardByTitle(PurchaseReturn.PURCHASE_RETURN);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', PurchaseReturn.PURCHASE_RETURN);
      cy.openCardInWindow(PurchaseReturn.PURCHASE_RETURNS);
    });
  });
});
