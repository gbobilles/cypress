import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PurchaseReceipt } from "cypress/support/enums/inv/purchaseReceipt";
import DateUtils from "cypress/support/utils/dateUtils";
import { DetailCard } from "../../common/detailCard.page";

export class PurchaseReceiptDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    purchaseReceiptIdInputField: 'div[field=purchaseReceiptIdentifier] input',
    siteDropdown: 'div[field=siteId] input',
    partStoreroomDropdown: 'div[field=partStoreId] input',
    vendorStoreDropdown: 'div[field=vendorStoreId] input',
    billingMethodDropdown: 'div[field=billingMethodId] input',
    purchaseReceiptDate: 'input[placeholder="Purchase Receipt Date mm/dd/yyyy"]',
    descriptionTextArea: 'div[field=description] textarea',
    partIdDropdown: 'div[field=partId] input',
    quantityInputField: 'div[field=quantity] input',
    costInputField: 'div[field=unitCost] input'
  }

  createPurchaseReceipt(description: string): Cypress.Chainable<JQuery<HTMLElement>> {
    this.selectFromDropdownByRandomValue(this.locators.siteDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.partStoreroomDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.vendorStoreDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.billingMethodDropdown);
    this.typeWithinField(this.locators.purchaseReceiptDate, DateUtils.getDateTodayAsString());
    this.typeWithinField(this.locators.descriptionTextArea, description);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
    this.clickElement(this.commonLocators.successMessageCloseButton);
    return cy.get(this.locators.purchaseReceiptIdInputField).invoke('val');
  }

  createPart(quantity: number, cost: number): void {
    this.clickSectionButton(PurchaseReceipt.PARTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partIdDropdown);
    this.clickElement(this.locators.partIdDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.typeWithinField(this.locators.quantityInputField, quantity);
    this.typeWithinField(this.locators.costInputField, cost);
    this.clickSectionButton(PurchaseReceipt.PARTS, this.commonLocators.saveButton).wait(5000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(PurchaseReceipt.PARTS, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }

  changePurchaseReceiptStatusAndDisposition(status: Status, disposition: Disposition): Cypress.Chainable<JQuery<HTMLElement>> {
    this.selectRecordStatus(PurchaseReceipt.GENERAL, status);
    this.selectRecordDisposition(PurchaseReceipt.GENERAL, disposition);
    return this.clickElement(this.commonLocators.saveButton);
  }
}
