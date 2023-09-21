import { DetailCard } from "../common/detailCard.page";

export class WarrantyDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=name] input',
    descriptionTextArea: 'div[field=description] textarea',
    warrantyTypeDropdown: 'div[field=warrantyTypeId] input',
    warrantySourceDropdown: 'div[field=warrantySourceId] input',
    vendorDropdown: 'div[field=vendorId] input'
  }

  createWarranty(name: string, description: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.descriptionTextArea, description);
    this.selectFromDropdownByRandomValue(this.locators.warrantyTypeDropdown);
    this.selectFromDropdownByRandomValue(this.locators.warrantySourceDropdown);
    this.selectFromDropdownByRandomValue(this.locators.vendorDropdown);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
