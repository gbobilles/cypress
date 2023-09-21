import { StandardRepair } from "cypress/support/enums/admin/standardRepair";
import { DetailCard } from "../common/detailCard.page";

export class StandardRepairDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    standardRepairIdentifierInputField: 'div[field=standardRepairIdentifier] input',
    systemDropdown: 'div[field=SystemCode] input',
    assemblyDropdown: 'div[field=AssemblyCode] input',
    componentDropdown: 'div[field=ComponentCode] input',
    workReasonDropdown: 'div[field=workReasonId] input',
    workAccomplishedCodeDropdown: 'div[field=workAccomplishedCodeId] input',
    oemRepairTimeInputField: 'div[field=oemRepairTime] input',
    thirdPartyPublisherRepairTimeInputField: 'div[field=thirdPartyPublisherRepairTime] input',
    companyRepairTimeInputField: 'div[field=companyRepairTime] input',
    averageRepairTimeInputField: 'div[field=averageRepairTime] input',
    checklistDropdown: 'div[field=interactiveListId] input',
    partDropdown: 'div[field=partId] input',
    quantityInputField: 'div[field=quantity] input',
    measureDropdown: 'div[field=measureId] input',
    pmDropdown: 'div[field=pmId] input',
    pmIntervalDropdown: 'div[field=pmIntervalGroupId] input'
  }

  createStandardRepair(standardRepairIdentifier: string, oemRepairTime: number, thirdPartyPublisherRepairTime: number, companyRepairTime: number, averageRepairTime: number): void {
    this.typeWithinField(this.locators.standardRepairIdentifierInputField, standardRepairIdentifier);
    this.selectFromDropdownByRandomValue(this.locators.systemDropdown);
    this.selectFromDropdownByRandomValue(this.locators.assemblyDropdown);
    this.selectFromDropdownByRandomValue(this.locators.componentDropdown);
    this.selectFromDropdownByRandomValue(this.locators.workReasonDropdown);
    this.selectFromDropdownByRandomValue(this.locators.workAccomplishedCodeDropdown);
    this.typeWithinField(this.locators.oemRepairTimeInputField, oemRepairTime);
    this.typeWithinField(this.locators.thirdPartyPublisherRepairTimeInputField, thirdPartyPublisherRepairTime);
    this.typeWithinField(this.locators.companyRepairTimeInputField, companyRepairTime);
    this.typeWithinField(this.locators.averageRepairTimeInputField, averageRepairTime);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  editStandardRepair(standardRepairIdentifier: string): void {
    this.typeWithinField(this.locators.standardRepairIdentifierInputField, standardRepairIdentifier);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createPart(quantity: number): void {
    this.clickSectionButton(StandardRepair.PARTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partDropdown);
    this.clickElement(this.locators.partDropdown);
    this.getSelectedItemFromDropdown().find('div').first().next().invoke('text').as('part');
    this.typeWithinField(this.locators.quantityInputField, quantity);
    this.selectFromDropdownByRandomValue(this.locators.measureDropdown);
    this.clickSectionButton(StandardRepair.PARTS, this.commonLocators.saveButton).wait(2000);
    cy.get('@part').then($part => {
      this.detailCardElements.sectionContainerElements(StandardRepair.PARTS, this.commonLocators.table)
        .find('td')
        .contains($part.toString())
        .should('be.visible');
    });
  }

  createPm(): void {
    this.clickSectionButton(StandardRepair.PMS, this.commonLocators.addButton).wait(2000);
    this.selectFromDropdownByRandomValue(this.locators.pmDropdown);
    cy.get(this.locators.pmDropdown).invoke('val').as('pm');
    this.clickSectionButton(StandardRepair.PMS, this.commonLocators.saveButton).wait(3000);
    cy.get('@pm').then($pm => {
      this.detailCardElements.sectionContainerElements(StandardRepair.PMS, this.commonLocators.table)
        .find('td')
        .contains($pm.toString())
        .should('be.visible');
    });
  }

  createPmInterval(): void {
    this.clickSectionButton(StandardRepair.PM_INTERVALS, this.commonLocators.addButton);
    this.selectActivePmInterval();
    cy.get('@pmInterval').then($pmInterval => {
      this.detailCardElements.sectionContainerElements(StandardRepair.PM_INTERVALS, this.commonLocators.table)
        .find('td')
        .contains($pmInterval.toString())
        .should('be.visible');
    });
  }

  selectActivePmInterval(): void {
    this.selectFromDropdownByRandomValue(this.locators.pmIntervalDropdown);
    this.clickElement(this.locators.pmIntervalDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('pmInterval');
    this.clickSectionButton(StandardRepair.PM_INTERVALS, this.commonLocators.saveButton).wait(2000);
    this.isElementExisting(this.commonLocators.alertDialog).then($exists => {
      if ($exists) {
        this.selectActivePmInterval();
      }
    });
  }
}
