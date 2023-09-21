import { DetailCard } from "../common/detailCard.page";

export class PartTypeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    partTypeNameInputField: 'div[field=partTypeName] input',
    parentPartTypeDropdown: 'div[field=parentPartTypeId] input'
  }

  createPartType(partTypeName: string): void {
    this.typeWithinField(this.locators.partTypeNameInputField, partTypeName);
    this.selectFromDropdownByRandomValue(this.locators.parentPartTypeDropdown);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
