import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";
import { DetailCard } from "../../common/detailCard.page";

export class PurchaseOrderDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    receiveServices: 'Receive Services',
    receiveParts: 'Receive Parts'
  }

  private locators: { [key: string]: string } = {
    billingMethodDropdown: 'div[field=billingMethodId] input',
    receiveServicesDialog: 'div[aria-label="Receive Services"]',
    receivePartsDialog: 'div[aria-label="Receive Parts"]',
    purchaseOrderIdInputField: 'div[field=purchaseOrderIdentifier] input',
    vendorStoreDropdown: 'div[field=vendorStoreId] input',
    partStoreroomDropdown: 'div[field=partStoreId] input',
    purchaseOrderDate: 'input[placeholder="Purchase Order Date mm/dd/yyyy"]',
    partMeasureDropdown: 'div[field=measureId] input',
    partIdDropdown: 'div[field=partId] input',
    partQuantityInputField: 'div[field=quantity] input',
    partPriceInputField: 'div[field=price] input'
  }

  createPurchaseOrder(): void {
    this.selectFromDropdownByRandomValue(this.locators.partStoreroomDropdown).wait(3000);
    this.clickElement(this.locators.purchaseOrderDate);
    this.clickVisibleElement(this.commonLocators.dateToday);
    this.selectFromDropdownByRandomValue(this.locators.vendorStoreDropdown).wait(3000);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton).wait(3000);
  }

  createPurchaseOrderWithPartStoreroom(partStoreroom: string): void {
    this.clickElement(this.locators.purchaseOrderDate);
    this.clickVisibleElement(this.commonLocators.dateToday);
    this.typeAndSelectFromDropdownByText(this.locators.partStoreroomDropdown, partStoreroom).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.vendorStoreDropdown).wait(3000);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton).wait(3000);
  }

  editPurchaseOrder(): void {
    this.selectFromDropdownByRandomValue(this.locators.billingMethodDropdown).wait(1000);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton).wait(3000);
  }

  receiveServices(): void {
    this.clickElement(this.getDetailCardLocators().caretButton);
    cy.get('li span').contains(this.constants.receiveServices).click({ force: true });
    cy.get(this.locators.receiveServicesDialog).should('be.visible');
    this.clickElement(this.locators.receiveServicesDialog + ' ' + this.getCommonLocators().circleCheckButton).wait(3000);
  }

  receiveParts(): void {
    this.clickElement(this.getDetailCardLocators().caretButton);
    cy.get('li span').contains(this.constants.receiveParts).click({ force: true });
    cy.get(this.locators.receivePartsDialog).should('be.visible');
    this.clickElement(this.locators.receivePartsDialog + ' ' + this.getCommonLocators().circleCheckButton).wait(17000);
  }

  createParts(quantity: string = '5', price: string = '10'): void {
    this.clickSectionButton(PurchaseOrder.PARTS, this.commonLocators.addButton).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.partIdDropdown);
    this.clickElement(this.locators.partIdDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.typeWithinField(this.locators.partQuantityInputField, quantity);
    this.typeWithinField(this.locators.partPriceInputField, price);
    this.selectFromDropdownByRandomValue(this.locators.partMeasureDropdown);
    this.clickSectionButton(PurchaseOrder.PARTS, this.commonLocators.saveButton).wait(6000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(PurchaseOrder.PARTS, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }

  createSpecificPart(part: string, quantity: number, price: number): void {
    this.clickSectionButton(PurchaseOrder.PARTS, this.commonLocators.addButton).wait(3000);
    this.typeAndSelectFromDropdownByText(this.locators.partIdDropdown, part);
    this.typeWithinField(this.locators.partQuantityInputField, quantity);
    this.selectFromDropdownByRandomValue(this.locators.partMeasureDropdown);
    this.typeWithinField(this.locators.partPriceInputField, price);
    this.clickSectionButton(PurchaseOrder.PARTS, this.commonLocators.saveButton).wait(6000);
    this.getDetailCardElements().sectionContainerElements(PurchaseOrder.PARTS, this.commonLocators.table)
      .find('tr')
      .should('have.length', 1)
      .find('td')
      .should('contain.text', part);
  }

  getPurchaseOrderID(section: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainer(section).parent().find(this.locators.purchaseOrderIdInputField).eq(index);
  }
}
