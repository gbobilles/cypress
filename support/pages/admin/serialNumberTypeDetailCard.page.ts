import { SerialNumberType } from "cypress/support/enums/admin/serialNumberType";
import { DetailCard } from "../common/detailCard.page";

export class SerialNumberTypeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=serialNumberTypeName] input'
  }

  createSerialNumberType(name: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.goToSection(SerialNumberType.GENERAL);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
