import MathUtils from "cypress/support/utils/mathUtils";

export abstract class Card {

  protected commonConstants: { [key: string]: string } = {
    exportAlertMessage: '.pdf report has been opened in a new window',
    generalErrorMessage: 'An error has occurred in the application.',
    emailSuccessMessage: 'Report created successfully!',
    successMessage: 'Saved successfully'
  }

  protected commonLocators: { [key: string]: string } = {
    addButton: '.fa-plus',
    alertDialog: 'div[role=alert]',
    alertDialogCloseButton: '.Vue-Toastification__close-button',
    button: 'button',
    cancelButton: '.fa-ban',
    checkButton: '.fa-check',
    circleCheckButton: '.fa-check-circle',
    columnEllipsis: '.k-header-column-menu',
    columnIcon: '.k-i-columns',
    columnCheckboxUnchecked: 'label[aria-checked=false]',
    columnCheckboxChecked: 'label[aria-checked=true]',
    columnClearButton: 'button[title=Clear]',
    columnFilters: '.k-columnmenu-item-wrapper',
    columnFilterDropdown: 'span[title=Operator] > .k-dropdown-wrap > .k-input',
    columnFilterInputField: 'input[title=Value]',
    columnFilterIcon: '.k-i-filter',
    columnFilterButton: 'button[title=Filter]',
    columnMenuActions: '.k-columnmenu-actions',
    columnMenuItems: '.k-columnmenu-item-content',
    continueButton: '.fa-chevron-right',
    datePicker: 'div[type=date] input',
    dateToday: 'td.available.today',
    deleteButton: '.fa-trash',
    dialog: 'div[role=dialog]',
    dropdownCloseButton: '.el-icon-circle-close',
    em: 'em',
    expandedDropdown: '.el-select-dropdown[x-placement$="-start"]',
    exportButton: '.fa-download',
    exportCheckButton: '.fa-check',
    exportReportFormat: 'div[field=reportFormat] span',
    exportDeliveryMethod: 'div[field=deliveryMethod] span',
    exportReportEmailOptionsTab: 'div[id=tab-email]',
    exportReportEmailRecipientInputField: 'div[field=recipients] input',
    exportReportEmailSubjectInputField: 'div[field=subject] input',
    exportReportEmailBodyInputField: 'div[field=textBody] textarea',
    eyeButton: '.fa-eye',
    figure: 'figure',
    gridContent: '.k-grid-content',
    h2: 'h2',
    input: 'input',
    label: 'label',
    list: 'li',
    lockButton: '.fa-lock',
    saveButton: '.fa-floppy-o',
    mainSaveButton: '.fa-save',
    p: 'p',
    printButton: '.fa-print',
    selectDropdown: 'select[data-role=dropdownlist]',
    sortAscending: '.k-sort-asc',
    sortDescending: '.k-sort-desc',
    span: 'span',
    successMessage: '.Vue-Toastification__toast-body',
    successMessageCloseButton: '.Vue-Toastification__close-button',
    table: '.k-grid-content > table > tbody',
    tableColumn: 'td',
    tableHeaders: '.k-grid-header thead > tr',
    windowTitle: '.k-window-title',
    listScroller: '.k-list-scroller',
    gearIcon: '.fa-gear'
  }

  protected commonElements = {
    table: () => cy.get(this.commonLocators.table),
    tableRow: () => cy.get(this.commonLocators.table).get('tr'),
    windowTitle: () => cy.get(this.commonLocators.windowTitle).filter(':visible')
  }

  getCommonConstants(): { [key: string]: string } {
    return this.commonConstants;
  }

  getCommonLocators(): { [key: string]: string } {
    return this.commonLocators;
  }

  getCommonElements(): any {
    return this.commonElements;
  }

  clickElement(selector: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector).eq(index).scrollIntoView().click({ force: true });
  }

  clickElementBySelectorAndText(selector: string, value: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector).contains(value).click({ force: true });
  }

  clickVisibleElement(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector).filter(':visible').click({ force: true });
  }

  doubleClickRow(row: number, column: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.table).children().eq(row).get('td').eq(column).dblclick({ force: true });
  }

  doubleClickRecordByText(value: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.getCommonLocators().table).find('td').contains(value).dblclick({ force: true });
  }

  getTableColumnIndex(column: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('th[data-field=' + column + ']').invoke('attr', 'data-index');
  }

  getValueFromDropdown(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').eq(index).invoke('text');
  }

  getSelectedItemFromDropdown(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.expandedDropdown).find('li.selected');
  }

  isElementVisible(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then($body => {
      return $body.find(selector).is(':visible');
    });
  }

  isElementExisting(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then($body => {
      return $body.find(selector).length > 0;
    });
  }

  selectElement(items: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.selectDropdown).select(items, { force: true });
  }

  selectFromDropdown(index: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').eq(index).click({ force: true });
  }

  selectFromDropdownByText(value: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').find('span').contains(value).filter(':visible').eq(index).click({ force: true });
  }

  selectFromDropdownByRandomValue(selector: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    this.clickElement(selector, index).wait(1000);
    return cy.get(this.commonLocators.expandedDropdown).find('ul').find('li').its('length').then((index) => {
      return cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').eq(MathUtils.randomIntFromInterval(0, index - 1)).click({ force: true });
    });
  }

  selectRandomValueFromExpandedDropdown(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.expandedDropdown).find('ul').find('li').its('length').then((index) => {
      return cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').eq(MathUtils.randomIntFromInterval(0, index - 1)).click({ force: true });
    });
  }

  typeAndSelectFromDropdownByText(selector: string, value: string, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    this.typeWithinField(selector, value);
    return cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').find('span').contains(value).filter(':visible').eq(index).click({ force: true });
  }

  typeWithinField(selector: string, value: any, index: number = 0): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector).eq(index).wait(1000).clear({ force: true }).type(value, { force: true });
  }

  typeWithinVisibleField(selector: string, value: any): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(selector).filter(':visible').wait(1000).clear({ force: true }).type(value, { force: true });
  }

  verifyAlertMessage(message: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.commonLocators.alertDialog).should('be.visible').and('contain.text', message);
  }

  verifyCardByTitle(title: string): void {
    cy.wait(2000);
    this.commonElements.windowTitle().should('contain.text', title);
  }

  verifyDialogByTitle(title: string): void {
    cy.get(this.commonLocators.dialog).filter(':visible').should('be.visible').and('have.attr', 'aria-label', title);
  }
}
