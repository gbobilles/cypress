import { DetailCard } from "../../common/detailCard.page";
import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";

export class BlanketPurchaseOrderDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    blanketPurchaseOrderName: 'div[field=blanketPurchaseOrderName] input',
    vendorStoreId: 'div[field=vendorStoreId] input',
    budgetedAmount: 'div[field=budgetedAmount] input',
    totalAmount: 'div[field=totalAmount] input',
    remainingAmount: 'div[field=remainingAmount] input'
  }

  getLocator(): { [key: string]: string } {
    return this.locators;
  }

  createBlanketPurchaseOrder(name:string, amountBudgeted:string = '10000'): void {
    this.typeWithinField(this.locators.blanketPurchaseOrderName, name).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.vendorStoreId).wait(3000);
    this.clickElement(this.locators.budgetedAmount).clear().type(amountBudgeted);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton).wait(3000);
  }

  createParts(quantity: string='5', price: string='10'): void {
    this.clickSectionButton(PurchaseOrder.PARTS, this.commonLocators.addButton).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.partId);
    this.clickElement(this.locators.partQuantity).type(quantity);
    this.clickElement(this.locators.partPrice).clear().type(price);
    this.selectFromDropdownByRandomValue(this.locators.partMeasureDropdown);
    this.clickElement(this.commonLocators.saveButton, 1);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
  }

  getCardTextField(section: string, element: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainer(section).parent().find(element).eq(index);
  }
}
