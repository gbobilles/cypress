import { PartReturnReason } from "cypress/support/enums/admin/partReturnReason";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { PartReturnReasonDetailCard } from "cypress/support/pages/admin/partReturnReasonDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'partReasonReturn'], () => {
  describe('Part Return Reason Card', () => {
    const listCardPage = new ListCard();
    const partReturnReasonDetailCardPage = new PartReturnReasonDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const partReturnReasonIdColumn = 'partReturnReasonName';
    const name = 'Reason_' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PartReturnReason.PART_RETURN_REASONS);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      partReturnReasonDetailCardPage.createPartReturnReason(name);
      cy.closeCardByTitle(PartReturnReason.PART_RETURN_REASON);
    });

    beforeEach(() => {
      cy.openCardByTitle(PartReturnReason.PART_RETURN_REASONS);
    });

    /**
     * Checks the Part Return Reasons Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18900} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the Part Return Reasons Card', { tags: 'part-return-reasons' }, () => {
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(partReturnReasonIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(partReturnReasonIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(partReturnReasonIdColumn, 1);
      listCardPage.clearColumnFilter(partReturnReasonIdColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.searchRecord(partReturnReasonIdColumn, name);
      partReturnReasonDetailCardPage.renamePartReturnReason(name);
      cy.closeCardByTitle(PartReturnReason.PART_RETURN_REASON);
    });
  });
});
