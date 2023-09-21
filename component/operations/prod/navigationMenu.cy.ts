import { BurgerMenu } from 'cypress/support/pages/operations/prod/burgerPanel.page';
import TestFilters from '../../../support/utils/filterTest';

TestFilters(['regression', 'Navigation-Hamburger'], () => {
  describe('Nagivation-Hamburger', () => {
    const BurgerMenuPage = new BurgerMenu();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.closeAllCards();
    });

    /**
     * Checks the navigation - Workspace Selection Box.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/2870} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: September 19, 2023
     */
    it('checks the Burger Menu Panel was closed by default', { tags: 'navigation-burger-menu' }, () => {
      BurgerMenuPage.checkPanelClosed();
      BurgerMenuPage.tapBurgerMenu();
    });

    it('checks the Burger Menu Panel was Open after clicking the burger menu', { tags: 'navigation-burger-panel-open' }, () => {
      BurgerMenuPage.checkPanelOpen();
      BurgerMenuPage.verifyBurgermenuPanelItems()
    });

    it('checks the Burger Menu Panel was closed after clicking the burger menu for the second time', { tags: 'navigation-burger-panel-closed' }, () => {
      BurgerMenuPage.tapBurgerMenu();
      BurgerMenuPage.checkPanelClosed();
    });
  });
});
