import MathUtils from "cypress/support/utils/mathUtils";
import { DetailCard } from "../common/detailCard.page";

export class InteractiveChecklistDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    checklistNameInputField: 'div[field=interactiveListName] input',
    checklistTypeDropdown: 'div[field=interactiveListTypeId] input',
    notesTextArea: 'div[field=notes] textarea',
    stepDropdown: 'div[field=stepId] input',
    orderInputField: 'div[field=ordinal] input'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createChecklist(checklistName: string, checklistType: string): void {
    this.typeWithinField(this.locators.checklistNameInputField, checklistName);
    this.clickElement(this.locators.checklistTypeDropdown);
    this.selectFromDropdownByText(checklistType);
    this.typeWithinField(this.locators.notesTextArea, checklistName + MathUtils.generateRandomNumber(5));
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createStep(order: number): void {
    this.selectFromDropdownByRandomValue(this.locators.stepDropdown);
    this.typeWithinField(this.locators.orderInputField, order);
  }

  getStepValue(index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.locators.stepDropdown).eq(index);
  }
}
