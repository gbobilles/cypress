import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Personnel } from "cypress/support/enums/pers/personnel";
import { DetailCard } from "../../common/detailCard.page";

export class PersonnelDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    lastNameInputField: 'div[field=lastName] input',
    firstNameInputField: 'div[field=firstName] input',
    middleNameInputField: 'div[field=middleName] input',
    employeeNumberInputField: 'div[field=employeeNumber] input',
    siteDropdown: 'div[field=siteId] input',
    shiftDropdown: 'div[field=shiftId] input',
    laborRateDropdown: 'div[field=laborRateId] input',
    defaultLaborActivityDropdown: 'div[field=defaultLaborActivityId] input',
    supervisorDropdown: 'div[field=supervisorId] input',
    notesInputField: 'div[field=notes] textarea',
    emailAddressInputField: 'input[placeholder="Email Address"]',
    fundDropdown: 'div[field=fund] input',
    departmentDropdown: 'div[field=department] input',
    divisionDropdown: 'div[field=division] input',
    userLicenseDropdown: 'div[field=userLicense] input',
    accessibleSitesDropdown: 'div[field=accessibleSites] input',
    hasAccessToAllSitesInputSwitch: 'div[field=hasAccessToAllSites] span',
    securityGroupDropdown: 'input[placeholder="Security Group"]',
    expirationDate: 'input[placeholder="Expiration Date"]',
    securityGroupButtons: '.security-buttons >',
    securityGroupSubButtons: '.security-sub-buttons > button',
    assetDropdown: '[field=assetId] input',
    isTechnician: '[field=isTechnician] span',
    isDriver: '[field=isDriver] span',
    meterReadingInputField: '.add-meter-reading .input-number input',
    certificationTypeDropdown: '[field="certificationTypeId"] input',
    certificationCountryDropdown: '[field="regionId"] [placeholder="Country"]',
    certificationStateDropdown: '[field="regionId"] [placeholder="State/Province/Territory"]',
    issueDate: 'input[placeholder="Issue Date mm/dd/yyyy"]',
    addendumTypeDropdown: '[field="addendumTypeId"] input',
    certificationDropdown: '[field=certificationId] input',
    certificationCodeInputField: '[field="code"] input',
    certificationRestrictionDescriptionInputField: '[field="description"] input',
    workRequestDescription: '[field="description"] textarea',
    personCertificationDropdown: '[field="personId"] input',
    personCertificationTypeDropdown: '[field="certificationTypeId"] input',
    personCertificationCountryDropdown: '[placeholder="Country"]',
    personCertificationStateDropdown: '[placeholder="State/Province/Territory"]'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  createPersonnel(filename: string, lastName: string, firstName: string, middleName: string, employeeNumber: string, notes: string, siteIncluded:boolean = false): void {
    this.uploadFile(this.detailCardLocators.avatar, filename);
    this.typeWithinField(this.locators.lastNameInputField, lastName);
    this.typeWithinField(this.locators.firstNameInputField, firstName);
    this.typeWithinField(this.locators.middleNameInputField, middleName);
    this.typeWithinField(this.locators.employeeNumberInputField, employeeNumber);
    this.clickElement(this.locators.isTechnician);
    this.clickElement(this.locators.isDriver);
    if (!siteIncluded) {
    this.clickElement(this.locators.siteDropdown);
    this.selectFromDropdown(0);
    }
    this.clickElement(this.locators.shiftDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.defaultLaborActivityDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.supervisorDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.laborRateDropdown).wait(2000);
    this.selectFromDropdownByText('Standard');
    this.typeWithinField(this.locators.notesInputField, notes);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createGlSpecifications(): void {
    this.clickElement(this.locators.fundDropdown);
    this.getValueFromDropdown(0).as('fund');
    this.selectFromDropdown(0).wait(1000);
    this.clickElement(this.locators.departmentDropdown);
    this.getValueFromDropdown(0).as('department');
    this.selectFromDropdown(0).wait(1000);
    this.clickElement(this.locators.divisionDropdown);
    this.getValueFromDropdown(0).as('division');
    this.selectFromDropdown(0).wait(1000);
    this.clickSectionButton(Personnel.GL_SPECIFICATIONS, this.commonLocators.saveButton).wait(3000);
    cy.get('@fund').then((fund) => {
      this.clickElement(this.locators.fundDropdown);
      cy.get(this.locators.fundDropdown).should('have.attr', 'placeholder', fund.toString());
    });
    cy.get('@department').then((department) => {
      this.clickElement(this.locators.departmentDropdown);
      cy.get(this.locators.departmentDropdown).should('have.attr', 'placeholder', department.toString());
    });
    cy.get('@division').then((division) => {
      this.clickElement(this.locators.divisionDropdown);
      cy.get(this.locators.divisionDropdown).should('have.attr', 'placeholder', division.toString());
    }).wait(2000);
  }

  deleteGlSpecifications(): void {
    const defaultPlaceholder = 'GL Spec Value';
    this.clickElement(this.locators.fundDropdown);
    this.clickElement(this.commonLocators.dropdownCloseButton).wait(1000);
    this.clickElement(this.locators.departmentDropdown);
    this.clickElement(this.commonLocators.dropdownCloseButton).wait(1000);
    this.clickElement(this.locators.divisionDropdown);
    this.clickElement(this.commonLocators.dropdownCloseButton).wait(1000);
    this.clickSectionButton(Personnel.GL_SPECIFICATIONS, this.commonLocators.saveButton).wait(3000);
    cy.get(this.locators.fundDropdown).should('have.attr', 'placeholder', defaultPlaceholder);
    cy.get(this.locators.departmentDropdown).should('have.attr', 'placeholder', defaultPlaceholder);
    cy.get(this.locators.divisionDropdown).should('have.attr', 'placeholder', defaultPlaceholder);
  }

  createSecurityCredentials(emailAddress: string, securityGroup: string): void {
    this.typeWithinField(this.locators.emailAddressInputField, emailAddress);
    this.clickElement(this.locators.userLicenseDropdown);
    this.selectFromDropdown(0);
    cy.get(this.locators.hasAccessToAllSitesInputSwitch).contains('No').click();
    this.clickElement(this.locators.accessibleSitesDropdown).wait(2000);
    this.selectFromDropdown(1);
    this.selectFromDropdown(2);
    this.clickElement(this.locators.securityGroupButtons + this.commonLocators.saveButton).wait(2000);
    this.clickElement(this.locators.accessibleSitesDropdown).wait(2000);
    this.selectFromDropdown(2);
    this.clickElement(this.locators.securityGroupButtons + this.commonLocators.saveButton).wait(2000);
    cy.get(this.locators.hasAccessToAllSitesInputSwitch).contains('Yes').click();
    this.clickElement(this.locators.securityGroupButtons + this.commonLocators.saveButton).wait(2000);
    this.clickElement(this.locators.securityGroupSubButtons).wait(2000);
    this.clickElement(this.locators.securityGroupDropdown);
    this.selectFromDropdownByText(securityGroup);
    this.clickElement(this.locators.expirationDate);
    this.clickVisibleElement(this.commonLocators.mainSaveButton);
    this.clickElement(this.locators.securityGroupButtons + this.commonLocators.saveButton).wait(2000);
    cy.contains('td > div', securityGroup).should('be.visible');
    this.clickElement(this.commonLocators.deleteButton).wait(2000);
    this.clickVisibleElement(this.commonLocators.checkButton);
    this.clickElement(this.locators.securityGroupButtons + this.commonLocators.saveButton).wait(2000);
  }

  createDriverAssignment(meterReading: number): void {
    this.clickSectionButton(Personnel.DRIVER_ASSIGNMENTS, this.commonLocators.addButton);
    this.clickElement(this.locators.assetDropdown);
    this.selectFromDropdown(1);
    this.clickElement(this.locators.assetDropdown);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('value').wait(2000);
    this.typeWithinField(this.locators.meterReadingInputField, meterReading);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    cy.closeCardByTitle(Personnel.DRIVER_ASSIGNMENT);
    cy.get('@value').then((value) => {
      this.getDetailCardElements().sectionContainerElements(Personnel.DRIVER_ASSIGNMENTS, this.commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', value.toString());
    });
  }

  createCertificationViaCard(personName: string, certificationType: string): void {
    this.typeAndSelectFromDropdownByText(this.locators.personCertificationDropdown, personName);
    this.typeAndSelectFromDropdownByText(this.locators.personCertificationTypeDropdown, certificationType);
    this.selectFromDropdownByRandomValue(this.locators.personCertificationCountryDropdown);
    this.selectFromDropdownByRandomValue(this.locators.personCertificationStateDropdown).wait(2000);
    this.clickElement(this.locators.issueDate).wait(2000);
    this.clickVisibleElement(this.commonLocators.dateToday).wait(2000);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createCertification(): void {
    this.clickSectionButton(Personnel.CERTIFICATIONS, this.commonLocators.addButton);
    this.clickElement(this.locators.certificationTypeDropdown).wait(2000);
    this.selectFromDropdown(1);
    cy.get(this.locators.certificationTypeDropdown).invoke('val').as('certificationType');
    this.selectFromDropdownByRandomValue(this.locators.certificationCountryDropdown);
    this.selectFromDropdownByRandomValue(this.locators.certificationStateDropdown);
    this.clickElement(this.locators.issueDate).wait(2000);
    this.clickVisibleElement(this.commonLocators.dateToday).wait(2000);
    this.clickSectionButton(Personnel.CERTIFICATIONS, this.commonLocators.saveButton).wait(2000);
    cy.get('@certificationType').then((certificationType) => {
      this.getDetailCardElements().sectionContainerElements(Personnel.CERTIFICATIONS, this.commonLocators.table)
        .find('td')
        .should('contain.text', certificationType.toString());
    });
  }

  createEndorsementAndRestriction(code: string, description: string, hasCertification: boolean = false): void {
    this.clickSectionButton(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS, this.commonLocators.addButton);
    if (!hasCertification) {
      this.clickElement(this.locators.certificationDropdown);
      this.selectFromDropdown(0).wait(1000);
    }
    this.selectFromDropdownByRandomValue(this.locators.addendumTypeDropdown).wait(1000);
    this.typeWithinField(this.locators.certificationCodeInputField, code);
    this.typeWithinField(this.locators.certificationRestrictionDescriptionInputField, description);
    this.clickSectionButton(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS, this.locators.issueDate);
    this.clickVisibleElement(this.commonLocators.dateToday).wait(2000);
    this.clickSectionButton(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS, this.commonLocators.saveButton).wait(2000);
  }

  createWorkRequest(description: string): void {
    this.clickSectionButton(Personnel.REQUESTED_WORK, this.commonLocators.addButton);
    this.typeWithinField(this.locators.workRequestDescription, description);
    this.clickElement(this.locators.assetDropdown).wait(2000);
    this.selectFromDropdown(1);
    this.clickSectionButton(Personnel.REQUESTED_WORK, this.commonLocators.saveButton).wait(2000);
    this.getDetailCardElements().sectionContainerElements(Personnel.REQUESTED_WORK, this.commonLocators.table)
      .find('tr')
      .should('have.length.at.least', 1)
      .find('td')
      .should('contain.text', description);
  }

  setPersonnelStatus(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(Personnel.GENERAL, status);
    this.selectRecordDisposition(Personnel.GENERAL, disposition);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
    cy.closeCardByTitle(Personnel.PERSON);
  }
}
