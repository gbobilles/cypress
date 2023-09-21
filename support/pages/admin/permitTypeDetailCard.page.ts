import { DetailCard } from "../common/detailCard.page";

export class PermitTypeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=name] input',
    contentDetails: '.content-details'
  }

  createPermitType(name: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.clickVisibleElement(this.locators.contentDetails);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  renamePermitType(name: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.clickVisibleElement(this.locators.contentDetails);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
