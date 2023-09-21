import { Sites } from "cypress/support/enums/admin/sites";
import { DetailCard } from "../common/detailCard.page";

export class SiteDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    siteNameInputField: 'div[field=name] input',
    organizationalUnitDropdown: 'div[field=organizationalUnitId] input',
    shiftNameInputField: 'div[field=name] input',
    defaultShift: 'div[field=defaultShift] span',
    laborRateNameInputField: 'div[field=laborRateName] input',
    laborRateInputField: 'div[field=rate] input',
    feeSubjectDropdown: 'div[field=costSubjectId] input',
    feeAmountInputField: 'div[field=factor] input',
    taxRateInputField: 'div[field=rate] input'
  }

  createSite(siteName: string): void {
    this.typeWithinField(this.locators.siteNameInputField, siteName);
    this.selectFromDropdownByRandomValue(this.locators.organizationalUnitDropdown);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createShift(name: string): void {
    this.typeWithinField(this.locators.shiftNameInputField, name, 1);
    this.clickElement(this.locators.defaultShift);
    this.clickSectionButton(Sites.SHIFTS, this.commonLocators.saveButton).wait(2000);
  }

  createLaborRate(name: string): void {
    this.typeWithinField(this.locators.laborRateNameInputField, name);
    this.typeWithinField(this.locators.laborRateInputField, '20');
    this.clickSectionButton(Sites.LABOR_RATES, this.commonLocators.saveButton).wait(2000);
  }

  createFee(): void {
    this.selectFromDropdownByRandomValue(this.locators.feeSubjectDropdown).wait(2000);
    this.typeWithinField(this.locators.feeAmountInputField, '20');
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createOtherCost(): void {
    this.selectFromDropdownByRandomValue(this.locators.feeSubjectDropdown).wait(2000);
    this.typeWithinField(this.locators.feeAmountInputField, '20');
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createTax(): void {
    this.selectFromDropdownByRandomValue(this.locators.feeSubjectDropdown).wait(2000);
    this.typeWithinField(this.locators.taxRateInputField, '10');
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
