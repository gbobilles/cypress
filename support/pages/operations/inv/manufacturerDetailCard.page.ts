import { DetailCard } from "../../common/detailCard.page";

export class ManufacturerDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    nameInputField: 'div[field=name] input',
    idInputField: 'div[field=manufacturerIdentifier] input',
    descriptionInputField: 'div[field=description] input',
    notesTextArea: 'div[field=notes] textarea',
    measureDropdown: 'div[field=measureId] input',
  }

  createManufacturer(name: string, id: string): void {
    this.typeWithinField(this.locators.nameInputField, name);
    this.typeWithinField(this.locators.idInputField, id);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  manufacturerPartCreation(avatarFilename: string, description: string, notes: string): void {
    this.uploadFile(this.getDetailCardLocators().avatar, avatarFilename);
    this.typeWithinField(this.locators.descriptionInputField, description);
    this.selectFromDropdownByRandomValue(this.locators.measureDropdown).wait(1000);
    this.typeWithinField(this.locators.notesTextArea, notes);
    this.clickElement(this.getCommonLocators().saveButton);
    cy.get(this.getCommonLocators().successMessage).contains(this.getCommonConstants().successMessage).should('be.visible');
    this.clickElement(this.getCommonLocators().successMessageCloseButton);
  }
}
