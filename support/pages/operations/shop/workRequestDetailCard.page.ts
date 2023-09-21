import { WorkEstimate } from "cypress/support/enums/shop/workEstimate";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { WorkOrderType } from "cypress/support/enums/shop/workOrderType";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import MathUtils from "cypress/support/utils/mathUtils";
import { DetailCard } from "../../common/detailCard.page";

export class WorkRequestDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    workOrderCreateSuccessMessage: 'Creating Work Order',
    dueValue: 'Due Value'
  }

  private locators: { [key: string]: string } = {
    workRequestIdInputField: 'div[field=workRequestName] input',
    descriptionTextArea: 'div[field=description] textarea',
    assetDropdown: 'div[field=assetId] input',
    priorityDropdown: 'div[field=priorityId] input',
    vendorStoreDropdown: 'div input[placeholder="Vendor Store"]',
    workOrderDialog: 'div[aria-label="Work Order"]',
    pmIntervalDropdown: 'div[field=pmIntervalId] input',
    standardRepairDropdown: 'div[field=standardRepairId] input'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createWorkRequest(workRequest: any, assetId: string): void {
    this.typeWithinField(this.locators.descriptionTextArea, workRequest.description + MathUtils.generateRandomNumber(5));
    this.typeWithinField(this.locators.assetDropdown, assetId);
    this.selectFromDropdownByText(assetId).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.priorityDropdown);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createWorkRequestWithoutAsset(workRequest: any): Cypress.Chainable<string> {
    this.typeWithinField(this.locators.descriptionTextArea, workRequest.description + MathUtils.generateRandomNumber(5));
    this.selectFromDropdownByRandomValue(this.locators.assetDropdown);
    this.selectFromDropdownByRandomValue(this.locators.priorityDropdown);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    return cy.get(this.locators.workRequestIdInputField).invoke('val');
  }

  createWorkRequestWithPmInterval(workRequest: any, assetId: string, pmInterval: string, dueValue: number): void {
    this.typeWithinField(this.locators.descriptionTextArea, workRequest.description + MathUtils.generateRandomNumber(5));
    this.typeWithinField(this.locators.assetDropdown, assetId);
    this.selectFromDropdownByText(assetId).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.priorityDropdown);
    this.typeWithinField(this.locators.pmIntervalDropdown, pmInterval);
    this.selectFromDropdown(0);
    cy.get('.label > label').contains(this.constants.dueValue).should('exist');
    cy.get('.label > label').contains(this.constants.dueValue).parent().next().find(this.commonLocators.label).should('have.text', dueValue);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createStandardRepair(): void {
    this.clickSectionButton(WorkRequest.STANDARD_REPAIRS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.standardRepairDropdown);
    this.clickSectionButton(WorkRequest.STANDARD_REPAIRS, this.commonLocators.saveButton);
  }

  generateWorkOrderFromWorkRequest(workOrderType: WorkOrderType): void {
    const create = 'Create ';
    this.clickElement(this.detailCardLocators.caretButton).wait(5000);
    switch (workOrderType) {
      case WorkOrderType.INTERNAL:
        cy.get('li span').contains(create + WorkOrderType.INTERNAL).click({ force: true });
        break;
      case WorkOrderType.EXTERNAL:
        cy.get('li span').contains(create + WorkOrderType.EXTERNAL).click({ force: true });
        this.selectFromDropdownByRandomValue(this.locators.vendorStoreDropdown).wait(2000);
        cy.get(this.locators.workOrderDialog).should('be.visible');
        this.clickElement(this.locators.workOrderDialog + ' ' + this.commonLocators.circleCheckButton);
        break;
      default:
    }
    this.verifyAlertMessage(this.constants.workOrderCreateSuccessMessage).wait(5000);
    this.verifyCardByTitle(WorkOrder.WORK_ORDER);
  }

  generateWorkEstimateFromWorkRequest(): void {
    this.clickElement(this.detailCardLocators.caretButton).wait(3000);
    cy.get('li span').contains('Create Work Estimate').click({ force: true }).wait(5000);
    this.verifyCardByTitle(WorkEstimate.WORK_ESTIMATE);
  }
}
