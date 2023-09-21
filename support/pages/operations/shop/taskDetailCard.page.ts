import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Task } from "cypress/support/enums/shop/task";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import { DetailCard } from "../../common/detailCard.page";

export class TaskDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    currentMeterReading: 'Current Meter Reading',
    saveNewReading: 'Save New Reading',
    correctMeterReading: 'Is this the correct meter reading for the PM?'
  }

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=name] input',
    systemCodeDropdown: 'div[field=SystemCode] input',
    assemblyCodeDropdown: 'div[field=AssemblyCode] input',
    componentCodeDropdown: 'div[field=ComponentCode] input',
    workReasonDropdown: 'div[field=workReasonId] input',
    failureCodeDropdown: 'div[field=failureCodeId] input',
    workAccomplishedCodeDropdown: 'div[field=workAccomplishedCodeId] input',
    partDropdown: 'div[field=partId] input',
    partStoreroomDropdown: 'div[field=partStoreId] input',
    quantityInputField: 'div[field=quantity] input',
    personDropdown: 'div[field=timeManagerId] input',
    durationInputField: 'div[field=duration] input',
    externalPartDescriptionInputField: 'div[field=partDescription] input',
    externalPartQuantityInputField: 'div[field=partQuantity] input',
    externalPartCostInputField: 'div[field=partCost] input',
    externalLaborDescriptionInputField: 'div[field=laborDescription] input',
    externalLaborHoursInputField: 'div[field=laborHours] input',
    externalLaborCostInputField: 'div[field=laborCost] input',
    externalTaxInputField: 'div[field=taxCost] input',
    externalWorkDescriptionInputField: 'div[field=notes] textarea',
    personnelDropdown: 'div[field=personId] input'
  }

  createTask(taskName: string): void {
    this.clickSectionButton(WorkRequest.TASKS, this.commonLocators.addButton);
    this.typeWithinField(this.locators.nameInputField, taskName);
    this.goToSection(Task.GENERAL);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    cy.closeCardByTitle(Task.TASK);
  }

  editCodes(): void {
    this.selectFromDropdownByRandomValue(this.locators.systemCodeDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.assemblyCodeDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.componentCodeDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.workReasonDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.failureCodeDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.workAccomplishedCodeDropdown).wait(1000);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  changeTaskStatusAndDisposition(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(Task.GENERAL, status);
    this.selectRecordDisposition(Task.GENERAL, disposition);
    this.clickElement(this.commonLocators.saveButton);
  }

  createPart(quantity: number): void {
    this.clickSectionButton(Task.PARTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partDropdown);
    this.selectFromDropdownByRandomValue(this.locators.partStoreroomDropdown);
    this.typeWithinField(this.locators.quantityInputField, quantity);
    this.selectRecordStatus(Task.PARTS, Status.CLOSED);
    this.selectRecordDisposition(Task.PARTS, Disposition.APPLIED);
    this.clickSectionButton(Task.PARTS, this.commonLocators.saveButton);
  }

  createExternalPart(partDescription: string, date: string, quantity: number, cost: number, tax: number, workDescription: string): void {
    this.clickSectionButton(Task.EXTERNAL_PARTS, this.commonLocators.addButton);
    this.typeWithinField(this.locators.externalPartDescriptionInputField, partDescription);
    this.typeWithinField(this.commonLocators.datePicker, date);
    this.typeWithinField(this.locators.externalPartQuantityInputField, quantity);
    this.typeWithinField(this.locators.externalPartCostInputField, cost);
    this.typeWithinField(this.locators.externalTaxInputField, tax);
    this.typeWithinField(this.locators.externalWorkDescriptionInputField, workDescription);
    this.clickSectionButton(Task.EXTERNAL_PARTS, this.commonLocators.saveButton);
  }

  createLabor(duration: number): void {
    this.clickSectionButton(Task.LABOR, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.personDropdown);
    this.typeWithinField(this.locators.durationInputField, duration);
    this.clickSectionButton(Task.LABOR, this.commonLocators.saveButton);
  }

  createExternalLabor(laborDescription: string, date: string, hours: number, cost: number, tax: number, workDescription: string): void {
    this.clickSectionButton(Task.EXTERNAL_LABOR, this.commonLocators.addButton);
    this.typeWithinField(this.locators.externalLaborDescriptionInputField, laborDescription);
    this.typeWithinField(this.commonLocators.datePicker, date);
    this.typeWithinField(this.locators.externalLaborHoursInputField, hours);
    this.typeWithinField(this.locators.externalLaborCostInputField, cost);
    this.typeWithinField(this.locators.externalTaxInputField, tax);
    this.typeWithinField(this.locators.externalWorkDescriptionInputField, workDescription);
    this.clickSectionButton(Task.EXTERNAL_LABOR, this.commonLocators.saveButton);
  }

  createPersonnel(personnelName: string): void {
    this.clickSectionButton(Task.ASSIGNED_PERSONNEL, this.commonLocators.addButton).wait(3000);
    this.typeAndSelectFromDropdownByText(this.locators.personnelDropdown, personnelName);
    this.clickSectionButton(Task.ASSIGNED_PERSONNEL, this.commonLocators.saveButton);
  }

  saveNewReading(newReading: any): void {
    cy.get(this.commonLocators.h2).contains(this.constants.currentMeterReading).should('be.visible');
    cy.get(this.commonLocators.p).contains(this.constants.correctMeterReading).next().find('label').contains('Odometer').parent().next().find('input').clear({ force: true }).type(newReading);
    cy.get(this.commonLocators.span).contains(this.constants.saveNewReading).click({ force: true });
    cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
    this.clickElement(this.commonLocators.successMessageCloseButton).wait(2000);
  }
}
