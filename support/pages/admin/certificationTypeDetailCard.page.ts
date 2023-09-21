import { CertificationType } from "cypress/support/enums/admin/certificationType";
import { DetailCard } from "../common/detailCard.page";

export class CertificationTypeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    typeInputField: 'div[field=typeName] input'
  }

  createCertificationType(type: string): void {
    this.typeWithinField(this.locators.typeInputField, type);
    this.goToSection(CertificationType.GENERAL);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
