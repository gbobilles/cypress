import { DetailCard } from "../common/detailCard.page";

export class StepDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    stepInputField: 'div[field=stepName] input',
    descriptionTextArea: 'div[field=description] textarea',
    checklistTypeDropdown: 'div[field=interactiveListTypeId] input'
  }

  createStep(stepName: string, description: string): void {
    this.typeWithinField(this.locators.stepInputField, stepName);
    this.typeWithinField(this.locators.descriptionTextArea, description);
    this.selectFromDropdownByRandomValue(this.locators.checklistTypeDropdown);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton).wait(3000);
  }
}
