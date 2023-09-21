import { WarrantyClaimType } from "cypress/support/enums/admin/warrantyClaimType";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { WarrantyClaimTypeDetailCard } from "cypress/support/pages/admin/warrantyClaimTypeDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'warrantyClaimTypes'], () => {
  describe('Warranty Claim Types Card', () => {
    const listCardPage = new ListCard()
    const warrantyClaimTypeDetailCard = new WarrantyClaimTypeDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const warrantyCode = 'code';
    const code = MathUtils.randomIntFromInterval(1, 99);
    const description = 'warrantyStatus_' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WarrantyClaimType.WARRANTY_CLAIM_TYPES);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      warrantyClaimTypeDetailCard.createWarrantyClaimTypes(
        code,
        description
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(WarrantyClaimType.WARRANTY_CLAIM_TYPES);
    });

    /**
     * Checks the Warranty Claim Types Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18962} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: July 27, 2023
     */
    it('checks the Warranty Claim Types Card', { tags: 'warranty-claim-types' }, () => {
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(warrantyCode, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(warrantyCode, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(warrantyCode, 1);
      listCardPage.clearColumnFilter(warrantyCode, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.searchRecord(warrantyCode, code.toString());
      cy.wait(3000);
      cy.closeCardByTitle(WarrantyClaimType.WARRANTY_CLAIM_TYPE);
    });
  });
});
