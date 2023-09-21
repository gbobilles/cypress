import { Sites } from "cypress/support/enums/admin/sites";
import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../fixtures/common/email.json";
import TestFilters from '../../support/utils/filterTest';

TestFilters(['regression', 'sites'], () => {
  describe('Sites List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openAdminCardByTitle(Sites.SITES).wait(5000);
    });

    /**
     * Checks the functionalities of the Sites List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: Spet 12, 2023
     */
    it('checks the Standard Repair List Card', { tags: 'site-list-card' }, () => {
      const siteIdentifierColumn = 'name';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const systemCode = 'Name';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(siteIdentifierColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(siteIdentifierColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(siteIdentifierColumn);
      listCardPage.filterColumn(siteIdentifierColumn, 1);
      listCardPage.clearColumnFilter(siteIdentifierColumn, 10);
      listCardPage.showInstantInsights(0, siteIdentifierColumn);
      listCardPage.groupColumn(systemCode);
      listCardPage.ungroupColumn(systemCode);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(siteIdentifierColumn, 'Name', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', Sites.SITE).and('be.visible');
      cy.closeCardByTitle(Sites.SITE);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', Sites.SITE);
      cy.openCardInWindow(Sites.SITES);
    });
  });
});
