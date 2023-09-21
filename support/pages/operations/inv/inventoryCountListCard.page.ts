import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ListCard } from "../../common/listCard.page";

export class InventoryCountListCard extends ListCard {

  private constants: { [key: string]: string } = {
    partStoreroom: 'Part Storeroom',
    partId: 'Part ID',
    description: 'Description',
    currentlyOnHand: 'Currently on hand',
    yourCount: 'Your Count',
    location: 'Location'
  }

  private locators: { [key: string]: string } = {
    partIdColumn: '[data-field="part_manufacturerIdentifier"]',
    descriptionColumn: '[data-field="part_description"]',
    currentlyOnHandColumn: '[data-field="quantity"]',
    yourCountColumn: '[data-field="newQuantity"]',
    locationColumn: '[data-field="location"]',
    ascendingColumnIcon: 'span.k-icon.k-i-sort-asc-sm',
    descendingColumnIcon: 'span.k-icon.k-i-sort-desc-sm'
  }

  verifyInventoryCountListColumn(): void {
    cy.get(this.listCardLocators.groupIndicator).should('have.attr', 'data-title', this.constants.partStoreroom);
    cy.get(this.locators.partIdColumn).should('contain', this.constants.partId);
    cy.get(this.locators.descriptionColumn).should('contain', this.constants.description);
    cy.get(this.locators.currentlyOnHandColumn).should('contain', this.constants.currentlyOnHand);
    cy.get(this.locators.yourCountColumn).should('contain', this.constants.yourCount);
    cy.get(this.locators.locationColumn).should('contain', this.constants.location);
  }

  inventoryCountListSortingColumn(column: string, selector: string, sortOrder: SortOrder): void {
    this.clickColumnEllipsis(column).wait(1000);
    this.clickVisibleElement(selector).wait(7000);
    this.getTableColumnIndex(column).then(index => {
      this.verifyInventoryCountColumnSorting(Number(index), sortOrder);
    });
    cy.wait(3000);
  }

  inventoryCountListFilterColumn(column: string, expectedAssetCount: number, filterString: string = 'Diesel'): void {
    this.getTableColumnIndex(column).then(index => {
      const indexAsNumber = Number(index);
      cy.get('th[data-field=' + column + ']').find(this.getCommonLocators().columnEllipsis).click({ force: true });
      cy.get(this.commonLocators.listScroller).find('ul').children('li').contains('Contains').click({ force: true }).wait(1000);
      this.typeWithinField(this.commonLocators.columnFilterInputField, filterString).wait(2000);
      this.clickElement(this.commonLocators.columnFilterButton).wait(3000);
      this.getCommonElements().table().find('tr').eq(indexAsNumber).find('td').eq(indexAsNumber).contains(filterString).should('be.visible');
      this.verifyRecordCount(expectedAssetCount);
    });
  }

  inventoryCountListClearColumnFilter(column: string, expectedRecordCount: number): void {
    this.clickColumnEllipsis(column).wait(3000);
    this.clickVisibleElement(this.commonLocators.columnFilterIcon);
    this.clickVisibleElement(this.commonLocators.columnClearButton).wait(5000);
    this.verifyRecordCount(expectedRecordCount);
  }

  verifyInventoryCountColumnSorting(column: number, sortOrder: SortOrder): void {
    cy.get(this.getCommonLocators().table).children(this.listCardLocators.groupingRow).each(($element) => {
      cy.wrap($element).siblings(this.listCardLocators.masterRow).each(($element, index, $list) => {
        const values = [];
        let counter = 0;
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
    });
  }
}
