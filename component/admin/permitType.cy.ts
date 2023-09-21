import { Permitype } from "cypress/support/enums/admin/permitType";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { PermitTypeDetailCard } from "cypress/support/pages/admin/permitTypeDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'permitType'], () => {
  describe('Permit Type Card', () => {
    const listCardPage = new ListCard()
    const permitTypeDetailCard = new PermitTypeDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const permitTypeName = 'name';
    const name = 'permitType_' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Permitype.PERMIT_TYPES);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      permitTypeDetailCard.createPermitType(name);
      cy.closeCardByTitle(Permitype.PERMIT_TYPE);
    });

    beforeEach(() => {
      cy.openCardByTitle(Permitype.PERMIT_TYPES);
    });

    /**
     * Checks the Permit Types Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18910} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the Permit Types Card', { tags: 'permit-types' }, () => {
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(permitTypeName, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(permitTypeName, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(permitTypeName, 1);
      listCardPage.clearColumnFilter(permitTypeName, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.searchRecord(permitTypeName, name);
      permitTypeDetailCard.renamePermitType(name);
      cy.closeCardByTitle(Permitype.PERMIT_TYPE);
    });
  });
});
