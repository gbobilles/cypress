import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PurchaseReturn } from "cypress/support/enums/inv/purchaseReturn";
import { DetailCard } from "../../common/detailCard.page";

export class PurchaseReturnDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    purchaseReturnIdInputField: 'div[field=purchaseReturnIdentifier] input',
    typeDropdown: 'div[field=purchaseReturnTypeId] input',
    siteDropdown: 'div[field=siteId] input',
    partStoreroomDropdown: 'div[field=partStoreId] input',
    vendorStoreDropdown: 'div[field=vendorStoreId] input',
    descriptionTextArea: 'div[field=description] textarea',
    partIdDropdown: 'div[field=partId] input',
    quantityInputField: 'div[field=quantity] input',
    partReturnReasonDropdown: 'input[placeholder="Return Reason"]'
  }

  createPurchaseReturn(site: string, partStoreroom: string, type: string, description: string): Cypress.Chainable<JQuery<HTMLElement>> {
    this.typeAndSelectFromDropdownByText(this.locators.typeDropdown, type).wait(3000);
    this.typeAndSelectFromDropdownByText(this.locators.siteDropdown, site).wait(3000);
    this.typeAndSelectFromDropdownByText(this.locators.partStoreroomDropdown, partStoreroom).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.vendorStoreDropdown);
    this.typeWithinField(this.locators.descriptionTextArea, description);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
    this.clickElement(this.commonLocators.successMessageCloseButton);
    return cy.get(this.locators.purchaseReturnIdInputField).invoke('val');
  }

  createPart(part: string, quantity: number): void {
    this.clickSectionButton(PurchaseReturn.PARTS, this.commonLocators.addButton).wait(3000);
    this.typeAndSelectFromDropdownByText(this.locators.partIdDropdown, part);
    this.clickElement(this.locators.partIdDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.typeWithinField(this.locators.quantityInputField, quantity);
    this.selectFromDropdownByRandomValue(this.locators.partReturnReasonDropdown);
    this.changePartStatusAndDisposition(Status.INACTIVE, Disposition.RETURNED);
    this.clickSectionButton(PurchaseReturn.PARTS, this.commonLocators.saveButton).wait(8000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(PurchaseReturn.PARTS, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }

  changePartStatusAndDisposition(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(PurchaseReturn.PARTS, status);
    this.selectRecordDisposition(PurchaseReturn.PARTS, disposition);
  }

  changeStatusAndDisposition(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(PurchaseReturn.GENERAL, status);
    this.selectRecordDisposition(PurchaseReturn.GENERAL, disposition);
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
    this.clickElement(this.commonLocators.successMessageCloseButton);
  }
}
