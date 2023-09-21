import { PartStoreroom } from "cypress/support/enums/inv/partStoreroom";
import { DetailCard } from "cypress/support/pages/common/detailCard.page";

export class PartStoreroomDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    addPart: 'Add Part',
    selectPart: 'Select a part',
    enterAverageCost: '(enter average cost)',
    enterLifoCost: '(enter LIFO cost)',
    enterFifoCost: '(enter FIFO cost)',
    enterQuantity: '(enter quantity)',
    stockingLevelType: 'Stocking Level Type',
    min: '4',
    max: '5',
    transferSuccessMessage: 'Transferred successfully'
  }

  private locators: { [key: string]: string } = {
    partStoreroomNameInputField: 'div[field=name] input',
    partStoreroomDescriptionInputField: 'div[field=description] textarea',
    siteDropdown: 'div[field=siteId] input',
    partStoreroomLocationNameInputField: 'div[field=name] input',
    partStoreroomLocationTypeDropdown: 'div[field=partStoreLocationTypeId] input',
    canContainPartsInputSwitch: 'div[field=canContainParts]',
    partStoreroomLocationDescriptionInputField: 'div[field=description] textarea',
    addChildButton: 'button[data-command=addchild]',
    detailsButton: 'button[data-command=showdetails]',
    expandButton: '.k-i-expand',
    partsInStoreroomConfirmationDialog: 'div[aria-label="Confirmation"]',
    selectGlAccountDropdown: 'input[placeholder="Select GL Account"]',
    partIdDropdown: '[field="partId"] input',
    glAccountDropdown: '[field="glAccountId"] input',
    stockedInputSwitch: 'div[field=isStocked]',
    stockingLevelTypeSwitch: '[role=radio] > span',
    monthlyMinMaxQuantityInputField: '.qty input',
    partQuantityInputField: '[field="quantity"] input',
    stockingLevelConfirmationDialog: '[aria-label="Are you sure?"]',
    toPartStoreroomDropdown: '[field="transferToPartStoreId"] input',
    partTransferButton: 'button.fa-exchange',
    partIdField: 'td[role="gridcell"]'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  getConstants(): { [key: string]: string } {
    return this.constants;
  }

  createPartStoreroom(name: string, description: string, siteIncluded:boolean = false): void {
    if(siteIncluded){
    this.typeWithinField(this.locators.partStoreroomNameInputField, name, 1);
    this.typeWithinField(this.locators.partStoreroomDescriptionInputField, description, 1);
    } else {
      this.typeWithinField(this.locators.partStoreroomNameInputField, name);
      this.typeWithinField(this.locators.partStoreroomDescriptionInputField, description);
    }
    if(!siteIncluded){
    this.clickElement(this.locators.siteDropdown);
    this.selectFromDropdown(0);
    } 
    if(siteIncluded){
    this.clickElement(this.commonLocators.saveButton, 1);
    }
    else {
      this.clickElement(this.commonLocators.saveButton);
      cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
      this.clickElement(this.commonLocators.successMessageCloseButton);
    }

  }

  createPartInStoreroom(averageCost: any, lifoCost: any, fifoCost: any, newQuantity: any): void {
    this.clickSectionButton(PartStoreroom.PARTS_IN_STOREROOM, this.commonLocators.lockButton).wait(3000);
    this.clickSectionButton(PartStoreroom.PARTS_IN_STOREROOM, this.commonLocators.addButton);
    cy.contains(this.commonLocators.span, this.constants.selectPart).click({ force: true }).wait(15000);
    this.selectFromDropdown(0).wait(3000);
    cy.contains(this.commonLocators.em, this.constants.enterAverageCost).type(averageCost).wait(1000);
    cy.contains(this.commonLocators.em, this.constants.enterLifoCost).type(lifoCost).wait(1000);
    cy.contains(this.commonLocators.em, this.constants.enterFifoCost).type(fifoCost).wait(1000);
    cy.contains(this.commonLocators.em, this.constants.enterQuantity).type(newQuantity).wait(3000);
    this.goToSection(PartStoreroom.PARTS_IN_STOREROOM);
    this.clickSectionButton(PartStoreroom.PARTS_IN_STOREROOM, this.commonLocators.mainSaveButton).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.selectGlAccountDropdown).wait(5000);
    this.clickElement(this.locators.partsInStoreroomConfirmationDialog + ' ' + this.commonLocators.saveButton).wait(8000);
  }

  createPartStoreroomLocation(name: string, description: string): void {
    this.typeWithinVisibleField(this.locators.partStoreroomLocationNameInputField, name);
    this.selectFromDropdownByRandomValue(this.locators.partStoreroomLocationTypeDropdown);
    cy.get(this.locators.canContainPartsInputSwitch).find(this.commonLocators.label).find(this.commonLocators.span).contains('Yes').click({ force: true });
    this.typeWithinVisibleField(this.locators.partStoreroomDescriptionInputField, description);
    this.clickSectionButton(PartStoreroom.PART_STOREROOM_LOCATIONS, this.commonLocators.saveButton).wait(2000);
  }

  addChildPartStoreroomLocation(parent: string, child: string, description: string): void {
    this.getDetailCardElements().sectionContainerElements(PartStoreroom.PART_STOREROOM_LOCATIONS, this.commonLocators.table)
      .find('td')
      .contains(parent)
      .parent('tr')
      .find(this.locators.addChildButton)
      .click({ force: true })
      .wait(3000);
    this.createPartStoreroomLocation(child, description);
  }

  expandPartStoreoomLocation(parent: string, child: string): void {
    this.getDetailCardElements().sectionContainerElements(PartStoreroom.PART_STOREROOM_LOCATIONS, this.commonLocators.table)
      .find('td')
      .contains(parent)
      .parent('tr')
      .find(this.locators.expandButton)
      .click({ force: true });
    this.getDetailCardElements().sectionContainerElements(PartStoreroom.PART_STOREROOM_LOCATIONS, this.commonLocators.table)
      .find('td')
      .contains(child)
      .should('be.visible');
  }

  showPartStoreroomLocationDetails(parent: string): void {
    this.getDetailCardElements().sectionContainerElements(PartStoreroom.PART_STOREROOM_LOCATIONS, this.commonLocators.table)
      .find('td')
      .contains(parent)
      .parent('tr')
      .find(this.locators.detailsButton)
      .click({ force: true });
    this.verifyCardByTitle(PartStoreroom.PART_STORE_LOCATION);
  }

  addPartToStoreroom(stocked: boolean, quantity: number = 9): void {
    this.clickElement(this.detailCardLocators.caretButton).wait(3000);
    cy.get('li span').contains(this.constants.addPart).click({ force: true }).wait(10000);
    cy.get(this.locators.partIdDropdown).should('be.visible');
    this.selectFromDropdownByRandomValue(this.locators.partIdDropdown).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.glAccountDropdown).wait(3000);
    this.typeWithinField(this.locators.partQuantityInputField, quantity);
    cy.get(this.locators.stockedInputSwitch).find(this.commonLocators.span).contains(stocked ? 'Yes' : 'No').click({ force: true });
    this.clickElement(this.commonLocators.saveButton);
  }

  transferPart(partId: string): void {
    cy.get(this.locators.partIdDropdown).should('be.visible');
    this.typeAndSelectFromDropdownByText(this.locators.partIdDropdown, partId).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.toPartStoreroomDropdown).wait(3000);
    this.clickElement(this.locators.partTransferButton);
    this.verifyAlertMessage(this.constants.transferSuccessMessage).wait(3000);
  }

  selectPartId(id: string): void {
    cy.get(this.locators.partIdField).filter(':visible').contains(id).dblclick({ force: true }).wait(3000);
  }

  editStockingLevel(stockingLevelType: PartStoreroom): void {
    cy.get(this.locators.stockingLevelTypeSwitch).contains(stockingLevelType).click({ force: true });
    this.typeWithinField(this.locators.monthlyMinMaxQuantityInputField, this.constants.min, 0);
    this.typeWithinField(this.locators.monthlyMinMaxQuantityInputField, this.constants.max, 1);
    this.clickSectionButton(PartStoreroom.PART_STOCKING_LEVELS, this.commonLocators.mainSaveButton).wait(2000);
    cy.get(this.locators.stockingLevelConfirmationDialog).contains('OK').click({ force: true }).wait(5000);
  }
}
