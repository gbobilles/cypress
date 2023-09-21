import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { DeliveryMethod } from 'cypress/support/enums/common/exportReports/deliveryMethod';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Card } from "./card.page";

export abstract class DetailCard extends Card {

  protected detailCardConstants: { [key: string]: string } = {
    barcodePrintLabel: 'Print Label',
    barcodePrintToBarcodePrinter: 'Print to barcode printer',
    barcodePrintToSheet: 'Print to sheet',
    barcodeProcessingPrintJob: 'Processing print job',
    barcodeLabelTemplate: 'Label template',
    barcodeRowLabel: 'Row (1-10)',
    barcodeColumnLabel: 'Col (1-2)',
    barcodeAveryLabel: 'Avery Label 5161',
    barcodePrintBarcode: 'Print Barcode',
    printAndExport: 'Print & Export'
  }

  protected detailCardLocators: { [key: string]: string } = {
    avatar: '.avatar-uploader input[type=file]',
    barcodePreview: '.barcode-preview',
    barcodePrintLabel: '[aria-label="Print label"]',
    barcodePrintLabelButton: '[aria-label="Print label"] button',
    barcodePrintToSheetDialogHeader: '[aria-label=dialog] h1',
    barcodePrintSheetOptionsLabel: '.print-barcode-sheet-options label',
    barcodeLabelTemplateDropdown: 'input[placeholder="Label template"]',
    caretButton: '.details-actions button .el-icon-arrow-down',
    contactInfoAddButton: '.contact-info-add .fa-plus',
    contactInfoTitle: '.contact-info-title',
    documentDialogButton: '.el-message-box button',
    documentFileName: '.documents .file-name',
    documentImageThumbnail: '.documents .fa-file-image-o',
    documentInput: '.upload input[type=file]',
    documentsList: '.documents',
    documentPreview: '.fslightbox-container',
    documentPreviewCloseButton: '.fslightbox-container div[title=',
    fileName: '.file-name',
    fileIcon: '.file-icon',
    fileDeleteIcon: '.delete-icon',
    sectionContainer: 'section > h1',
    sectionHeader: '.details-header > ul > li',
    phoneNumberNameInputField: '.phone-line input[placeholder=Name]',
    emailAddressNameInputField: '.email-line input[placeholder=Name]',
    addressNameInputField: '.address-line input[placeholder=Name]',
    phoneNumberInputField: 'input[placeholder="Phone Number"]',
    phoneNumberName: '.phone-number-name',
    phoneNumberValue: '.phone-number-value > a',
    phoneNumberEditButton: '.phone-number-edit-button > button',
    emailAddressInputField: 'input[placeholder="Email Address"]',
    emailAddressName: '.email-address-name',
    emailAddressValue: '.email-address-value > a',
    emailAddressEditButton: '.email-address-edit-button > button',
    firstAddressInputField: 'input[placeholder="Address 1"]',
    secondAddressInputField: 'input[placeholder="Address 2"]',
    cityInputField: 'input[placeholder=City]',
    countryDropdown: 'input[placeholder=Country]',
    stateProvinceTerritoryDropdown: 'input[placeholder="State/Province/Territory"]',
    postalCodeInputField: 'input[placeholder="Postal Code"]',
    addressName: '.street-address-name',
    addressEditButton: '.street-address-edit-button > button',
    contactInfoDeleteButton: '.fa-trash-o',
    statusDisposition: '[schema-path="vendor-store"] .k-master-row [role="gridcell"]',
    statusDispositionDropdown: 'div[field=dispositionId] input',
  }

