export class AssetInstantInsights {

  private locators: { [key: string]: string } = {
    assetCostSummaryLink: '.asset-cost-summary-link',
    instantInsightsWindow: '.content-summary-views',
    instantInsightsWindowCloseButton: '.content-summary-close'
  }

  private elements = {
    instantInsightsWindow: () => cy.get(this.locators.instantInsightsWindow),
    instantInsightsWindowCloseButton: () => cy.get(this.locators.instantInsightsWindowCloseButton)
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  getElements(): any {
    return this.elements;
  }

  clickElement(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector).scrollIntoView().click({ force: true });
  }
}
