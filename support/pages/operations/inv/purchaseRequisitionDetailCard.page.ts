import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PurchaseRequisition } from "cypress/support/enums/inv/purchaseRequisition";
import { DetailCard } from "../../common/detailCard.page";

export class PurchaseRequisitionDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    receiveParts: 'Receive Parts',
    createPurchaseOrder: 'Create Purchase Order'
  }

  private locators: { [key: string]: string } = {
    partStoreRoomDropdown: '[field="partStoreId"] input',
    vendorStoreDropdown: '[field="vendorStoreId"] input',
    partMeasureDropdown: '[field="measureId"] input',
    createPurchaseOrderDialog: 'div[aria-label="Create Purchase Order"]',
    purchaseOrderField: '[field="purchaseOrderIdentifier"] input',
    receivedPartsDialog: 'div[aria-label="Receive Parts"]',
    purchaseReceiptField: '[field="purchaseReceiptIdentifier"] input',
    partQuantity:'div[field="quantity"] input',
    partPrice:'div[field="price"] input',
    purchaseReqId: '[field="purchaseRequisitionIdentifier"] input'
  }

  createPurchaseRequisition(): void {
    this.clickElement(this.locators.partStoreRoomDropdown).wait(3000);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.vendorStoreDropdown).wait(3000);
    this.selectFromDropdown(0);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
  }

  createParts(quantity: string='5', price: string='10'): void {
    this.clickSectionButton(PurchaseRequisition.PARTS, this.commonLocators.addButton).wait(3000);
    this.clickElement(this.locators.partQuantity).type(quantity);
    this.clickElement(this.locators.partPrice).clear().type(price);;
    this.selectFromDropdownByRandomValue(this.locators.partMeasureDropdown);
    this.clickElement(this.commonLocators.saveButton, 1);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
  }

  createPurchaseOrder(): void {
    this.clickElement(this.getDetailCardLocators().caretButton).wait(3000);
    cy.get('li span').contains(this.constants.createPurchaseOrder).click({ force: true });
    cy.get(this.locators.createPurchaseOrderDialog).should('be.visible');
    this.clickElement(this.locators.createPurchaseOrderDialog + ' ' + this.getCommonLocators().circleCheckButton);
    cy.get(this.locators.purchaseOrderField).should('be.visible');
  }

  receivedPartsAndChangeDispositionStatus(): void {
    this.clickElement(this.getDetailCardLocators().caretButton).wait(3000);
    cy.get('li span').contains(this.constants.receiveParts).click({ force: true });
    cy.get(this.locators.receivedPartsDialog).should('be.visible');
    this.clickElement(this.locators.receivedPartsDialog + ' ' + this.getCommonLocators().circleCheckButton);
    cy.get(this.locators.purchaseReceiptField).should('be.visible');
    this.changeReceivedPartStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
  }

  changeReceivedPartStatusAndDisposition(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(PurchaseRequisition.GENERAL, status);
    this.selectRecordDisposition(PurchaseRequisition.GENERAL, disposition);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.getTextRecordStatus(PurchaseRequisition.GENERAL).should('eq', status);
    this.getTextRecordDisposition(PurchaseRequisition.GENERAL).should('eq', disposition);
  }

  getRequisitionID(section: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainer(section).parent().find(this.locators.purchaseReqId).eq(index);
  }
}
