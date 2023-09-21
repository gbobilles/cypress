import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { PurchaseRequisition } from 'cypress/support/enums/inv/purchaseRequisition';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'purchaseRequisition'], () => {
  describe('Purchase Requisition List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PurchaseRequisition.PURCHASE_REQUISITIONS).wait(5000);
    });

    /**
     * Checks the functionalities of the Purchase Requisition List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18689} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 29, 2023
     */
    it('checks the Purchase Requisition List Card', { tags: 'purchase-requisition-list-card' }, () => {
      const purchaseRequisitionIdColumn = 'purchaseRequisitionIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const vendorId = 'Vendor ID';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(purchaseRequisitionIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(purchaseRequisitionIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(purchaseRequisitionIdColumn);
      listCardPage.filterColumn(purchaseRequisitionIdColumn, 1);
      listCardPage.clearColumnFilter(purchaseRequisitionIdColumn, 10);
      listCardPage.showInstantInsights(0, purchaseRequisitionIdColumn);
      listCardPage.groupColumn(vendorId);
      listCardPage.ungroupColumn(vendorId);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(purchaseRequisitionIdColumn, 'Purchase Req ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', PurchaseRequisition.PURCHASE_REQUISITION).and('be.visible');
      cy.closeCardByTitle(PurchaseRequisition.PURCHASE_REQUISITION);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', PurchaseRequisition.PURCHASE_REQUISITION);
      cy.openCardInWindow(PurchaseRequisition.PURCHASE_REQUISITIONS);
    });
  });
});
