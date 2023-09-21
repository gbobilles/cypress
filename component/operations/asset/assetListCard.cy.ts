import { Asset } from "cypress/support/enums/asset/asset";
import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { AssetDetailCard } from 'cypress/support/pages/operations/asset/assetDetailCard.page';
import { AssetListCard } from 'cypress/support/pages/operations/asset/assetListCard.page';
import email from "../../../fixtures/common/email.json";
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'assets'], () => {
  describe('Asset List Card', () => {
    const assetDetailCardPage = new AssetDetailCard();
    const assetListCardPage = new AssetListCard();
    const commonLocators = assetListCardPage.getCommonLocators();
    const listCardLocators = assetListCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Asset.ASSETS).wait(5000);
    });

    /**
     * Checks the functionalities of the Asset List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/2892} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 2, 2023
     */
    it('checks the Asset List Card', { tags: 'asset-list-card' }, () => {
      const assetIdColumn = 'asset_primaryAssetIdentifier';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const site = 'Site';
      assetListCardPage.verifyRecordCount(10);
      assetListCardPage.paginate(2, 10);
      assetListCardPage.selectItemsPerPage('50', 50);
      assetListCardPage.selectItemsPerPage('10', 10);
      assetListCardPage.sortColumn(assetIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetListCardPage.sortColumn(assetIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetListCardPage.showColumn(assetIdColumn);
      assetListCardPage.filterColumn(assetIdColumn, 1);
      assetListCardPage.clearColumnFilter(assetIdColumn, 10);
      assetListCardPage.showInstantInsights(0);
      assetListCardPage.groupColumn(site);
      assetListCardPage.ungroupColumn(site);
      assetListCardPage.exportReportsViaPrint(ReportFormat.PDF, 40000);
      assetListCardPage.exportReportsViaPrint(ReportFormat.CSV);
      assetListCardPage.exportReportsViaPrint(ReportFormat.XML);
      assetListCardPage.exportReportsViaPrint(ReportFormat.JSON);
      assetListCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 40000);
      assetListCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      assetListCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      assetListCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      assetListCardPage.searchAndSelect(assetIdColumn, 'Asset ID', 'Contains', 'Public');
      assetListCardPage.clickElement(listCardLocators.addButton).wait(3000);
      assetListCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          assetListCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      assetDetailCardPage.getCommonElements().windowTitle().should('contain.text', Asset.ASSET).and('be.visible');
      cy.closeCardByTitle(Asset.ASSET);
      assetDetailCardPage.getCommonElements().windowTitle().should('not.contain.text', Asset.ASSET);
      cy.openCardInWindow(Asset.ASSETS);
    });
  });
});
