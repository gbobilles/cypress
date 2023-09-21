import { Disposition } from 'cypress/support/enums/common/statusDisposition/disposition';
import { Status } from 'cypress/support/enums/common/statusDisposition/status';
import { Part } from 'cypress/support/enums/inv/part';
import { DetailCard } from "../../common/detailCard.page";

export class PartDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    partTransferSuccessMessage: 'Transferred successfully'
  }

  private locators: { [key: string]: string } = {
    partIdInputField: 'div[field=manufacturerIdentifier] input',
    descriptionInputField: 'div[field=description] input',
    partTypeDropdown: 'div[field=partTypeId] input',
    supersedesDropdown: 'div[field=revisedPartId] input',
    coreOfDropdown: 'div[field=coreOfId] input',
    measureDropdown: 'div[field=measureId] input',
    manufacturerDropdown: 'div[field=manufacturerId] input',
    systemCodeDropdown: 'div[field=SystemCode] input',
    assemblyCodeDropdown: 'div[field=AssemblyCode] input',
    componentCodeDropdown: 'div[field=ComponentCode] input',
    notesTextArea: 'div[field=notes] textarea',
    equivalentPartDropdown: 'input[placeholder="Choose Equivalent Part"]',
    partStoreroomDropdown: 'div[field=partStoreId] input',
    glAccountDropdown: 'div[field=glAccountId] input',
    reasonDropdown: 'div[field=inventoryTransactionReasonId] input',
    quantityDropdown: 'div[field=quantity] input',
    fromPartStoreroomDropdown: 'div[field=transferFromPartStoreId] input',
    toPartStoreroomDropdown: 'div[field=transferToPartStoreId] input',
    partTransferButton: '.part-transfer-header button',
    partVendorStoreId: '[field="vendorStoreId"] input',
    partWarrantiesId: '[field="warrantyId"] input',
    partAssetId: 'div[field="assetId"] input',
    partTotalPrice: 'div[field="totalPrice"] input'
  }

  createPart(avatarFilename: string, partId: string, partType: string, description: string, notes: string): void {
    this.uploadFile(this.getDetailCardLocators().avatar, avatarFilename);
    this.typeWithinField(this.locators.partIdInputField, partId);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.clickElement(this.locators.partTypeDropdown);
    this.typeWithinField(this.locators.partTypeDropdown, partType).wait(1000);
    this.selectFromDropdownByText(partType);
    this.selectFromDropdownByRandomValue(this.locators.supersedesDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.coreOfDropdown).wait(3000);
    this.selectFromDropdownByRandomValue(this.locators.measureDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.manufacturerDropdown);
    this.typeWithinField(this.locators.notesTextArea, notes);
    this.clickElement(this.getCommonLocators().saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
    this.editPart();
  }

  editPart(): void {
    this.clickElement(this.locators.systemCodeDropdown);
    this.selectFromDropdown(1);
    this.clickElement(this.locators.assemblyCodeDropdown)
    this.selectFromDropdown(1);
    this.clickElement(this.locators.componentCodeDropdown)
    this.selectFromDropdown(1);
    this.clickElement(this.getCommonLocators().saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
  }

  createEquivalentPart(partIdColumn: string): void {
    this.clickSectionButton(Part.EQUIVALENT_PARTS, this.getCommonLocators().addButton);
    this.selectFromDropdownByRandomValue(this.locators.equivalentPartDropdown);
    this.clickVisibleElement(this.locators.equivalentPartDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(Part.EQUIVALENT_PARTS, this.getCommonLocators().saveButton);
    this.getSectionTableColumnIndex(Part.EQUIVALENT_PARTS, partIdColumn).then(index => {
      const indexAsNumber = Number(index);
      cy.get('@value').then((value) => {
        this.getDetailCardElements().sectionContainerElements(Part.EQUIVALENT_PARTS, this.commonLocators.table)
          .should('have.length', 1)
          .find('td')
          .eq(indexAsNumber)
          .should('contain.text', value.toString());
      });
    });
  }

  createPartInStoreroom(quantity: number, row: number): Cypress.Chainable<string> {
    this.clickSectionButton(Part.PART_IN_STOREROOMS, this.getCommonLocators().addButton).wait(3000);
    this.selectPartStoreroomAndGlAccount();
    this.selectFromDropdownByRandomValue(this.locators.reasonDropdown).wait(2000);
    this.clickVisibleElement(this.locators.partStoreroomDropdown).wait(3000);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(Part.PART_IN_STOREROOMS, this.getCommonLocators().saveButton);
    this.doubleClickSectionRow(Part.PART_IN_STOREROOMS, row, 0);
    this.selectFromDropdownByRandomValue(this.locators.glAccountDropdown).wait(4000);
    this.selectFromDropdownByRandomValue(this.locators.reasonDropdown);
    this.typeWithinField(this.locators.quantityDropdown, quantity);
    this.clickSectionButton(Part.PART_IN_STOREROOMS, this.getCommonLocators().saveButton);
    return cy.get('@value').then((value) => {
      return value.toString();
    });
  }

  selectPartStoreroomAndGlAccount(): void {
    this.getDetailCardElements().sectionContainerElements(Part.ADD_NEW_PART_TO_STOREROOM, this.locators.partStoreroomDropdown).click({ force: true }).wait(2000);
    this.selectRandomValueFromExpandedDropdown();
    this.clickVisibleElement(this.locators.partStoreroomDropdown).wait(3000);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value').wait(2000);
    this.clickVisibleElement(this.locators.partStoreroomDropdown).wait(2000);
    this.clickVisibleElement(this.locators.glAccountDropdown).wait(2000);
    this.isElementVisible(this.commonLocators.expandedDropdown).then($visible => {
      if ($visible) {
        this.selectRandomValueFromExpandedDropdown();
        return;
      }

      this.selectPartStoreroomAndGlAccount();
    });
  }

  transferPart(notes: string): void {
    this.selectFromDropdownByRandomValue(this.locators.fromPartStoreroomDropdown);
    this.selectFromDropdownByRandomValue(this.locators.toPartStoreroomDropdown);
    this.typeWithinField(this.locators.notesTextArea, notes);
    this.clickElement(this.locators.partTransferButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.constants.partTransferSuccessMessage).should('be.visible');
  }

  createPartVendorStore(): void {
    this.clickSectionButton(Part.VENDOR_STORES, this.getCommonLocators().addButton);
    this.selectFromDropdownByRandomValue(this.locators.partVendorStoreId);
    this.clickVisibleElement(this.locators.partVendorStoreId).wait(2000);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(Part.VENDOR_STORES, this.getCommonLocators().saveButton).wait(2000);
    this.getSectionTableColumnIndex(Part.VENDOR_STORES, 'vendorStore_name').then(index => {
      const indexAsNumber = Number(index);
      cy.get('@value').then((value) => {
        this.getDetailCardElements().sectionContainerElements(Part.VENDOR_STORES, this.commonLocators.table)
          .should('have.length', 1)
          .find('td')
          .eq(indexAsNumber)
          .should('contain.text', value.toString());
      });
    });
  }

  createPartWarranties(): void {
    this.clickSectionButton(Part.WARRANTIES, this.getCommonLocators().addButton);
    this.selectFromDropdownByRandomValue(this.locators.partWarrantiesId);
    this.clickVisibleElement(this.locators.partWarrantiesId).wait(2000);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(Part.WARRANTIES, this.getCommonLocators().saveButton).wait(2000);
    this.getSectionTableColumnIndex(Part.WARRANTIES, 'warranty_name').then(index => {
      const indexAsNumber = Number(index);
      cy.get('@value').then((value) => {
        this.getDetailCardElements().sectionContainerElements(Part.WARRANTIES, this.commonLocators.table)
          .should('have.length', 1)
          .find('td')
          .eq(indexAsNumber)
          .should('contain.text', value.toString());
      });
    });
  }

  createPartAsset(): void {
    this.clickSectionButton(Part.ASSETS, this.getCommonLocators().addButton);
    this.selectFromDropdownByRandomValue(this.locators.partAssetId);
    this.clickVisibleElement(this.locators.partAssetId).wait(2000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('value');
    this.clickSectionButton(Part.ASSETS, this.getCommonLocators().saveButton).wait(2000);
    this.getSectionTableColumnIndex(Part.ASSETS, 'asset_primaryAssetIdentifier').then(index => {
      const indexAsNumber = Number(index);
      cy.get('@value').then((value) => {
        this.getDetailCardElements().sectionContainerElements(Part.ASSETS, this.commonLocators.table)
          .should('have.length', 1)
          .find('td')
          .eq(indexAsNumber)
          .should('contain.text', value.toString());
      });
    });
  }

  createPartSystemAssemblyComponentAllowedUsage(): void {
    this.clickSectionButton(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.getCommonLocators().addButton).wait(3000);
    this.clickSectionButton(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.locators.systemCodeDropdown);
    this.selectFromDropdown(0).wait(2000);
    this.clickSectionButton(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.locators.assemblyCodeDropdown);
    this.selectFromDropdown(0).wait(2000);
    this.clickSectionButton(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.locators.componentCodeDropdown);
    this.selectFromDropdown(0).wait(2000);
    this.clickElement(this.locators.systemCodeDropdown, 1).wait(2000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('systemCode');
    this.clickElement(this.locators.assemblyCodeDropdown, 1).wait(2000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('assemblyCode');
    this.clickElement(this.locators.componentCodeDropdown, 1).wait(2000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('componentCode');
    this.clickSectionButton(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.getCommonLocators().saveButton).wait(2000);
    cy.get('@systemCode').then((systemCode) => {
      this.getDetailCardElements().sectionContainerElements(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', systemCode.toString());
    });
    cy.get('@assemblyCode').then((assemblyCode) => {
      this.getDetailCardElements().sectionContainerElements(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', assemblyCode.toString());
    });
    cy.get('@componentCode').then((componentCode) => {
      this.getDetailCardElements().sectionContainerElements(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', componentCode.toString());
    });
  }

  setPartStatus(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(Part.GENERAL, status);
    this.selectRecordDisposition(Part.GENERAL, disposition);
    this.clickElement(this.getCommonLocators().saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
    cy.closeCardByTitle(Part.PART);
  }
}
