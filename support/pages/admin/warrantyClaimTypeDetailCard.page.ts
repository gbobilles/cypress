import { DetailCard } from "../common/detailCard.page";

export class WarrantyClaimTypeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    codeInputField: 'div[field=code] input',
    description: 'div[field=description] input'
  }

  createWarrantyClaimTypes(code: number, description: string): void {
    this.typeWithinField(this.locators.codeInputField, code);
    this.typeWithinField(this.locators.description, description);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
