import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { PurchaseReceipt } from 'cypress/support/enums/inv/purchaseReceipt';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'purchaseReceipt'], () => {
  describe('Purchase Receipt List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PurchaseReceipt.PURCHASE_RECEIPTS).wait(5000);
    });

    /**
     * Checks the functionalities of the Purchase Receipt List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18618} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 29, 2023
     */
    it('checks the Purchase Receipt List Card', { tags: 'purchase-receipt-list-card' }, () => {
      const purchaseReceiptIdColumn = 'purchaseReceiptIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const siteName = 'Site';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(purchaseReceiptIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(purchaseReceiptIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(purchaseReceiptIdColumn);
      listCardPage.filterColumn(purchaseReceiptIdColumn, 1);
      listCardPage.clearColumnFilter(purchaseReceiptIdColumn, 10);
      listCardPage.showInstantInsights(0, purchaseReceiptIdColumn);
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
      listCardPage.searchAndSelect(purchaseReceiptIdColumn, 'Purchase Receipt ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', PurchaseReceipt.PURCHASE_RECEIPT).and('be.visible');
      cy.closeCardByTitle(PurchaseReceipt.PURCHASE_RECEIPT);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', PurchaseReceipt.PURCHASE_RECEIPT);
      cy.openCardInWindow(PurchaseReceipt.PURCHASE_RECEIPTS);
    });
  });
});
