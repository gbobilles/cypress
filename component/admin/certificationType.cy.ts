import { CertificationType } from "cypress/support/enums/admin/certificationType";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { CertificationTypeDetailCard } from "cypress/support/pages/admin/certificationTypeDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'certificationTypes'], () => {
  describe('Certification Types Card', () => {
    const listCardPage = new ListCard();
    const certificationTypeDetailCardPage = new CertificationTypeDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const typeColumn = 'typeName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(CertificationType.CERTIFICATION_TYPES);
    });

    /**
     * Checks the Certification Types Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18889} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 24, 2023
     */
    it('checks the Certification Types Card', { tags: 'certification-types' }, () => {
      const name = 'New Certification Type_' + MathUtils.generateRandomNumber(5);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(typeColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(typeColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.filterColumn(typeColumn, 1);
      listCardPage.clearColumnFilter(typeColumn, 10);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF);
      listCardPage.clickElement(listCardLocators.addButton);
      certificationTypeDetailCardPage.createCertificationType(name);
      cy.closeCardByTitle(CertificationType.CERTIFICATION_TYPE);
      listCardPage.searchRecord(typeColumn, name);
    });
  });
});
