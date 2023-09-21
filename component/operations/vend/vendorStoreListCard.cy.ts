import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { VendorStore } from "cypress/support/enums/vend/vendorStore";
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'vendor_store'], () => {
  describe('Vendor Store List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(VendorStore.VENDOR_STORES);
    });

    /**
     * Checks the functionalities of the Vendor Store List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12763} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 14, 2023
     */
    it('checks the Vendor Store List Card', { tags: 'vendor-store-list-card' }, () => {
      const vendorStoreNameColumn = 'name';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const vendorStoreId = 'Vendor Store ID';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.paginate(1, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(vendorStoreNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(vendorStoreNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(vendorStoreNameColumn);
      listCardPage.filterColumn(vendorStoreNameColumn, 1);
      listCardPage.clearColumnFilter(vendorStoreNameColumn, 10);
      listCardPage.showInstantInsights(0, vendorStoreNameColumn);
      listCardPage.groupColumn(vendorStoreId);
      listCardPage.ungroupColumn(vendorStoreId);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 10000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 10000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(vendorStoreNameColumn, 'Name', 'Equals', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.getCommonElements().windowTitle().should('contain.text', VendorStore.VENDOR_STORE).and('be.visible');
      cy.closeCardByTitle(VendorStore.VENDOR_STORE);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', VendorStore.VENDOR_STORE);
      cy.openCardInWindow(VendorStore.VENDOR_STORES);
    });
  });
});
