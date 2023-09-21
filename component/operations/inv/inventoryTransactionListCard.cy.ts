import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { InventoryTransaction } from "cypress/support/enums/inv/inventoryTransaction";
import { InventoryTransactionListCard } from 'cypress/support/pages/operations/inv/inventoryTransactionListCard.page';
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'inventoryTransaction'], () => {
  describe('Inventory Transaction List Card', () => {
    const inventoryTransactionListCardPage = new InventoryTransactionListCard();
    const commonLocators = inventoryTransactionListCardPage.getCommonLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(InventoryTransaction.INVENTORY_TRANSACTION).wait(5000);
    });

    /**
     * Checks the functionalities of the Inventory Transaction List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18649} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: July 06, 2023
     */
    it('checks the Inventory Transaction List Card', { tags: 'inventory-transaction-list-card' }, () => {
      const typeColumn = 'inventoryTransactionHeader_inventoryTransactionType_inventoryTransactionTypeName';
      inventoryTransactionListCardPage.verifyColumnHeaders();
      inventoryTransactionListCardPage.verifyRecordCount(10);
      inventoryTransactionListCardPage.paginate(2, 10);
      inventoryTransactionListCardPage.selectItemsPerPage('50', 50);
      inventoryTransactionListCardPage.selectItemsPerPage('10', 10);
      inventoryTransactionListCardPage.verifyColumnFilters();
      inventoryTransactionListCardPage.sortColumn(typeColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      inventoryTransactionListCardPage.sortColumn(typeColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      inventoryTransactionListCardPage.showColumn(typeColumn);
      inventoryTransactionListCardPage.filterColumn(typeColumn, 1);
      inventoryTransactionListCardPage.clearColumnFilter(typeColumn, 10);
      inventoryTransactionListCardPage.hideColumn(typeColumn, 1)
      inventoryTransactionListCardPage.exportReportsViaPrint(ReportFormat.CSV);
      inventoryTransactionListCardPage.exportReportsViaPrint(ReportFormat.XML);
      inventoryTransactionListCardPage.exportReportsViaPrint(ReportFormat.JSON);
    });
  });
});
