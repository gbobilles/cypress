import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { VendorStore } from "cypress/support/enums/vend/vendorStore";
import { DetailCard } from "../../common/detailCard.page";

export class VendorStoreDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=name] input',
    vendorStoreIdInputField: 'div[field=vendorStoreIdentifier] input',
    vendorDropdown: 'div[field=vendorId] input',
    billingMethodDropdown: 'div[field=billingMethodId] input',
    notesInputField: 'div[field=notes] textarea',
    partDropdown: 'div[field=partId] input',
    siteDropdown: 'div[field=siteId] input',
    siteGlSpecificationsItems: '.gl-spec-items input'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createVendorStore(name: string, vendorStoreId: string, notes: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.vendorStoreIdInputField, vendorStoreId);
    this.selectFromDropdownByRandomValue(this.locators.vendorDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.billingMethodDropdown);
    this.typeWithinField(this.locators.notesInputField, notes);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createVendorStorePart(): void {
    this.clickSectionButton(VendorStore.PARTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partDropdown);
    this.clickVisibleElement(this.locators.partDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(VendorStore.PARTS, this.commonLocators.saveButton).wait(2000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(VendorStore.PARTS, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
        this.doubleClickRecordByText(value.toString()).wait(7000);
    });
    this.selectRecordStatus(VendorStore.PARTS, Status.INACTIVE);
    this.selectRecordDisposition(VendorStore.PARTS, Disposition.INACTIVE);
    this.clickSectionButton(VendorStore.PARTS, this.commonLocators.saveButton).wait(2000);
    this.getDetailCardElements().sectionContainerElements(VendorStore.PARTS, this.commonLocators.table)
      .find('tr')
      .should('have.length', 0);
    this.clickSectionButton(VendorStore.PARTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partDropdown);
    this.clickSectionButton(VendorStore.PARTS, this.commonLocators.saveButton).wait(2000);
    this.getDetailCardElements().sectionContainerElements(VendorStore.PARTS, this.commonLocators.table)
      .find('tr')
      .should('have.length', 1);
  }

  createVendorStoreSite(): void {
    this.clickSectionButton(VendorStore.SITES, this.commonLocators.addButton);
    this.selectDistinctSite();
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(VendorStore.SITES, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
    this.doubleClickSectionRow(VendorStore.SITES, 0, 0);
    this.selectDistinctSite();
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(VendorStore.SITES, this.commonLocators.table)
        .find('tr')
        .should('have.length', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }

  createVendorSiteGlSpecifications(): void {
    const values = [];
    cy.get(this.locators.siteGlSpecificationsItems).each(($item) => {
      cy.wrap($item).wait(1000).click({ force: true }).wait(2000);
      this.selectFromDropdown(0).wait(2000);
      cy.wrap($item).click({ force: true }).invoke('attr', 'placeholder').as('value');
      cy.get('@value').then((value) => {
        values.push(value.toString());
      });
      cy.wrap($item).click({ force: true }).wait(1000);
    });
    this.clickSectionButton(VendorStore.SITE_GL_SPECIFICATIONS, this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    cy.get(this.locators.siteGlSpecificationsItems).each(($item, index) => {
      cy.wrap($item).click({ force: true }).invoke('attr', 'placeholder').as('value');
      cy.get('@value').then((value) => {
        expect(value.toString()).to.eq(values[index]);
      });
      cy.wrap($item).click({ force: true }).wait(1000);
    });
  }

  selectDistinctSite(): void {
    this.selectFromDropdownByRandomValue(this.locators.siteDropdown);
    this.clickVisibleElement(this.locators.siteDropdown);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('value');
    this.clickSectionButton(VendorStore.SITES, this.commonLocators.saveButton).wait(2000);
    this.isElementVisible(this.commonLocators.alertDialog).then(visible => {
      if (visible) {
        this.selectDistinctSite();
      }
    });
  }

  setRecordToInactive(section: string): void {
    this.doubleClickSectionRow(section, 0, 0);
    this.selectRecordStatus(section, Status.INACTIVE);
    this.selectRecordDisposition(section, Disposition.INACTIVE);
    this.clickSectionButton(section, this.commonLocators.saveButton).wait(2000);
  }
}
