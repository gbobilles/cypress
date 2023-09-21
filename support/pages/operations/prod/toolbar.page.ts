import { Asset } from "cypress/support/enums/asset/asset";
import { Dashboard } from "cypress/support/enums/dashboard/dashboard";
import { Part } from "cypress/support/enums/inv/part";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import help from '../../../../fixtures/prod/help.json';
import { Card } from "../../common/card.page";

export class Toolbar extends Card {

  private constants: { [key: string]: string } = {
    workspace: 'Workspace',
    openCards: 'Open Cards',
    noData: 'No data',
    addWorkspace: 'Add Workspace',
    deleteWorkspace: 'Delete Workspace',
    switchUser: 'Switch User',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    loginToAmcsFleetMaintenance: 'Login to AMCS Fleet Maintenance',
    accountLoginUrl: '/Account/Login?ReturnUrl='
  }

  private locators: { [key: string]: string } = {
    userMenu: '.user-menu',
    workspaceInputField: 'input[placeholder="Workspace Name"]',
    dashboardEditIcon: '[id="dashboard_edit"]',
    openCardsDropdown: 'input[placeholder="Open Cards"]',
    openCardsDropdownContainer: '.open-cards',
    appUserContainer: '.app-user-container',
    helpIcon: '.fa-question',
    helpPanel: '.help-information',
    helpTitle: '[title=Help]',
    socialMediaLinks: '.external-links',
    userName: '.user-name',
    emailInputField: '[id=txtEmail]',
    passwordInputField: '[id=Input_Password]'
  }

  private elements: any = {
    openCardsDropdownOption: () => cy.get(this.locators.openCardsDropdownContainer + ' ' + 'li > span'),
    workspaceDropdown: () => cy.get(this.locators.userMenu).contains(this.constants.workspace).next(),
    helpIcon: () => cy.get(this.getHelpIcon()),
    helpPanel: () => cy.get(this.locators.helpPanel),
    helpPanelItems: () => cy.get(this.locators.helpPanel).children('span.item'),
    helpPanelTitle: () => cy.get(this.locators.helpPanel + '> .heading-major'),
    helpTitle: () => cy.get(this.getHelpTitle()),
    socialMediaLinkItems: () => cy.get(this.locators.socialMediaLinks).children('a')
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  getHelpTitle(): string {
    return this.locators.appUserContainer + ' ' + this.locators.helpTitle;
  }

  getHelpIcon(): string {
    return this.locators.appUserContainer + ' ' + this.locators.helpIcon;
  }

  switchWorkspace(): void {
    cy.get(this.locators.userMenu).contains(this.constants.workspace).next().click({ force: true });
    this.selectRandomValueFromExpandedDropdown();
  }

  addWorkspace(workspaceName: string): void {
    this.elements.workspaceDropdown().next(this.commonLocators.addButton).click({ force: true }).wait(2000);
    this.verifyDialogByTitle(this.constants.addWorkspace);
    this.typeWithinField(this.locators.workspaceInputField, workspaceName);
    this.clickElement(this.commonLocators.dialog + ' ' + this.commonLocators.addButton).wait(2000);
    this.elements.workspaceDropdown().find(this.commonLocators.input).invoke('val').then($value => {
      expect($value.toString()).to.eq(workspaceName);
    });
  }

  deleteWorkspace(workspaceName: string): void {
    this.clickElement(this.locators.dashboardEditIcon);
    this.clickElement(this.commonLocators.deleteButton);
    this.verifyDialogByTitle(this.constants.deleteWorkspace);
    this.clickElement(this.commonLocators.dialog + ' ' + this.commonLocators.deleteButton).wait(2000);
    this.elements.workspaceDropdown().click({ force: true });
    cy.get('li > span').contains(workspaceName).should('not.exist');
    this.clickElement(this.locators.dashboardEditIcon);
  }

  unlockDashboard(workspaceName: string): void {
    this.addWorkspace(workspaceName);
    this.clickElement(this.locators.dashboardEditIcon);
    cy.openDashboardCardByTitle(Dashboard.ASSET_PM_STATUS, false).wait(2000);
    cy.openDashboardCardByTitle(Dashboard.ASSETS_OUT_OF_SERVICE, false).wait(2000);
    cy.closeAllDashboardCards();
    this.clickElement(this.locators.dashboardEditIcon);
  }

  checkOpenCards(): void {
    cy.closeAllCards();
    this.clickElement(this.locators.openCardsDropdown);
    cy.get(this.commonLocators.p).contains(this.constants.noData).should('be.visible');
    cy.openOperationsCardByTitle(Asset.ASSETS, false);
    cy.openOperationsCardByTitle(Part.PARTS, false);
    cy.openOperationsCardByTitle(WorkRequest.WORK_REQUESTS, false);
    this.clickElement(this.locators.openCardsDropdown).wait(1000);
    this.elements.openCardsDropdownOption().contains(Asset.ASSETS).should('be.visible');
    this.elements.openCardsDropdownOption().contains(Part.PARTS).should('be.visible');
    this.elements.openCardsDropdownOption().contains(WorkRequest.WORK_REQUESTS).should('be.visible');
    this.elements.openCardsDropdownOption().contains(Asset.ASSETS).next('i.close-card').click({ force: true });
    this.clickElement(this.locators.openCardsDropdown).wait(1000);
    cy.get(this.elements.openCardsDropdownOption).contains(Asset.ASSETS).should('not.be.visible');
  }

  openHelpPanel(): void {
    this.elements.helpTitle().click();
  }

  closeHelpPanel(): void {
    this.elements.helpIcon().click();
  }

  verifyHelpPanelItems(): void {
    this.elements.helpPanel().should('be.visible');
    this.elements.helpPanelTitle().should('contain.text', help.title);
    this.elements.helpPanelItems().should('have.length', 8);
    this.elements.helpPanelItems().each(($element, index) => {
      cy.wrap($element).find('.heading-minor').should('contain.text', help.items[index].header);
      cy.wrap($element).find('span').should('contain.text', help.items[index].value);
      cy.wrap($element).find('a').should('have.attr', 'href').and('include', help.items[index].link);
    });
    this.elements.socialMediaLinkItems().should('have.length', 4);
    this.elements.socialMediaLinkItems().each(($element: any, index: number) => {
      cy.wrap($element).should('have.attr', 'href').and('include', help.socialMediaLinks[index].link);
      cy.wrap($element).find('i').should('have.attr', 'class').and('include', help.socialMediaLinks[index].icon);
    });
    this.elements.helpPanelItems().find('.heading-minor').should('not.have.text', help.dossierUsersGroup.header);
    this.elements.helpPanelItems().find('span').should('not.have.text', help.dossierUsersGroup.value);
  }

  switchUser(): void {
    this.clickElement(this.locators.userName);
    cy.contains(this.commonLocators.list, this.constants.switchUser).click({ force: true });
    cy.get(this.locators.emailInputField).should('be.visible');
    cy.get(this.locators.passwordInputField).should('be.visible');
    cy.contains(this.commonLocators.button, this.constants.signIn).should('be.visible');
    cy.url().should('include', this.constants.accountLoginUrl);
  }

  signOutUser(): void {
    this.clickElement(this.locators.userName);
    cy.contains(this.commonLocators.list, this.constants.signOut).click({ force: true });
    cy.get(this.locators.emailInputField).should('be.visible');
    cy.get(this.locators.passwordInputField).should('be.visible');
    cy.contains(this.commonLocators.button, this.constants.signIn).should('be.visible');
    cy.url().should('include', this.constants.accountLoginUrl);
  }
}
