import { Toolbar } from 'cypress/support/pages/operations/prod/toolbar.page';
import TestFilters from '../../../support/utils/filterTest';
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['regression', 'toolbar'], () => {
  describe('Toolbar', () => {
    const toolbarPage = new Toolbar();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.closeAllCards();
    });

    /**
     * Checks the Toolbar - Workspace Selection Box.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19587} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 18, 2023
     */
    it('checks the Toolbar - Workspace Selection Box', { tags: 'toolbar-workspace-selection' }, () => {
      toolbarPage.switchWorkspace();
    });

    /**
     * Checks the Toolbar - Add/Delete Workspace.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19588} for the actual test case.
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19589} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 18, 2023
     */
    it('checks the Toolbar - Add/Delete Workspace', { tags: ['toolbar-add-workspace', 'toolbar-delete-workspace'] }, () => {
      const workspaceName = 'New workspace_' + MathUtils.generateRandomNumber(3);
      toolbarPage.addWorkspace(workspaceName);
      toolbarPage.deleteWorkspace(workspaceName);
    });

    /**
     * Checks the Toolbar - Unlock Dashboard Cards.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19591} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 18, 2023
     */
    it('checks the Toolbar - Unlock Dashboard Cards', { tags: 'toolbar-unlock-dashboard-cards' }, () => {
      const workspaceName = 'New workspace_' + MathUtils.generateRandomNumber(3);
      toolbarPage.unlockDashboard(workspaceName);
      toolbarPage.deleteWorkspace(workspaceName);
    });

    /**
     * Checks the Toolbar - Open Cards.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19592} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 18, 2023
     */
    it('checks the Toolbar - Open Cards', { tags: 'toolbar-open-cards' }, () => {
      toolbarPage.checkOpenCards();
    });

    /**
     * Checks the Toolbar - Help Panel.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3194} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 15, 2023
     */
    it('checks the Toolbar - Help Panel', { tags: 'toolbar-help-panel' }, () => {
      toolbarPage.openHelpPanel();
      toolbarPage.verifyHelpPanelItems();
      toolbarPage.closeHelpPanel();
    });

    /**
     * Checks the Toolbar - User / Switch User.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19613} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 19, 2023
     */
    it('checks the Toolbar - User / Switch User', { tags: 'toolbar-user-switch-user' }, () => {
      toolbarPage.switchUser();
      cy.loginToDossier();
    });

    /**
     * Checks the Toolbar - User / Sign Out.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/19614} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 19, 2023
     */
    it('checks the Toolbar - User / Sign Out', { tags: 'toolbar-user-sign-out' }, () => {
      toolbarPage.signOutUser();
    });
  });
});
