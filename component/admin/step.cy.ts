import { Step } from "cypress/support/enums/admin/step.cy";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { StepDetailCard } from "cypress/support/pages/admin/stepDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import step from "../../fixtures/admin/createStep.json";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'steps'], () => {
  describe('Steps Card', () => {
    const listCardPage = new ListCard();
    const stepDetailCardPage = new StepDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const stepNameColumn = 'stepName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Step.STEPS);
    });

    /**
     * Checks the Steps Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19016} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 5, 2023
     */
    it('checks the Steps Card', { tags: 'steps' }, () => {
      const stepName = step.stepName + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(stepNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(stepNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(stepNameColumn, 1);
      listCardPage.clearColumnFilter(stepNameColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 10000);
      listCardPage.clickElement(listCardLocators.addButton);
      stepDetailCardPage.createStep(stepName, step.description);
      cy.closeCardByTitle(Step.STEP);
      listCardPage.searchRecord(stepNameColumn, stepName);
    });
  });
});
