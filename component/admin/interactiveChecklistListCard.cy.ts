import { InteractiveChecklist } from "cypress/support/enums/admin/interactiveChecklist";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { InteractiveChecklistDetailCard } from "cypress/support/pages/admin/interactiveChecklistDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import email from "../../fixtures/common/email.json";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'checklists'], () => {
  describe('Checklists (Interactive Lists) List Card', () => {
    const listCardPage = new ListCard();
    const interactiveChecklistDetailCardPage = new InteractiveChecklistDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = interactiveChecklistDetailCardPage.getCommonLocators();
    const interactiveChecklistNameColumn = 'interactiveListName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(InteractiveChecklist.CHECKLISTS).wait(3000);
    });

    beforeEach(() => {
      cy.openCardByTitle(InteractiveChecklist.CHECKLISTS).wait(3000);
    });

    /**
     * Checks the functionalities of the Checklists (Interactive Lists) List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * Author: Gabriel Bobilles
     * Date completed: September 03, 2023
     */
    it('checks Checklists (Interactive Lists) List Card', { tags: 'interactive-checklists-list-card' }, () => {
      const interactiveListName = 'interactiveListName';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const type = 'Type';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(interactiveListName, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(interactiveListName, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(interactiveListName);
      listCardPage.filterColumn(interactiveListName, 1);
      listCardPage.clearColumnFilter(interactiveListName, 10);
      listCardPage.showInstantInsights(0, interactiveListName);
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
      listCardPage.searchAndSelect(interactiveChecklistNameColumn, 'Name', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      interactiveChecklistDetailCardPage.getCommonElements().windowTitle().should('contain.text', InteractiveChecklist.CHECKLIST).and('be.visible');
      cy.closeCardByTitle(InteractiveChecklist.CHECKLIST);
      interactiveChecklistDetailCardPage.getCommonElements().windowTitle().should('not.contain.text', InteractiveChecklist.CHECKLIST);
      cy.openCardInWindow(InteractiveChecklist.CHECKLISTS);
    });
  });
});
