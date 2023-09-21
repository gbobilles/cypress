import { ColumnFilterOption } from "cypress/support/enums/common/columnFilters/columnFilterOption";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { DeliveryMethod } from 'cypress/support/enums/common/exportReports/deliveryMethod';
import { ReportFormat } from 'cypress/support/enums/common/exportReports/reportFormat';
import MathUtils from "cypress/support/utils/mathUtils";
import { Card } from "./card.page";

export class ListCard extends Card {

  protected listCardConstants: { [key: string]: string } = {
    noItemsToDisplay: 'No items to display'
  }

  protected listCardLocators: { [key: string]: string } = {
    addButton: '.left-menu-items > .el-button-group > button .fa-plus',
    continueButton: 'button.fa-chevron-right',
    dropColumnTarget: 'div[data-role=droptarget]',
    groupIndicator: '.k-group-indicator',
    groupingRow: '.k-grouping-row',
    masterRow: '.k-master-row',
    instantInsightsWindow: '.content-summary',
    instantInsightsWindowCloseButton: '.content-summary-close',
    pageInfo: '.k-pager-info.k-label',
    pagination: '.k-pager-numbers a[data-page=',
    sortableTableHeaders: 'th[data-role=columnsorter]',
    snsFilterButton: '.right-menu-items > .fa-filter',
    snsFilterAddButton: 'section[id=Filters] .operation-filter > button.fa-plus',
    snsFilterFieldDropdown: 'section[id=Filters] .input-drop-down.error input[placeholder=Field]',
    snsFilterOperatorDropdown: 'section[id=Filters] .input-drop-down.error input[placeholder=Operator]',
    snsFilterValueInputField: 'section[id=Filters] .input-text.error input',
    snsApplyButton: '.advanced-filter-commands .fa-check',
    snsSaveButton: '.fa-floppy-o',
    snsNameInputField: 'div[field=name] input',
    snsAvailablityDropdown: 'div[field=queryAvailabilityId] input',
    snsDropdown: 'input[placeholder="Search and Select Query"]',
    snsSaveAndApplyButton: '.fa-check-circle',
    clearDropdownButton: '.el-icon-circle-close'
  }

  getListCardLocators(): { [key: string]: string } {
    return this.listCardLocators;
  }

  clearColumnFilter(column: string, expectedRecordCount: number): void {
    this.clickColumnEllipsis(column);
    this.clickVisibleElement(this.commonLocators.columnClearButton).wait(5000);
    this.verifyRecordCount(expectedRecordCount);
  }

  clickColumnEllipsis(column: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('th[data-field=' + column + ']').find(this.getCommonLocators().columnEllipsis).click();
  }

  clickInstantInsights(row: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCommonElements().tableRow().eq(row).get('td').eq(0).find('a').click({ force: true });
  }

  doubleClickRecord(row: number, column: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCommonElements().tableRow().eq(row).get('td').eq(column).dblclick({ force: true });
  }

  dragColumn(columnName: string, target: string): void {
    cy.get('th[data-title="' + columnName + '"]').wait(1000).drag('th[data-title="' + target + '"]', { force: true });
  }

  exportReports(reportFormat: ReportFormat): void {
    this.clickElement(this.getCommonLocators().exportButton);
    cy.get(this.getCommonLocators().exportReportFormat).contains(reportFormat).click({ force: true });
  }

  exportReportsViaPrint(reportFormat: ReportFormat, printWaitTime: number = 7000): void {
    this.exportReports(reportFormat);
    this.clickVisibleElement(this.getCommonLocators().exportCheckButton).wait(printWaitTime);
    if (reportFormat === ReportFormat.PDF) {
      this.verifyAlertMessage(this.getCommonConstants().exportAlertMessage);
      this.clickVisibleElement(this.getCommonLocators().alertDialogCloseButton);
    }
  }

  exportReportsViaEmail(reportFormat: ReportFormat, email: string, subject: string, body: string, emailWaitTime: number = 3000): void {
    this.exportReports(reportFormat);
    cy.get(this.getCommonLocators().exportDeliveryMethod).contains(DeliveryMethod.EMAIL).click({ force: true });
    this.clickVisibleElement(this.getCommonLocators().exportReportEmailOptionsTab);
    this.typeWithinField(this.getCommonLocators().exportReportEmailRecipientInputField, email);
    this.typeWithinField(this.getCommonLocators().exportReportEmailSubjectInputField, subject);
    this.typeWithinField(this.getCommonLocators().exportReportEmailBodyInputField, body);
    this.clickElement(this.getCommonLocators().exportReportEmailOptionsTab);
    this.clickVisibleElement(this.getCommonLocators().exportCheckButton).wait(emailWaitTime);
    this.verifyAlertMessage(this.getCommonConstants().emailSuccessMessage);
    this.clickVisibleElement(this.getCommonLocators().alertDialogCloseButton);
  }

