import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ListCard } from "../common/listCard.page";

export class PartTypeListCard extends ListCard {

  sortColumn(column: string, selector: string, sortOrder: SortOrder): void {
    this.clickColumnEllipsis(column).wait(1000);
    this.clickVisibleElement(selector).wait(7000);
    this.getTableColumnIndex(column).then(index => {
      this.verifyPartTypeColumnSorting(Number(index), sortOrder);
    });
    cy.wait(3000);
  }

  verifyPartTypeColumnSorting(column: number, sortOrder: SortOrder): void {
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
