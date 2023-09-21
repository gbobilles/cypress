import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { WorkRequest } from 'cypress/support/enums/shop/workRequest';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import { WorkRequestDetailCard } from 'cypress/support/pages/operations/shop/workRequestDetailCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'workRequest'], () => {
  describe('Work Request List Card', () => {
    const listCardPage = new ListCard();
    const workRequestDetailCardPage = new WorkRequestDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WorkRequest.WORK_REQUESTS).wait(5000);
    });

    /**
     * Checks the functionalities of the Work Request List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/618} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 4, 2023
     */
    it('checks the Work Request List Card', { tags: 'work-request-list-card' }, () => {
      const workRequestIdColumn = 'workRequestName';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const site = 'Asset Site';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(workRequestIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(workRequestIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(workRequestIdColumn);
      cy.get(commonLocators.gridContent).scrollTo('center', { ensureScrollable: false });
      listCardPage.filterColumn(workRequestIdColumn, 1);
      listCardPage.clearColumnFilter(workRequestIdColumn, 10);
      listCardPage.showInstantInsights(0, workRequestIdColumn);
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
      listCardPage.searchAndSelect(workRequestIdColumn, 'Work Request ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.getCommonElements().windowTitle().should('contain.text', WorkRequest.WORK_REQUEST).and('be.visible');
      cy.closeCardByTitle(WorkRequest.WORK_REQUEST);
      workRequestDetailCardPage.getCommonElements().windowTitle().should('not.contain.text', WorkRequest.WORK_REQUEST);
      cy.openCardInWindow(WorkRequest.WORK_REQUESTS);
    });
  });
});