  filterColumn(column: string, expectedAssetCount: number): void {
    this.getTableColumnIndex(column).then(index => {
      const indexAsNumber = Number(index);
      this.getCommonElements().table().find('td').eq(indexAsNumber).invoke('text').as('value');
      this.clickColumnEllipsis(column);
      this.clickVisibleElement(this.commonLocators.columnFilterIcon);
      cy.get(this.commonLocators.columnFilterDropdown).filter(':visible').should('have.text', 'Is equal to');
      cy.get('@value').then((value) => {
        const valueAsString = value.toString();
        this.typeWithinVisibleField(this.commonLocators.columnFilterInputField, valueAsString);
        this.clickVisibleElement(this.commonLocators.columnFilterButton).wait(3000);
        this.getCommonElements().table().find('tr').find('td').eq(indexAsNumber).contains(valueAsString).should('be.visible');
      });
      this.verifyRecordCount(expectedAssetCount);
    });
  }

  groupColumn(columnName: string): void {
    cy.get('th[data-title="' + columnName + '"]').wait(1000).drag(this.listCardLocators.dropColumnTarget, { force: true });
    cy.get(this.listCardLocators.dropColumnTarget).click({ force: true });
  }

  paginate(pageNumber: number, expectedRecordCount: number): void {
    this.isElementExisting(this.listCardLocators.pagination + pageNumber + ']').then($exists => {
      if ($exists) {
        this.clickElement(this.listCardLocators.pagination + pageNumber + ']').wait(5000);
        this.verifyRecordCount(expectedRecordCount);
      }
    });
  }

  searchAndSelect(column: string, field: string, operator: string, availability: string): void {
    this.getTableColumnIndex(column).then(index => {
      const indexAsNumber = Number(index);
      this.getCommonElements().table().find('td').eq(indexAsNumber).invoke('text').as('value');
      this.clickElement(this.listCardLocators.snsFilterButton).wait(1000);
      this.clickElement(this.listCardLocators.snsFilterAddButton);
      this.typeWithinVisibleField(this.listCardLocators.snsFilterFieldDropdown, field);
      this.selectFromDropdownByText(field);
      this.typeWithinVisibleField(this.listCardLocators.snsFilterOperatorDropdown, operator);
      this.selectFromDropdownByText(operator);
      cy.get('@value').then((value) => {
        const valueAsString = value.toString();
        this.typeWithinVisibleField(this.listCardLocators.snsFilterValueInputField, valueAsString);
        cy.get('section > h1').contains('Filters').click({ force: true });
        this.clickElement(this.listCardLocators.snsApplyButton).wait(3000);
        this.getCommonElements().table().find('tr').find('td').eq(indexAsNumber).contains(valueAsString).should('exist');
      });
    });
    this.clickElement(this.listCardLocators.snsSaveButton);
    const snsName = 'Regression_' + MathUtils.generateRandomNumber(5);
    this.typeWithinField(this.listCardLocators.snsNameInputField, snsName);
    this.typeWithinField(this.listCardLocators.snsAvailablityDropdown, availability);
    this.selectFromDropdownByText(availability);
    this.clickVisibleElement(this.listCardLocators.snsSaveAndApplyButton).wait(5000);
    this.clickElement(this.listCardLocators.snsDropdown).wait(4000);
    cy.get('input[placeholder="' + snsName + '"]').should('be.visible');
    this.clickElement(this.listCardLocators.clearDropdownButton).wait(5000);
  }

  selectItemsPerPage(items: string, expectedAssetCount: number): void {
    this.selectElement(items).wait(8000);
    this.verifyRecordCount(expectedAssetCount);
  }

  showColumn(column: string): void {
    this.clickColumnEllipsis(column);
    this.clickVisibleElement(this.commonLocators.columnIcon);
    cy.get(this.commonLocators.columnMenuItems).then($element => {
      if ($element.find(this.commonLocators.columnCheckboxUnchecked).is(':visible')) {
        cy.get(this.commonLocators.columnCheckboxUnchecked).first().invoke('text').as('value');
        cy.get(this.commonLocators.columnCheckboxUnchecked).first().click({ force: true });
        cy.get(this.commonLocators.columnMenuActions).contains('Apply').click({ force: true });
        cy.get('@value').then((value) => {
          cy.get('th[data-title="' + value.toString().trim() + '"]').should('exist');
        });
        return;
      }

      this.clickColumnEllipsis(column);
    });
  }

