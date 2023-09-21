import { WorkOrderClass } from "cypress/support/enums/admin/workOrderClass";
import { DetailCard } from "../common/detailCard.page";

export class WorkOrderClassDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    classInputField: 'div[field=workOrderClassName] input'
  }

  createWorkOrderClass(className: string): void {
    this.typeWithinField(this.locators.classInputField, className);
    this.goToSection(WorkOrderClass.GENERAL);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
