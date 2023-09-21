import { CustomIdentifier } from "cypress/support/enums/admin/customIdentifier";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { CustomIdentifierDetailCard } from "cypress/support/pages/admin/customIdentifierDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import email from "../../fixtures/common/email.json";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'customIdentifiers'], () => {
  describe('Custom Identifiers List Card', () => {
    const listCardPage = new ListCard();
    const customIdentifierDetailCardPage = new CustomIdentifierDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = customIdentifierDetailCardPage.getCommonLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(CustomIdentifier.CUSTOM_IDENTIFIERS).wait(3000);
    });

    beforeEach(() => {
      cy.openCardByTitle(CustomIdentifier.CUSTOM_IDENTIFIERS).wait(3000);
    });

    /**
     * Checks the functionalities of the Custom Identifiers List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * Author: Gabriel Bobilles
     * Date completed: September 03, 2023
     */
    it('checks the Custom Identifier List Card', { tags: 'custom-identifiers-list-card' }, () => {
      const customIdentifierName = 'customIdentifierName';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const customIdentifierNameColumn = 'Name';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(customIdentifierName, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(customIdentifierName, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(customIdentifierName);
      listCardPage.filterColumn(customIdentifierName, 1);
      listCardPage.clearColumnFilter(customIdentifierName, 10);
      listCardPage.showInstantInsights(0, customIdentifierName);
      listCardPage.groupColumn(customIdentifierNameColumn);
      listCardPage.ungroupColumn(customIdentifierNameColumn);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      customIdentifierDetailCardPage.getCommonElements().windowTitle().should('contain.text', CustomIdentifier.CUSTOM_IDENTIFIER).and('be.visible');
      cy.closeCardByTitle(CustomIdentifier.CUSTOM_IDENTIFIER);
      customIdentifierDetailCardPage.getCommonElements().windowTitle().should('not.contain.text', CustomIdentifier.CUSTOM_IDENTIFIER);
      cy.openCardInWindow(CustomIdentifier.CUSTOM_IDENTIFIERS);
    });
  });
});
