import { DetailCard } from "../common/detailCard.page";

export class CustomIdentifierDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    customIdentifierNameInputField: 'div[field=customIdentifierName] input',
    entityDropdown: 'div[field=entityId] input'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createCustomIdentifier(name: string): void {
    this.typeWithinField(this.locators.customIdentifierNameInputField, name);
    this.selectFromDropdownByRandomValue(this.locators.entityDropdown);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  updateCustomIdentifier(name: string): void {
    this.typeWithinField(this.locators.customIdentifierNameInputField, name);
    this.selectFromDropdownByRandomValue(this.locators.entityDropdown);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
