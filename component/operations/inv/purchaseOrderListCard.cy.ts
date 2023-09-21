import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { PurchaseOrder } from 'cypress/support/enums/inv/purchaseOrder';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'purchaseOrder'], () => {
  describe('Purchase Order List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openOperationsCardByTitle(PurchaseOrder.PURCHASE_ORDERS).wait(5000);
    });

    /**
     * Checks the functionalities of the Purchase Order List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/629} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 29, 2023
     */
    it('checks the Purchase Order List Card', { tags: 'purchase-order-list-card' }, () => {
      const purchaseOrderIdColumn = 'purchaseOrderIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const type = 'Type';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(purchaseOrderIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(purchaseOrderIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(purchaseOrderIdColumn);
      listCardPage.filterColumn(purchaseOrderIdColumn, 1);
      listCardPage.clearColumnFilter(purchaseOrderIdColumn, 10);
      listCardPage.showInstantInsights(0, purchaseOrderIdColumn);
      listCardPage.groupColumn(type);
      listCardPage.ungroupColumn(type);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(purchaseOrderIdColumn, 'PO ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', PurchaseOrder.PURCHASE_ORDER).and('be.visible');
      cy.closeCardByTitle(PurchaseOrder.PURCHASE_ORDER);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', PurchaseOrder.PURCHASE_ORDER);
      cy.openCardInWindow(PurchaseOrder.PURCHASE_ORDERS);
    });
  });
});
