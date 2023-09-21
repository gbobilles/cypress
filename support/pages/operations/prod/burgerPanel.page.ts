import { Card } from "../../common/card.page";
import { MenuSection } from '../../../enums/common/navigationMenu/menuSection';
import { BurgerPanelItem } from "cypress/support/enums/prod/burgerPanelItem";

export class BurgerMenu extends Card {

  private locators: { [key: string]: string } = {
    burgerMenu: '[data-role=tooltip]',
    cardPanel: '#cardMenuPanel',
    submenu: '.card-menu-section-title'
  }

  private elements: any = {
    burgerMenu: () => cy.get(this.locators.burgerMenu + ' ' + '> .nav-toggle'),
    burgerMenuActive: () => cy.get(this.locators.burgerMenu + ' ' + '> .nav-toggle.active'),
    cardPanel: () => cy.get(this.locators.cardPanel),
    submenu: () => cy.get(this.locators.submenu),
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  tapBurgerMenu(): void {
    cy.wait(3000);
    this.elements.burgerMenu().click({ force: true });
  }

  checkPanelOpen(): void {
    this.elements.burgerMenuActive().should('be.visible');
  }

  checkPanelClosed(): void {
    this.elements.burgerMenuActive().should('not.exist');
  }

  verifyBurgermenuPanelItems(): void {
    this.elements.cardPanel().should('contain.text', BurgerPanelItem.FAVORITES);
    this.elements.cardPanel().should('contain.text', BurgerPanelItem.OPERATIONS);
    this.elements.cardPanel().should('contain.text', BurgerPanelItem.ADMIN);
    this.elements.cardPanel().should('contain.text', BurgerPanelItem.REPORT_AND_ANALYTICS);
    this.elements.cardPanel().should('contain.text', BurgerPanelItem.DASHBOARD);
  }

  checAdminSubMenuItem(): void {
    this.elements.submenu().click({ force: true });
    cy.contains('.card-menu-section-title', MenuSection.ADMIN).parent().next('ul').find('.card-menu-nav-title').contains(exactSearchItem).click({ force: true }).wait(1000);
    this.elements.helpPanelItems().each(($element, index) => {
      cy.wrap($element).find('.heading-minor').should('contain.text', help.items[index].header);
      cy.wrap($element).find('span').should('contain.text', help.items[index].value);
      cy.wrap($element).find('a').should('have.attr', 'href').and('include', help.items[index].link);
    });
  }
}
