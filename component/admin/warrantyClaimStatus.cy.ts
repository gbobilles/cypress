import { WarrantyClaimStatus } from "cypress/support/enums/admin/warrantyClaimStatus";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { WarrantyClaimStatusDetailCard } from "cypress/support/pages/admin/warrantyClaimStatusDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'warrantyClaimStatus'], () => {
  describe('Warranty Claim Status Card', () => {
    const listCardPage = new ListCard()
    const warrantyClaimStatusDetailCard = new WarrantyClaimStatusDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const warrantyCode = 'code';
    const code = MathUtils.randomIntFromInterval(1, 99);
    const description = 'warrantyStatus_' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openAdminCardByTitle(WarrantyClaimStatus.WARRANTY_CLAIM_STATUSES);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      warrantyClaimStatusDetailCard.createWarrantyClaimStatus(code, description);
    });

    beforeEach(() => {
      cy.openAdminCardByTitle(WarrantyClaimStatus.WARRANTY_CLAIM_STATUSES);
    });

    /**
     * Checks the Warranty Claim Status Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18961} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: July 27, 2023
     */
    it('checks the Warranty Claim Status', { tags: 'warranty-claim-status' }, () => {
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(warrantyCode, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(warrantyCode, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(warrantyCode, 1);
      listCardPage.clearColumnFilter(warrantyCode, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.searchRecord(warrantyCode, code.toString());
      cy.wait(3000);
      cy.closeCardByTitle(WarrantyClaimStatus.WARRANTY_CLAIM_STATUS);
    });
  });
});
