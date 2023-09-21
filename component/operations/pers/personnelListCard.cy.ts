import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { Personnel } from "cypress/support/enums/pers/personnel";
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'personnel'], () => {
  describe('Personnel List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Personnel.PERSONNEL);
    });

    /**
     * Checks the functionalities of the Personnel List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12665} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 6, 2023
     */
    it('checks the Personnel List Card', { tags: 'personnel-list-card' }, () => {
      const personnelLastNameColumn = 'lastName';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const site = 'Site';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.paginate(1, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(personnelLastNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(personnelLastNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(personnelLastNameColumn);
      listCardPage.filterColumn(personnelLastNameColumn, 1);
      listCardPage.clearColumnFilter(personnelLastNameColumn, 10);
      listCardPage.showInstantInsights(0, personnelLastNameColumn);
      listCardPage.groupColumn(site);
      listCardPage.ungroupColumn(site);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 30000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 30000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(personnelLastNameColumn, 'Last Name', 'Equals', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', Personnel.PERSON).and('be.visible');
      cy.closeCardByTitle(Personnel.PERSON);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', Personnel.PERSON);
      cy.openCardInWindow(Personnel.PERSONNEL);
    });
  });
});
