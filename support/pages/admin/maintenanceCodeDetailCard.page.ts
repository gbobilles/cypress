import { DetailCard } from "../common/detailCard.page";

export class MaintenanceCodeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    codeInputField: 'input[placeholder=Code]',
    descriptionInputField: 'input[placeholder=Description]',
    nameInputField: 'input[placeholder=Name]',
    exampleInputField: 'input[placeholder=Example]',
    code2dInputField: 'input[placeholder="Code 2D"]',
    code4dInputField: 'input[placeholder="Code 4D Alpha"]',
    systemCodeInputField: 'input[placeholder="System Code"]',
    assemblyCodeInputField: 'input[placeholder="Assembly Code"]',
    componentCodeInputField: 'input[placeholder="Component Code"]',
    definitionInputField: 'input[placeholder="Definition"]',
    workTypeInputField: 'input[placeholder="Work Type"]',
    priorityNameInputField: 'input[placeholder="Priority Name"]'
  }

  createWorkRequestReasonCode(code: string, description: string): void {
    this.typeWithinField(this.locators.codeInputField, code);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createFailureCode(code: string, name: string, example: string): void {
    this.typeWithinField(this.locators.codeInputField, code);
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.exampleInputField, example);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createPositionCode(code2d: string, code4d: string, description: string): void {
    this.typeWithinField(this.locators.code2dInputField, code2d);
    this.typeWithinField(this.locators.code4dInputField, code4d);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createSystemCode(systemCode: string, description: string): void {
    this.typeWithinField(this.locators.systemCodeInputField, systemCode);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createAssemblyCode(assemblyCode: string, description: string): void {
    this.typeWithinField(this.locators.assemblyCodeInputField, assemblyCode);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.selectFromDropdownByRandomValue(this.locators.systemCodeInputField);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createComponentCode(componentCode: string, description: string): void {
    this.typeWithinField(this.locators.componentCodeInputField, componentCode);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.selectFromDropdownByRandomValue(this.locators.assemblyCodeInputField);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createWorkAccomplishedCode(code: string, name: string, definition: string): void {
    this.typeWithinField(this.locators.codeInputField, code);
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.definitionInputField, definition);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createWorkReasonCode(code: string, name: string, workType: string): void {
    this.typeWithinField(this.locators.codeInputField, code);
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.workTypeInputField, workType);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createPriority(priorityName: string): void {
    this.typeWithinField(this.locators.priorityNameInputField, priorityName);
    this.clickElement(this.commonLocators.mainSaveButton).wait(2000);
  }
}