  hideColumn(column: string, index: number = 0): void {
    this.clickColumnEllipsis(column);
    this.clickVisibleElement(this.commonLocators.columnIcon);
    cy.get(this.commonLocators.columnMenuItems).then($element => {
      if ($element.find(this.commonLocators.columnCheckboxChecked).is(':visible')) {
        cy.get(this.commonLocators.columnCheckboxChecked).eq(index).invoke('text').as('value');
        cy.get(this.commonLocators.columnCheckboxChecked).eq(index).click({ force: true });
        cy.get(this.commonLocators.columnMenuActions).contains('Apply').click({ force: true });
        cy.get('@value').then((value) => {
          cy.get('th[data-title="' + value.toString().trim() + '"]').should('not.be.visible');
        });
        return;
      }

      this.clickColumnEllipsis(column);
    });
  }

  sortColumn(column: string, selector: string, sortOrder: SortOrder): void {
    this.clickColumnEllipsis(column).wait(1000);
    this.clickVisibleElement(selector).wait(7000);
    this.getTableColumnIndex(column).then(index => {
      this.verifyColumnSorting(Number(index), sortOrder);
    });
    cy.wait(3000);
  }

  ungroupColumn(columName: string): void {
    cy.get('.k-group-indicator[data-title="' + columName + '"]').find('.k-i-close').click().wait(3000);
  }

  searchRecord(columnName: string, data: string, shouldExist: boolean = true): void {
    cy.wait(2000);
    this.clickColumnEllipsis(columnName);
    cy.get(this.getCommonLocators().columnFilterIcon).filter(':visible').next().next().next().invoke('attr', 'class').then($attr => {
      if ($attr.toString().includes('k-i-arrow-chevron-down')) {
        this.clickVisibleElement(this.getCommonLocators().columnFilterIcon).wait(2000);
      }
    });
    this.typeWithinVisibleField(this.getCommonLocators().columnFilterInputField, data).wait(2000);
    this.clickVisibleElement(this.getCommonLocators().columnFilterButton).wait(3000);
    this.verifyRecordExists(columnName, data, shouldExist);
  }

  showInstantInsights(row: number, column: string): void {
    this.clickInstantInsights(row).wait(3000);
    cy.get(this.getListCardLocators().instantInsightsWindow).should('be.visible');
    this.getTableColumnIndex(column).then(index => {
      const indexAsNumber = Number(index);
      this.getCommonElements().table().find('tr').eq(row).find('td').eq(indexAsNumber).invoke('text').as('value');
      cy.get('@value').then((value) => {
        const valueAsString = value.toString();
        cy.get('[field=' + column + '] > .control > label').should('contain.text', valueAsString);
      });
    });
    this.clickElement(this.getListCardLocators().instantInsightsWindowCloseButton);
  }

  verifyRecordExists(columnName: string, data: string, shouldExist: boolean = true): void {
    this.getTableColumnIndex(columnName).then(index => {
      if (shouldExist) {
        this.getCommonElements().table().find('td').eq(index).contains(data).should('exist');
        this.doubleClickRecordByText(data);
      }
    });
  }

  verifyRecordCount(assetCount: number) {
    cy.get(this.getCommonLocators().table).should('have.length.at.most', assetCount);
  }

  verifyColumnSorting(column: number, sortOrder: SortOrder): void {
    const values = [];
    let counter = 0;
    cy.get(this.getCommonLocators().table).children().each(($element, index, $list) => {
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

  verifyColumnFilterOptions(): void {
    cy.get(this.commonLocators.columnFilters).first().children().each(($element, index) => {
      cy.wrap($element).should('have.text', Object.values(SortOrder)[index]);
    });

    cy.get(this.commonLocators.columnFilters)
      .eq(1).find(this.commonLocators.columnIcon).next('span')
      .should('have.text', Object.values(ColumnFilterOption)[0]);
    cy.get(this.commonLocators.columnFilters)
      .eq(2).find(this.commonLocators.columnFilterIcon).next('span')
      .should('have.text', Object.values(ColumnFilterOption)[1]);
  }

  verifyColumnFilters(): void {
    const ellipsis = this.getCommonLocators().columnEllipsis;
    cy.get(this.getCommonLocators().tableHeaders).children(this.listCardLocators.sortableTableHeaders).each(($element) => {
      if ((!$element.is('[style]') || ($element.attr('style') === 'touch-action: none;'))) {
        cy.wrap($element).find(ellipsis).click();
        this.verifyColumnFilterOptions();
        cy.wrap($element).find(ellipsis).click();
      }
    });
    cy.get(this.getCommonLocators().gridContent).scrollTo('left', { ensureScrollable: false });
  }
}
