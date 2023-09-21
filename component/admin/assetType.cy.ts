import { AssetType } from "cypress/support/enums/admin/assetType";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { AssetTypeDetailCard } from "cypress/support/pages/admin/asset/assetTypeDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'assetTypes'], () => {
  describe('Asset Types Card', () => {
    const listCardPage = new ListCard();
    const assetTypeDetailCardPage = new AssetTypeDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const typeColumn = 'type';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(AssetType.ASSET_TYPES);
    });

    /**
     * Checks the Asset Types Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12804} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Asset Types Card', { tags: 'asset-types' }, () => {
      const type = 'New Asset Type_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(typeColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(typeColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(typeColumn, 1);
      listCardPage.clearColumnFilter(typeColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      assetTypeDetailCardPage.createAssetType(type);
      cy.closeCardByTitle(AssetType.ASSET_TYPE);
      listCardPage.searchRecord(typeColumn, type);
    });
  });
});
