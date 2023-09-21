import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'workOrder'], () => {
  describe('Work Order List Card', () => {
    const listCardPage = new ListCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WorkOrder.WORK_ORDERS).wait(5000);
    });

    /**
     * Checks the functionalities of the Work Order List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18337} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 4, 2023
     */
    it('checks the Work Order List Card', { tags: 'work-order-list-card' }, () => {
      const workOrderIdColumn = 'workOrderIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const site = 'Site';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(workOrderIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(workOrderIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(workOrderIdColumn);
      listCardPage.filterColumn(workOrderIdColumn, 1);
      listCardPage.clearColumnFilter(workOrderIdColumn, 10);
      listCardPage.showInstantInsights(0, workOrderIdColumn);
      listCardPage.groupColumn(site);
      listCardPage.ungroupColumn(site);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(workOrderIdColumn, 'Work Order ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workOrderDetailCardPage.getCommonElements().windowTitle().should('contain.text', WorkOrder.WORK_ORDER).and('be.visible');
      cy.closeCardByTitle(WorkOrder.WORK_ORDER);
      workOrderDetailCardPage.getCommonElements().windowTitle().should('not.contain.text', WorkOrder.WORK_ORDER);
      cy.openCardInWindow(WorkOrder.WORK_ORDERS);
    });
  });
});
