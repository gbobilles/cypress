import { OrganizationalUnit } from "cypress/support/enums/admin/organizationalUnit";
import { DetailCard } from "../common/detailCard.page";

export class OrganizationalUnitDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=organizationalUnitName] input',
    glSegmentDelimiterInputField: 'div[field=glCodeDelimiter] input',
    glCoreAccountSegmentLengthInputField: 'div[field=glAccountLength] input',
    glWildcardCharacterDropdown: 'div[field=glWildcardCharacter] input',
    firstDayOfTheWeekInputSwitch: 'div[field="Dossier.Accounting.FirstDayOfWeek"] label > span',
    glAccountTab: 'div[role=tab]',
    glSegmentDefinition: '.account-item.gl-specs-line',
    glCoreAccountIdInputField: 'div[field=glAccountValue] input',
    glCoreAccountNameInputField: 'div[field=glAccountName] input',
    maintenanceCodeContainer: '.vmrs-code-config',
    siteNameInputField: 'div[field=name] input',
    accountingAuthorityGroupNameInputField: 'div[field=accountAuthorityGroupName] input',
    parentAccountingAuthorityDropdown: 'div[field=parentAccountingAuthorityId] input',
    dailyLimitInputField: 'div[field=dailyLimitAmount] input',
    monthlyLimitInputField: 'div[field=monthlyLimitAmount] input',
    purchaseOrderLimitInputField: 'div[field=purchaseOrderLimitAmount] input',
    internalWorkLimitInputField: 'div[field=internalWorkLimitAmount] input',
    blanketPurchaseOrderLimitInputField: 'div[field=blanketPurchaseOrderLimitAmount] input',
    personDropdown: 'div[field=personId] input'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  goToGlAccountTab(tabName: string): void {
    cy.get(this.locators.glAccountTab).contains(tabName).click({ force: true }).wait(1000);
  }

  createOrganizationalUnit(name: string, glSegmentDelimiter: string, glCoreAccountSegmentLength: number): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.glSegmentDelimiterInputField, glSegmentDelimiter);
    this.typeWithinField(this.locators.glCoreAccountSegmentLengthInputField, glCoreAccountSegmentLength);
    this.selectFromDropdownByRandomValue(this.locators.glWildcardCharacterDropdown);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createSetting(dayOfTheWeek: string): void {
    cy.get(this.locators.firstDayOfTheWeekInputSwitch).contains(dayOfTheWeek).click({ force: true });
  }

  createGlSegmentDefinition(segmentName: string, description: string, length: number): void {
    cy.get(this.locators.glSegmentDefinition).eq(1).find(this.commonLocators.input).first().type(segmentName);
    cy.get(this.locators.glSegmentDefinition).eq(1).find(this.commonLocators.input).eq(1).type(description);
    cy.get(this.locators.glSegmentDefinition).eq(1).find(this.commonLocators.input).eq(2).clear({ force: true }).type(length.toString(), { force: true });
    this.goToGlAccountTab(OrganizationalUnit.GL_SEGMENT_DEFINITION);
    this.clickSectionButton(OrganizationalUnit.GL_ACCOUNT, this.commonLocators.mainSaveButton).wait(2000);
  }

  createGlCoreAccount(accountId: string, accountName: string): void {
    this.typeWithinField(this.locators.glCoreAccountIdInputField, accountId);
    this.typeWithinField(this.locators.glCoreAccountNameInputField, accountName);
    this.goToGlAccountTab(OrganizationalUnit.GL_CORE_ACCOUNTS);
    this.clickSectionButton(OrganizationalUnit.GL_ACCOUNT, this.commonLocators.saveButton).wait(2000);
    this.getDetailCardElements().sectionContainerElements(OrganizationalUnit.GL_ACCOUNT, this.commonLocators.table)
      .find('tr')
      .should('have.length.at.least', 1)
      .find('td')
      .should('contain.text', accountId);
  }

  createSite(siteName: string): void {
    this.clickSectionButton(OrganizationalUnit.SITES, this.commonLocators.addButton).wait(3000);
    this.typeWithinField(this.locators.siteNameInputField, siteName);
    this.goToSection(OrganizationalUnit.GENERAL);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createTableOfAuthority(accountingAuthorityGroupName: string, dailyLimit: number, monthlyLimit: number, purchaseOrderLimit: number, internalWorkLimit: number, blanketPurchaseOrderLimit: number): void {
    this.clickSectionButton(OrganizationalUnit.TABLE_OF_AUTHORITY, this.commonLocators.addButton).wait(2000);
    this.typeWithinField(this.locators.accountingAuthorityGroupNameInputField, accountingAuthorityGroupName);
    this.selectFromDropdownByRandomValue(this.locators.parentAccountingAuthorityDropdown);
    this.typeWithinField(this.locators.dailyLimitInputField, dailyLimit);
    this.typeWithinField(this.locators.monthlyLimitInputField, monthlyLimit);
    this.typeWithinField(this.locators.purchaseOrderLimitInputField, purchaseOrderLimit);
    this.typeWithinField(this.locators.internalWorkLimitInputField, internalWorkLimit);
    this.typeWithinField(this.locators.blanketPurchaseOrderLimitInputField, blanketPurchaseOrderLimit);
    this.clickElement(this.commonLocators.saveButton).wait(2000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton).wait(2000);
  }

  createAccountingAuthorityMember(): void {
    this.clickSectionButton(OrganizationalUnit.ACCOUNTING_AUTHORITY_MEMBERS, this.commonLocators.addButton).wait(2000);
    this.selectFromDropdownByRandomValue(this.locators.personDropdown);
    this.clickVisibleElement(this.locators.personDropdown);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('value');
    this.clickSectionButton(OrganizationalUnit.ACCOUNTING_AUTHORITY_MEMBERS, this.commonLocators.saveButton).wait(2000);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(OrganizationalUnit.ACCOUNTING_AUTHORITY_MEMBERS, this.commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }
}
