import { CustomIdentifier } from "cypress/support/enums/admin/customIdentifier";
import { CustomIdentifierDetailCard } from "cypress/support/pages/admin/customIdentifierDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'customIdentifiers'], () => {
  describe('Custom Identifiers Detail Card', () => {
    const listCardPage = new ListCard();
    const customIdentifierDetailCardPage = new CustomIdentifierDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const customIdentifierNameColumn = 'customIdentifierName';
    let name = 'Custom Identifier_' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(CustomIdentifier.CUSTOM_IDENTIFIERS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      customIdentifierDetailCardPage.createCustomIdentifier(name);
    });

    beforeEach(() => {
      cy.openCardByTitle(CustomIdentifier.CUSTOM_IDENTIFIERS).wait(3000);
    });

    /**
     * Checks the General section of the Custom Identifier Detail Card and creates a new Custom Identifier.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12808} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: September 5, 2023
     */
    it('checks the General section and creates a new Custom Identifier', { tags: 'custom-identifier-add' }, () => {
      listCardPage.searchRecord(customIdentifierNameColumn, name);
    });

    /**
     * Checks the General section of the Custom Identifier Detail Card and updates an existing Custom Identifier.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12808} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: September 5, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: September 14, 2023
     */
    it('checks the General section and updates an existing Custom Identifier', { tags: 'custom-identifier-update' }, () => {
      listCardPage.searchRecord(customIdentifierNameColumn, name);
      name = 'Custom Identifier_' + MathUtils.generateRandomNumber(5);
      customIdentifierDetailCardPage.updateCustomIdentifier(name);
      cy.closeCardByTitle(CustomIdentifier.CUSTOM_IDENTIFIER);
      listCardPage.searchRecord(customIdentifierNameColumn, name);
    });
  });
});
