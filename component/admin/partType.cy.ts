import { PartType } from "cypress/support/enums/admin/partType";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { PartTypeDetailCard } from "cypress/support/pages/admin/partTypeDetailCard.page";
import { PartTypeListCard } from "cypress/support/pages/admin/partTypeListCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'partTypes'], () => {
  describe('Part Types Card', () => {
    const partTypeListCardPage = new PartTypeListCard();
    const partTypeDetailCardPage = new PartTypeDetailCard();
    const commonLocators = partTypeListCardPage.getCommonLocators();
    const listCardLocators = partTypeListCardPage.getListCardLocators();
    const partTypeNameColumn = 'partTypeName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PartType.PART_TYPES);
    });

    /**
     * Checks the Part Types Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12812} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 4, 2023
     */
    it('checks the Part Types Card', { tags: 'part-types' }, () => {
      const partTypeName = 'New Part Type_' + MathUtils.generateRandomNumber(5);
      partTypeListCardPage.verifyColumnFilters();
      partTypeListCardPage.sortColumn(partTypeNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      partTypeListCardPage.sortColumn(partTypeNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      partTypeListCardPage.exportReportsViaPrint(ReportFormat.PDF);
      partTypeListCardPage.clickElement(listCardLocators.addButton);
      partTypeDetailCardPage.createPartType(partTypeName);
      cy.closeCardByTitle(PartType.PART_TYPE);
    });
  });
});
