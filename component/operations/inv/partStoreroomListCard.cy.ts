import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { PartStoreroom } from 'cypress/support/enums/inv/partStoreroom';
import { ListCard } from 'cypress/support/pages/common/listCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'partStorerooms'], () => {
  describe('Part Storeroom List Card', () => {
    const listCardPage = new ListCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PartStoreroom.PART_STOREROOMS).wait(5000);
    });

    /**
     * Checks the functionalities of the Part Storeroom List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18070} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 29, 2023
     */
    it('checks the Part Storeroom List Card', { tags: 'part-storeroom-list-card' }, () => {
      const partStoreroomNameColumn = 'name';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const siteName = 'Site Name';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(partStoreroomNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(partStoreroomNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(partStoreroomNameColumn);
      listCardPage.filterColumn(partStoreroomNameColumn, 1);
      listCardPage.clearColumnFilter(partStoreroomNameColumn, 10);
      listCardPage.showInstantInsights(0, partStoreroomNameColumn);
      listCardPage.groupColumn(siteName);
      listCardPage.ungroupColumn(siteName);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(partStoreroomNameColumn, 'Part Storeroom Name', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.getCommonElements().windowTitle().should('contain.text', PartStoreroom.PART_STOREROOM).and('be.visible');
      cy.closeCardByTitle(PartStoreroom.PART_STOREROOM);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', PartStoreroom.PART_STOREROOM);
      cy.openCardInWindow(PartStoreroom.PART_STOREROOMS);
    });
  });
});
