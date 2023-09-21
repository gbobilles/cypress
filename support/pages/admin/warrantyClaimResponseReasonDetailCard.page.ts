import { WarrantyClaimResponseReason } from "cypress/support/enums/admin/warrantyClaimResponseReason";
import { DetailCard } from "../common/detailCard.page";

export class WarrantyClaimResponseReasonDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    codeInputField: 'div[field=code] input',
    descriptionInputField: 'div[field=description] input'
  }

  createWarrantyClaimResponseReason(code: string, description: string): void {
    this.typeWithinField(this.locators.codeInputField, code);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.goToSection(WarrantyClaimResponseReason.GENERAL);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
