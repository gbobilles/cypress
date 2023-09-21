import { WorkOrderClass } from "cypress/support/enums/admin/workOrderClass";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { WorkOrderClassDetailCard } from "cypress/support/pages/admin/workOrderClassDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'workOrderClasses'], () => {
  describe('Work Order Classes Card', () => {
    const listCardPage = new ListCard();
    const workOrderClassDetailCardPage = new WorkOrderClassDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const classColumn = 'workOrderClassName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WorkOrderClass.WORK_ORDER_CLASSES);
    });

    /**
     * Checks the Work Order Classes Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18912} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 24, 2023
     */
    it('checks the Work Order Classes Card', { tags: 'work-order-classes' }, () => {
      const name = 'New Work Order Class_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(classColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(classColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(classColumn, 1);
      listCardPage.clearColumnFilter(classColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      workOrderClassDetailCardPage.createWorkOrderClass(name);
      cy.closeCardByTitle(WorkOrderClass.WORK_ORDER_CLASS);
      listCardPage.searchRecord(classColumn, name);
    });
  });
});
