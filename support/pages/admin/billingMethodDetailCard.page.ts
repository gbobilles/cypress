import { DetailCard } from "../common/detailCard.page";

export class BillingMethodDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=billingMethodName] input',
    descriptionInputField: 'div[field=description] input'
  }

  createBillingMethod(name: string, description: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
