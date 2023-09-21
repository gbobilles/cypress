import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { InventoryCountList } from "cypress/support/enums/inv/inventoryCountList";
import { InventoryCountListCard } from 'cypress/support/pages/operations/inv/inventoryCountListCard.page';
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'inventoryCount'], () => {
  describe('Inventory Count List Card', () => {
    const inventoryCountListCardPage = new InventoryCountListCard();
    const commonLocators = inventoryCountListCardPage.getCommonLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(InventoryCountList.INVENTORY_COUNT_LIST).wait(5000);
    });

    /**
     * Checks the functionalities of the Inventory Count List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18645} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: July 07, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: August 17, 2023
     */
    it('checks the Inventory Count List Card', { tags: 'inventory-count-list-card' }, () => {
      const descriptionColumn = 'part_description';
      inventoryCountListCardPage.verifyInventoryCountListColumn();
      inventoryCountListCardPage.verifyRecordCount(10);
      inventoryCountListCardPage.paginate(2, 10);
      inventoryCountListCardPage.selectItemsPerPage('50', 50);
      inventoryCountListCardPage.selectItemsPerPage('10', 10);
      inventoryCountListCardPage.verifyColumnFilters();
      inventoryCountListCardPage.inventoryCountListSortingColumn(descriptionColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      inventoryCountListCardPage.inventoryCountListSortingColumn(descriptionColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      inventoryCountListCardPage.showColumn(descriptionColumn);
      inventoryCountListCardPage.inventoryCountListFilterColumn(descriptionColumn, 1);
      inventoryCountListCardPage.inventoryCountListClearColumnFilter(descriptionColumn, 10);
      inventoryCountListCardPage.hideColumn(descriptionColumn, 2);
      inventoryCountListCardPage.exportReportsViaPrint(ReportFormat.CSV);
      inventoryCountListCardPage.exportReportsViaPrint(ReportFormat.XML);
      inventoryCountListCardPage.exportReportsViaPrint(ReportFormat.JSON);
    });
  });
});
