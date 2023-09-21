import { PartOnHand } from "cypress/support/enums/inv/partOnHand";
import { DetailCard } from "../../common/detailCard.page";

export class PartOnHandDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    stockedInputSwitch: 'div[field=isStocked]',
    partStoreLocationDropdown: 'div[field=partStoreLocationId] input',
    glSpecificationItems: '.gl-spec-values-body .content-form input'
  }

  saveGeneralSettings(stocked: boolean): void {
    cy.get(this.locators.stockedInputSwitch).find(this.commonLocators.label).find(this.commonLocators.span).contains(stocked ? 'Yes' : 'No').click({ force: true });
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
    this.clickElement(this.commonLocators.successMessageCloseButton);
  }

  createGlSpecifications(): void {
    const values = [];
    cy.get(this.locators.glSpecificationItems).each(($item) => {
      cy.wrap($item).wait(1000).click({ force: true }).wait(2000);
      this.selectFromDropdown(0).wait(2000);
      cy.wrap($item).click({ force: true }).invoke('attr', 'placeholder').as('value');
      cy.get('@value').then((value) => {
        values.push(value.toString());
      });
      cy.wrap($item).click({ force: true }).wait(1000);
    });
    this.clickSectionButton(PartOnHand.GL_SPECIFICATIONS, this.getCommonLocators().saveButton).wait(8000);
    cy.get(this.locators.glSpecificationItems).each(($item, index) => {
      cy.wrap($item).click({ force: true }).invoke('attr', 'placeholder').as('value');
      cy.get('@value').then((value) => {
        expect(value.toString()).to.eq(values[index]);
      });
      cy.wrap($item).click({ force: true }).wait(1000);
    });
  }

  createInventoryLocation(): void {
    this.clickSectionButton(PartOnHand.INVENTORY_LOCATIONS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partStoreLocationDropdown);
    this.clickElement(this.locators.partStoreLocationDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(PartOnHand.INVENTORY_LOCATIONS, this.commonLocators.saveButton).wait(3000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(PartOnHand.INVENTORY_LOCATIONS, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }
}
