import { DetailCard } from "../../common/detailCard.page";

export class MeterDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    meterName: 'div[field=meterName] input',
    measureDropdown: 'div[field=meterTypeMeasureId] input',
    methodDropdown: 'div[field=meterMethodId] input',
    saveButton: '.details-actions .fa-floppy-o'
  }

  createMeter(name: string, measure: string, method: string): void {
    this.typeWithinField(this.locators.meterName, name);
    this.clickElement(this.locators.measureDropdown);
    this.typeWithinField(this.locators.measureDropdown, measure);
    this.selectFromDropdownByText(measure);
    this.clickElement(this.locators.methodDropdown);
    this.typeWithinField(this.locators.methodDropdown, method);
    this.selectFromDropdownByText(method);
    this.clickElement(this.locators.saveButton);
  }
}
