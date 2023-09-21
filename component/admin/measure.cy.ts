import { Measure } from "cypress/support/enums/admin/measure";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { MeasureDetailCard } from "cypress/support/pages/admin/measureDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'measures'], () => {
  describe('Measures Card', () => {
    const listCardPage = new ListCard();
    const measureDetailCardPage = new MeasureDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const measureNameColumn = 'measureName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Measure.MEASURES);
    });

    /**
     * Checks the Measures Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18941} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 26, 2023
     */
    it('checks the Measures Card', { tags: 'measures' }, () => {
      const name = 'New Measure_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(measureNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(measureNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(measureNameColumn, 1);
      listCardPage.clearColumnFilter(measureNameColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      measureDetailCardPage.createMeasure(name);
      cy.closeCardByTitle(Measure.MEASURE);
      listCardPage.searchRecord(measureNameColumn, name);
    });
  });
});
