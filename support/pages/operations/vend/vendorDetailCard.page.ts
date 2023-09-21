import { Vendor } from "cypress/support/enums/vend/vendor";
import { DetailCard } from "../../common/detailCard.page";

export class VendorDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=name] input',
    vendorIdInputField: 'div[field=vendorIdentifier] input',
    descriptionInputField: 'div[field=description] input',
    billingMethodDropdown: 'div[field=billingMethodId] input',
    notesInputField: 'div[field=notes] textarea',
    vendorTypeDropdown: '[field=vendorTypeId] input',
    vendorStoreIdInputField: '[field="vendorStoreIdentifier"] input'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createVendor(name: string, vendorId: string, description: string, notes: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.vendorIdInputField, vendorId);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.selectFromDropdownByRandomValue(this.locators.billingMethodDropdown);
    this.typeWithinField(this.locators.notesInputField, notes);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createVendorTypes(): void {
    this.clickSectionButton(Vendor.VENDOR_TYPES, this.getCommonLocators().addButton);
    this.selectFromDropdownByRandomValue(this.locators.vendorTypeDropdown);
    this.clickVisibleElement(this.locators.vendorTypeDropdown).invoke('attr', 'placeholder').as('value');
    this.clickSectionButton(Vendor.VENDOR_TYPES, this.getCommonLocators().saveButton).wait(2000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(Vendor.VENDOR_TYPES, this.commonLocators.table)
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }

  createVendorStore(vendorId: number, vendorName: string): void {
    this.typeWithinField(this.locators.vendorStoreIdInputField, vendorId);
    this.clickVisibleElement(this.locators.vendorStoreIdInputField).invoke('attr', 'placeholder').as('value');
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    cy.closeCardByTitle(`Vendor Store: ${vendorName}`);
  }
}
