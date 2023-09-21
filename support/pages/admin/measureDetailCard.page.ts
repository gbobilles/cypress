import { DetailCard } from "../common/detailCard.page";

export class MeasureDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    measureNameInputField: 'div[field=measureName] input',
    measureTypeDropdown: 'div[field=measureTypeId] input',
    measureSystemDropdown: 'div[field=measureSystemId] input'
  }

  createMeasure(type: string): void {
    this.typeWithinField(this.locators.measureNameInputField, type);
    this.selectFromDropdownByRandomValue(this.locators.measureTypeDropdown);
    this.selectFromDropdownByRandomValue(this.locators.measureSystemDropdown).wait(1000);
    this.clickVisibleElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