  protected detailCardElements = {
    barcodeLabel: (barcodeName: string) => cy.get(this.commonLocators.label).contains(barcodeName),
    barcodeArea: (barcodeName: string) => cy.get(this.commonLocators.label).contains(barcodeName).parent().next('div'),
    contactInfoAddButton: (contactInfoTitle: string) => cy.get(this.detailCardLocators.contactInfoTitle).contains(contactInfoTitle).find(this.detailCardLocators.contactInfoAddButton),
    documentDialogButton: (button: string) => cy.get(this.detailCardLocators.documentDialogButton).contains(button),
    documentFileName: () => cy.get(this.detailCardLocators.documentFileName),
    documentImageThumbnail: () => cy.get(this.detailCardLocators.documentImageThumbnail),
    documentInput: () => cy.get(this.detailCardLocators.documentInput),
    documentsList: () => cy.get(this.detailCardLocators.documentsList),
    documentPreview: () => cy.get(this.detailCardLocators.documentPreview),
    documentPreviewButton: (button: string) => cy.get(this.detailCardLocators.documentPreviewCloseButton + button + ']'),
    lastUploadedDocument: () => cy.get(this.detailCardLocators.documentsList).children().last(),
    sectionContainer: (sectionTitle: string) => cy.get(this.detailCardLocators.sectionContainer).contains(sectionTitle),
    sectionContainerElements: (sectionTitle: string, element: string) => this.detailCardElements.sectionContainer(sectionTitle).parent().find(element)
  }

  getDetailCardConstants(): { [key: string]: string } {
    return this.detailCardConstants;
  }

  getDetailCardLocators(): { [key: string]: string } {
    return this.detailCardLocators;
  }

  getDetailCardElements(): any {
    return this.detailCardElements;
  }

  clickColumnEllipsis(section: string, column: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainerElements(section, 'th[data-field=' + column + ']')
      .find(this.commonLocators.columnEllipsis)
      .click();
  }

  clickSectionButton(section: string, button: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainerElements(section, button).eq(index).scrollIntoView().click({ force: true });
  }

  doubleClickSectionRow(section: string, row: number, column: number): void {
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .children()
      .eq(row).find('td').eq(column)
      .dblclick({ force: true });
  }

  doubleClickSectionRowByText(section: string, value: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .children()
      .find('td').contains(value)
      .dblclick({ force: true });
  }

  exportSectionReport(section: string, reportFormat: ReportFormat, index: number = 0): void {
    this.clickSectionButton(section, this.commonLocators.exportButton, index);
    cy.get(this.commonLocators.exportReportFormat).contains(reportFormat).click();
  }

  exportMainReport(reportFormat: ReportFormat): void {
    this.clickElement(this.detailCardLocators.caretButton);
    cy.get('span').contains(this.detailCardConstants.printAndExport).click({ force: true });
    cy.get(this.commonLocators.exportReportFormat).contains(reportFormat).click();
  }

  exportSectionReportViaPrint(section: string, reportFormat: ReportFormat, index: number = 0, printWaitTime: number = 5000): void {
    this.exportSectionReport(section, reportFormat, index);
    this.exportReportsViaPrint(reportFormat, printWaitTime);
  }

  exportSectionReportViaEmail(section: string, reportFormat: ReportFormat, email: string, subject: string, body: string, index: number = 0, emailWaitTime: number = 5000): void {
    this.exportSectionReport(section, reportFormat, index);
    this.exportReportsViaEmail(email, subject, body, emailWaitTime);
  }

  exportMainReportViaPrint(reportFormat: ReportFormat, printWaitTime: number = 5000): void {
    this.exportMainReport(reportFormat);
    this.exportReportsViaPrint(reportFormat, printWaitTime);
  }

  exportMainReportViaEmail(reportFormat: ReportFormat, email: string, subject: string, body: string, emailWaitTime: number = 5000): void {
    this.exportMainReport(reportFormat);
    this.exportReportsViaEmail(email, subject, body, emailWaitTime);
  }

  getSectionTableColumnIndex(sectionTitle: string, column: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getDetailCardElements().sectionContainerElements(sectionTitle, 'th[data-field=' + column + ']').invoke('attr', 'data-index');
  }

