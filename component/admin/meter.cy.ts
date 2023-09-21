import { Meter } from "cypress/support/enums/admin/meter";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { MeterDetailCard } from "cypress/support/pages/admin/asset/meterDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'meters'], () => {
  describe('Meters Card', () => {
    const listCardPage = new ListCard();
    const meterDetailCardPage = new MeterDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const meterNameColumn = 'meterName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Meter.METERS);
    });

    /**
     * Checks Meters Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3177} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 26, 2023
     */
    it('checks the Meters Card', { tags: 'meters' }, () => {
      let name = 'New Meter_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(meterNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(meterNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(meterNameColumn, 1);
      listCardPage.clearColumnFilter(meterNameColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      meterDetailCardPage.createMeter(name, 'Miles', 'Actual');
      cy.closeCardByTitle(Meter.METER);
      listCardPage.clickElement(listCardLocators.addButton);
      name = 'New Meter_' + MathUtils.generateRandomNumber(5);
      meterDetailCardPage.createMeter(name, 'Hours', 'Actual');
      cy.closeCardByTitle(Meter.METER);
      listCardPage.clickElement(listCardLocators.addButton);
      name = 'New Meter_' + MathUtils.generateRandomNumber(5);
      meterDetailCardPage.createMeter(name, 'Kilometers', 'Actual');
      cy.closeCardByTitle(Meter.METER);
      listCardPage.clickElement(listCardLocators.addButton);
      name = 'New Meter_' + MathUtils.generateRandomNumber(5);
      meterDetailCardPage.createMeter(name, 'Yards', 'Incremental');
      cy.closeCardByTitle(Meter.METER);
      listCardPage.searchRecord(meterNameColumn, name);
    });
  });
});
