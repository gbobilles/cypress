import { Pm } from "cypress/support/enums/pm/pm";
import { DetailCard } from "../../common/detailCard.page";

export class PmDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    comingDueMilesInputField: 'div[field=comingDueFixed] input',
    duePeriodMilesInputField: 'div[field=duePeriodFixed] input',
    criticalMilesInputField: 'div[field=criticalFixed] input',
    intervalInputField: 'div[field=interval] input',
    measureDropdown: 'div[field=measureId] input',
    nameInputField: 'div[field=name] input',
    pmIntervalGroupNameInputField: 'div[field=pmIntervalGroupName] input',
    addButton: '.left-menu-items .fa-plus',
    saveButton: '.details-actions .fa-floppy-o'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createPmWithIntervalAndMetric(pmName: string, metric: string, measure: string, interval: number, comingDueMiles: number, duePeriodMiles: number, criticalMiles: number): void {
    this.createPm(pmName);
    this.createPmInterval(pmName);
    this.createMetric(metric, measure, interval, comingDueMiles, duePeriodMiles, criticalMiles);
  }

  createPm(pmName: string): void {
    this.typeWithinField(this.locators.nameInputField, pmName);
    this.goToSection(Pm.GENERAL);
    this.clickElement(this.locators.saveButton).wait(3000);
  }

  createPmInterval(pmInterval: string): void {
    this.goToSection(Pm.PM_INTERVALS);
    this.clickSectionButton(Pm.PM_INTERVALS, this.locators.addButton);
    this.typeWithinField(this.locators.pmIntervalGroupNameInputField, pmInterval);
    this.clickVisibleElement(this.locators.saveButton).wait(3000);
  }

  createMetric(metric: string, measure: string, interval: number, comingDueMiles: number, duePeriodMiles: number, criticalMiles: number): void {
    this.goToSection(Pm.METRICS);
    this.clickSectionButton(Pm.METRICS, this.locators.addButton).wait(1000);
    this.typeWithinField(this.locators.nameInputField, metric);
    this.goToSection(Pm.METRIC_DETAILS);
    this.clickElement(this.locators.measureDropdown);
    this.typeWithinField(this.locators.measureDropdown, measure).wait(2000);
    this.selectFromDropdown(0);
    this.typeWithinField(this.locators.intervalInputField, interval);
    this.clickElement(this.locators.comingDueMilesInputField);
    this.typeWithinField(this.locators.comingDueMilesInputField, comingDueMiles);
    this.typeWithinField(this.locators.duePeriodMilesInputField, duePeriodMiles);
    this.clickElement(this.locators.criticalMilesInputField);
    this.typeWithinField(this.locators.criticalMilesInputField, criticalMiles);
    this.goToSection(Pm.METRIC_DETAILS);
    this.clickVisibleElement(this.locators.saveButton).wait(2000);
  }
}
