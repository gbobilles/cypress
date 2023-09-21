import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { Vendor } from "cypress/support/enums/vend/vendor";
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'vendor'], () => {
  describe('Vendor List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Vendor.VENDORS);
    });

    /**
     * Checks the functionalities of the Vendor List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/609} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 12, 2023
     */
    it('checks the Vendor List Card', { tags: 'vendor-list-card' }, () => {
      const vendorNameColumn = 'name';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const vendorId = 'Vendor ID';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.paginate(1, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(vendorNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(vendorNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(vendorNameColumn);
      listCardPage.filterColumn(vendorNameColumn, 1);
      listCardPage.clearColumnFilter(vendorNameColumn, 10);
      listCardPage.showInstantInsights(0, vendorNameColumn);
      listCardPage.groupColumn(vendorId);
      listCardPage.ungroupColumn(vendorId);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 10000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 10000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(vendorNameColumn, 'Name', 'Equals', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', Vendor.VENDOR).and('be.visible');
      cy.closeCardByTitle(Vendor.VENDOR);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', Vendor.VENDOR);
      cy.openCardInWindow(Vendor.VENDORS);
    });
  });
});