  goToSection(sectionTitle: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.detailCardLocators.sectionHeader).contains(sectionTitle).wait(2000).click({ force: true });
  }

  sortColumn(section: string, column: string, selector: string, sortOrder: SortOrder): void {
    this.clickColumnEllipsis(section, column).wait(3000);
    this.clickElement(selector).wait(3000);
    this.getTableColumnIndex(column).then(index => {
      this.verifyColumnSorting(section, Number(index), sortOrder);
    });
    cy.wait(3000);
  }

  uploadFile(selector: string, filename: string): Cypress.Chainable<JQuery<HTMLElement>> {
    cy.fixture(filename, null).as('file');
    return cy.get(selector).selectFile('@file', { force: true });
  }

  validateUploadedFile(filenameRegex: RegExp): void {
    this.getDetailCardElements().documentsList().should('have.length.at.least', 1);
    this.getDetailCardElements().lastUploadedDocument().find(this.detailCardLocators.fileName).scrollIntoView().invoke('text').should('match', filenameRegex);
    this.getDetailCardElements().lastUploadedDocument().find(this.detailCardLocators.fileIcon).scrollIntoView().should('be.visible');
    this.getDetailCardElements().lastUploadedDocument().click();
    this.getDetailCardElements().documentPreview().should('be.visible');
    this.getDetailCardElements().documentPreviewButton('Close').click();
  }

  deleteUploadedFile(): void {
    this.getDetailCardElements().lastUploadedDocument().find(this.detailCardLocators.fileDeleteIcon).click({ force: true });
    this.getDetailCardElements().documentDialogButton('OK').click();
  }

  createContactInfoPhoneNumber(name: string, phoneNumber: string): void {
    this.getDetailCardElements().contactInfoAddButton('Phone Numbers').click({ force: true });
    this.typeWithinVisibleField(this.detailCardLocators.phoneNumberNameInputField, name);
    this.typeWithinVisibleField(this.detailCardLocators.phoneNumberInputField, phoneNumber);
    this.clickVisibleElement(this.commonLocators.mainSaveButton).wait(3000);
    cy.get(this.detailCardLocators.phoneNumberName).should('contain.text', name);
    cy.get(this.detailCardLocators.phoneNumberValue).should('have.text', phoneNumber).and('have.attr', 'href', 'tel://' + phoneNumber);
  }

  createContactInfoEmailAddress(name: string, emailAddress: string): void {
    this.getDetailCardElements().contactInfoAddButton('Email Addresses').click({ force: true }).wait(2000);
    this.typeWithinVisibleField(this.detailCardLocators.emailAddressNameInputField, name);
    this.typeWithinVisibleField(this.detailCardLocators.emailAddressInputField, emailAddress);
    this.clickVisibleElement(this.commonLocators.mainSaveButton).wait(3000);
    cy.get(this.detailCardLocators.emailAddressName).should('contain.text', name);
    cy.get(this.detailCardLocators.emailAddressValue).should('have.text', emailAddress).and('have.attr', 'href', 'mailto://' + emailAddress);
  }

  createContactInfoAddress(name: string, firstAddress: string, secondAddress: string, city: string, postalCode: number): void {
    cy.get(this.detailCardLocators.contactInfoTitle).find(this.commonLocators.addButton).last().click({ force: true });
    this.typeWithinVisibleField(this.detailCardLocators.addressNameInputField, name);
    this.typeWithinVisibleField(this.detailCardLocators.firstAddressInputField, firstAddress);
    this.typeWithinVisibleField(this.detailCardLocators.secondAddressInputField, secondAddress);
    this.typeWithinVisibleField(this.detailCardLocators.cityInputField, city);
    this.selectFromDropdownByRandomValue(this.detailCardLocators.countryDropdown).wait(2000);
    this.selectFromDropdownByRandomValue(this.detailCardLocators.stateProvinceTerritoryDropdown);
    this.typeWithinVisibleField(this.detailCardLocators.postalCodeInputField, postalCode);
    this.clickVisibleElement(this.commonLocators.mainSaveButton).wait(2000);
    cy.get(this.detailCardLocators.addressName).should('contain.text', name);
  }

  editContactInfoEmailAddress(name: string, emailAddress: string): void {
    this.clickElement(this.detailCardLocators.emailAddressEditButton);
    this.typeWithinField(this.detailCardLocators.emailAddressNameInputField, name);
    this.typeWithinField(this.detailCardLocators.emailAddressInputField, emailAddress);
    this.clickVisibleElement(this.commonLocators.mainSaveButton);
    cy.get(this.detailCardLocators.emailAddressName).should('contain.text', name);
    cy.get(this.detailCardLocators.emailAddressValue).should('have.text', emailAddress).and('have.attr', 'href', 'mailto://' + emailAddress);
  }

  deleteContactInfoPhoneNumber(): void {
    this.clickElement(this.detailCardLocators.phoneNumberEditButton);
    this.clickVisibleElement(this.detailCardLocators.contactInfoDeleteButton);
  }

  deleteContactInfoEmailAddress(): void {
    this.clickElement(this.detailCardLocators.emailAddressEditButton);
    this.clickVisibleElement(this.detailCardLocators.contactInfoDeleteButton);
  }

  deleteContactInfoAddress(): void {
    this.clickElement(this.detailCardLocators.addressEditButton);
    this.clickVisibleElement(this.detailCardLocators.contactInfoDeleteButton);
  }

  createBarcode(barcodeName: string, barcodeValue: string): void {
    this.typeWithinField('input[placeholder="' + barcodeName + '"]', barcodeValue).type('{enter}');
    this.detailCardElements.barcodeArea(barcodeName).find(this.commonLocators.figure).should('be.visible');
    this.detailCardElements.barcodeArea(barcodeName).find(this.commonLocators.printButton).should('be.visible');
    this.detailCardElements.barcodeArea(barcodeName).find(this.commonLocators.figure + ' ' + this.commonLocators.eyeButton).invoke('show').click({ force: true });
    cy.get(this.detailCardLocators.barcodePreview).should('be.visible');
    cy.get(this.detailCardLocators.barcodePreview + ' button').contains('OK').click();
    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.commonLocators.successMessage).contains(this.commonConstants.successMessage).should('be.visible');
    this.clickElement(this.commonLocators.successMessageCloseButton);
    this.detailCardElements.barcodeArea(barcodeName).find(this.commonLocators.printButton).click();
    cy.get(this.detailCardLocators.barcodePrintLabel).should('be.visible');
    cy.get(this.detailCardLocators.barcodePrintLabelButton).contains(this.detailCardConstants.barcodePrintToBarcodePrinter).should('be.visible');
    cy.get(this.detailCardLocators.barcodePrintLabelButton).contains(this.detailCardConstants.barcodePrintToSheet).should('be.visible');
    cy.get(this.detailCardLocators.barcodePrintLabelButton).contains(this.detailCardConstants.barcodePrintToBarcodePrinter).click();
    cy.get(this.commonLocators.alertDialog).should('contain.text', this.detailCardConstants.barcodeProcessingPrintJob);
    this.detailCardElements.barcodeArea(barcodeName).find(this.commonLocators.printButton).click();
    cy.get(this.detailCardLocators.barcodePrintLabelButton).contains(this.detailCardConstants.barcodePrintToSheet).click();
    cy.get(this.detailCardLocators.barcodePrintToSheetDialogHeader).contains(this.detailCardConstants.barcodePrintBarcode).should('be.visible');
    cy.get(this.detailCardLocators.barcodePrintSheetOptionsLabel).contains(this.detailCardConstants.barcodeLabelTemplate).should('be.visible');
    this.clickElement(this.detailCardLocators.barcodeLabelTemplateDropdown).should('have.attr', 'placeholder', this.detailCardConstants.barcodeAveryLabel);
    cy.get(this.detailCardLocators.barcodePrintSheetOptionsLabel).contains(this.detailCardConstants.barcodeRowLabel).should('be.visible');
    cy.get(this.detailCardLocators.barcodePrintSheetOptionsLabel).contains(this.detailCardConstants.barcodeRowLabel).parent().next().find('input').should('have.attr', 'aria-valuenow', '1');
    cy.get(this.detailCardLocators.barcodePrintSheetOptionsLabel).contains(this.detailCardConstants.barcodeColumnLabel).should('be.visible');
    cy.get(this.detailCardLocators.barcodePrintSheetOptionsLabel).contains(this.detailCardConstants.barcodeColumnLabel).parent().next().find('input').should('have.attr', 'aria-valuenow', '1');
    this.clickVisibleElement(this.commonLocators.checkButton);
    cy.get(this.commonLocators.alertDialog).should('contain.text', this.detailCardConstants.barcodeProcessingPrintJob);
  }

  selectRecordStatus(section: string, status: Status, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    this.detailCardElements.sectionContainer(section).parent().find(this.detailCardLocators.statusDispositionDropdown).eq(index).wait(1000).click({ force: true });
    return this.selectFromDropdownByText(status);
  }

  selectRecordDisposition(section: string, disposition: Disposition, index: number = 1): Cypress.Chainable<JQuery<HTMLElement>> {
    this.detailCardElements.sectionContainer(section).parent().find(this.detailCardLocators.statusDispositionDropdown).eq(index).wait(1000).click({ force: true });
    return this.selectFromDropdownByText(disposition);
  }

  getTextRecordStatus(section: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainer(section).parent().find(this.detailCardLocators.statusDispositionDropdown).eq(index).invoke('val');
  }

  getTextRecordDisposition(section: string, index: number = 1): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainer(section).parent().find(this.detailCardLocators.statusDispositionDropdown).eq(index).invoke('val');
  }

  getCardTextField(section: string, element: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.detailCardElements.sectionContainer(section).parent().find(element).eq(index);
  }

  verifyColumnSorting(section: string, column: number, sortOrder: SortOrder): void {
    const values = [];
    let counter = 0;
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table).children().each(($element, index, $list) => {
      cy.wrap($element).find('td').eq(column).then(($td) => {
        values.push($td.text());
        if (++counter === $list.length) {
          const sortedValues = values.sort();
          switch (sortOrder) {
            case SortOrder.SORT_ASCENDING:
              expect(values).to.deep.eq(sortedValues);
              break;
            case SortOrder.SORT_DESCENDING:
              expect(values).to.deep.eq(sortedValues.reverse());
              break;
            default:
          }
        }
      });
    });
  }

  private exportReportsViaPrint(reportFormat: ReportFormat, printWaitTime: number = 5000): void {
    this.clickVisibleElement(this.commonLocators.exportCheckButton).wait(printWaitTime);
    if (reportFormat === ReportFormat.PDF) {
      this.verifyAlertMessage(this.commonConstants.exportAlertMessage);
      cy.get(this.commonLocators.alertDialog).should('be.visible').and('not.contain.text', this.commonConstants.generalErrorMessage);
      this.clickVisibleElement(this.commonLocators.alertDialogCloseButton);
    }
  }

  private exportReportsViaEmail(email: string, subject: string, body: string, emailWaitTime: number = 5000): void {
    cy.get(this.commonLocators.exportDeliveryMethod).contains(DeliveryMethod.EMAIL).click({ force: true });
    this.clickElement(this.commonLocators.exportReportEmailOptionsTab);
    this.typeWithinField(this.commonLocators.exportReportEmailRecipientInputField, email);
    this.typeWithinField(this.commonLocators.exportReportEmailSubjectInputField, subject);
    this.typeWithinField(this.commonLocators.exportReportEmailBodyInputField, body);
    this.clickElement(this.commonLocators.exportReportEmailOptionsTab);
    this.clickVisibleElement(this.commonLocators.exportCheckButton).wait(emailWaitTime);
    this.verifyAlertMessage(this.commonConstants.emailSuccessMessage);
    this.clickVisibleElement(this.commonLocators.alertDialogCloseButton);
  }
}
