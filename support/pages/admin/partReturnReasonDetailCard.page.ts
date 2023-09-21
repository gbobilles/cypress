import { DetailCard } from "../common/detailCard.page";

export class PartReturnReasonDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=partReturnReasonName] input',
    contentDetails: '.content-details'
  }

  createPartReturnReason(name: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.clickVisibleElement(this.locators.contentDetails);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  renamePartReturnReason(name: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.clickVisibleElement(this.locators.contentDetails);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
