import { WarrantyClaimResponseReason } from "cypress/support/enums/admin/warrantyClaimResponseReason";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { WarrantyClaimResponseReasonDetailCard } from "cypress/support/pages/admin/warrantyClaimResponseReasonDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'warrantyClaimResponseReasons'], () => {
  describe('Warranty Claim Response Reasons Card', () => {
    const listCardPage = new ListCard();
    const warrantyClaimResponseReasonDetailCardPage = new WarrantyClaimResponseReasonDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const codeColumn = 'code';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WarrantyClaimResponseReason.WARRANTY_CLAIM_RESPONSE_REASONS);
    });

    /**
     * Checks the Warranty Claim Response Reasons Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12817} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 28, 2023
     */
    it('checks the Warranty Claim Response Reasons Card', { tags: 'warranty-claim-response-reasons' }, () => {
      const code = 'WCRR_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(codeColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(codeColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(codeColumn, 1);
      listCardPage.clearColumnFilter(codeColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      warrantyClaimResponseReasonDetailCardPage.createWarrantyClaimResponseReason(code, 'Regression');
      cy.closeCardByTitle(WarrantyClaimResponseReason.WARRANTY_CLAIM_RESPONSE_REASON);
      listCardPage.searchRecord(codeColumn, code);
    });
  });
});
