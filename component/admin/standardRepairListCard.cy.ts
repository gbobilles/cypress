import { StandardRepair } from 'cypress/support/enums/admin/standardRepair';
import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../fixtures/common/email.json";
import TestFilters from '../../support/utils/filterTest';

TestFilters(['regression', 'standardRepairs'], () => {
  describe('Standard Repairs List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openAdminCardByTitle(StandardRepair.STANDARD_REPAIRS).wait(5000);
    });

    /**
     * Checks the functionalities of the Standard Repairs List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/581} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 24, 2023
     */
    it('checks the Standard Repair List Card', { tags: 'standard-repairs-list-card' }, () => {
      const standardRepairIdentifierColumn = 'standardRepairIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const systemCode = 'System Code';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(standardRepairIdentifierColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(standardRepairIdentifierColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(standardRepairIdentifierColumn);
      listCardPage.filterColumn(standardRepairIdentifierColumn, 1);
      listCardPage.clearColumnFilter(standardRepairIdentifierColumn, 10);
      listCardPage.showInstantInsights(0, standardRepairIdentifierColumn);
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
      listCardPage.searchAndSelect(standardRepairIdentifierColumn, 'Standard Repair Identifier', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', StandardRepair.STANDARD_REPAIR).and('be.visible');
      cy.closeCardByTitle(StandardRepair.STANDARD_REPAIR);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', StandardRepair.STANDARD_REPAIR);
      cy.openCardInWindow(StandardRepair.STANDARD_REPAIRS);
    });
  });
});
