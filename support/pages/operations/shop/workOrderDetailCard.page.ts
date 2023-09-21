import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { DetailCard } from "../../common/detailCard.page";

export class WorkOrderDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    openWorkRequestsTitle: 'Open Work Requests',
    openTasksTitle: 'Open Tasks',
    createPurchaseOrder: 'Create Purchase Order',
    workOrderDialogMessage: 'Take this Asset out of service?',
    estimatedCostWorkOrder: '20'
  }

  private locators: { [key: string]: string } = {
    assetDropdown: 'div[field=assetId] input',
    summaryItemTitle: '.summary-item-title',
    siteDropdown: 'div[field=siteId] input',
    workOrderTypeDropdown: 'div[field=workOrderTypeId] input',
    vendorStoreDropdown: 'div[field=vendorStoreId] input',
    descriptionTextArea: 'div[field=description] textarea',
    workOrderDialogMessage: '.el-message-box .el-message-box__message',
    workOrderIdInputField: 'div[field=workOrderIdentifier] input',
    workOrderEstimatedCostField: 'div[field=estimatedCost] input',
    datePickerButton: '.el-picker-panel button',
    meterName: '.meter-name',
    meterDetails: '.meter-details',
    meterReadingDetails: '.meter-reading-details',
    meterReadingInputField: '.add-meter-reading .input-number input',
    meterReadingDateTime: '.add-meter-reading .input-date-time input',
    meterReadingSaveButton: '.add-meter-reading .fa-save',
    todoName: 'div[field=name] input',
    todoDescription: 'div[field=description] textarea',
    todoItemList: '.to-do-list-item-name .fa-circle-o',
    todoItemChecked: '.to-do-list-item-name .fa-check-circle'
  }
  private elements = {
    datePickerButton: (button: string) => cy.get(this.locators.datePickerButton).filter(':visible').contains(button),
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  changeWorkOrderStatusAndDisposition(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(WorkOrder.GENERAL, status);
    this.selectRecordDisposition(WorkOrder.GENERAL, disposition);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
  }

  generatePurchaseOrderFromWorkOrder(): void {
    this.clickElement(this.detailCardLocators.caretButton);
    cy.get('span').contains(this.constants.createPurchaseOrder).click({ force: true }).wait(1000);
  }

  verifyWorkRequestStatus(statusColumn: string, dispositionColumn: string, expectedStatus: Status, expectedDisposition: Disposition): void {
    this.getDetailCardElements().sectionContainerElements(WorkOrder.WORK_REQUESTS, 'th[data-field=' + statusColumn + ']').invoke('attr', 'data-index').then((index: number) => {
      this.getDetailCardElements().sectionContainerElements(WorkOrder.WORK_REQUESTS, this.commonLocators.table)
        .should('have.length', 1)
        .find('td')
        .eq(index)
        .should('have.text', expectedStatus);
    });
    this.getDetailCardElements().sectionContainerElements(WorkOrder.WORK_REQUESTS, 'th[data-field=' + dispositionColumn + ']').invoke('attr', 'data-index').then((index: number) => {
      this.getDetailCardElements().sectionContainerElements(WorkOrder.WORK_REQUESTS, this.commonLocators.table)
        .should('have.length', 1)
        .find('td')
        .eq(index)
        .should('have.text', expectedDisposition);
    });
  }

  verifyOpenWorkRequestsAndTasks(openWorkRequests: number, openTasks: number): void {
    cy.get(this.locators.summaryItemTitle).contains(this.constants.openWorkRequestsTitle).next('div').should('have.text', openWorkRequests);
    cy.get(this.locators.summaryItemTitle).contains(this.constants.openTasksTitle).next('div').should('have.text', openTasks);
  }

  createWorkOrder(): void {
    this.clickElement(this.locators.assetDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.siteDropdown).wait(500);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.workOrderTypeDropdown).wait(500);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.vendorStoreDropdown).wait(500);
    this.selectFromDropdown(0);
    this.clickElement(this.commonLocators.saveButton);
    this.isElementExisting(this.locators.workOrderDialogMessage).then($exists => {
      if ($exists) {
        cy.get(this.locators.workOrderDialogMessage).then(($message) => {
          if ($message.text().includes(this.constants.workOrderDialogMessage)) {
            cy.get('button').contains('No').click();
          }
        });
      }
    });
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton).wait(3000);
  }

  createWorkOrderWithOutAsset(): Cypress.Chainable<string> {
    this.clickElement(this.locators.assetDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.siteDropdown).wait(500);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.workOrderTypeDropdown).wait(500);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.vendorStoreDropdown).wait(500);
    this.selectFromDropdown(0);
    this.clickElement(this.commonLocators.saveButton);
    this.isElementExisting(this.locators.workOrderDialogMessage).then($exists => {
      if ($exists) {
        cy.get(this.locators.workOrderDialogMessage).then(($message) => {
          if ($message.text().includes(this.constants.workOrderDialogMessage)) {
            cy.get('button').contains('No').click();
          }
        });
      }
    });
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    return cy.get(this.locators.workOrderIdInputField).invoke('val');
  }

  createWorkRequest(description: string): void {
    this.clickSectionButton(WorkOrder.WORK_REQUESTS, this.commonLocators.addButton).wait(2000);
    this.typeWithinField(this.locators.descriptionTextArea, description).wait(3000);
    this.typeWithinField(this.locators.workOrderEstimatedCostField, this.constants.estimatedCostWorkOrder).wait(3000);
    this.clickVisibleElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton).wait(2000);
  }

  updateMeterReading(meterName: string, meterReading: any, date: string): void {
    cy.get(this.locators.meterName).contains(meterName).next(this.locators.meterDetails).find(this.locators.meterReadingInputField).type(meterReading, { force: true });
    cy.get(this.locators.meterName).contains(meterName).next(this.locators.meterDetails).find(this.locators.meterReadingDateTime).type(date, { force: true }).wait(2000);
    this.elements.datePickerButton('OK').click({ force: true }).wait(3000);
    cy.get(this.locators.meterName).contains(meterName).next(this.locators.meterDetails).find(this.locators.meterReadingSaveButton).click({ force: true }).wait(2000);
  }

  createToDo(name: string, description: string): void {
    this.clickSectionButton(WorkOrder.TO_DO, this.commonLocators.addButton).wait(2000);
    this.typeWithinField(this.locators.todoName, name).wait(3000);
    this.typeWithinField(this.locators.todoDescription, description).wait(3000);
    this.clickVisibleElement(this.commonLocators.mainSaveButton);
  }
}
