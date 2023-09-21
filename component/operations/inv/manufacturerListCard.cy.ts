import { SortOrder } from 'cypress/support/enums/common/columnFilters/sortOrder';
import { Manufacturer } from "cypress/support/enums/inv/manufacturer";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'manufacturers'], () => {
  describe('Manufacturers List Card', () => {
    const listCardPage = new ListCard()
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = listCardPage.getCommonLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Manufacturer.MANUFACTURERS);
    });

    it('checks the Manufacturers List Card', { tags: 'manufacturer-list-card' }, () => {
      const manufacturerNameColumn = 'name';
      const site = 'Manufacturer ID';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.paginate(1, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(manufacturerNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(manufacturerNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(manufacturerNameColumn);
      listCardPage.filterColumn(manufacturerNameColumn, 1);
      listCardPage.clearColumnFilter(manufacturerNameColumn, 10);
      listCardPage.showInstantInsights(0, manufacturerNameColumn);
      listCardPage.groupColumn(site);
      listCardPage.ungroupColumn(site);
      listCardPage.searchAndSelect(manufacturerNameColumn, 'Name', 'Equals', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      listCardPage.getCommonElements().windowTitle().should('contain.text', Manufacturer.MANUFACTURER).and('be.visible');
      cy.closeCardByTitle(Manufacturer.MANUFACTURER);
      listCardPage.getCommonElements().windowTitle().should('not.contain.text', Manufacturer.MANUFACTURER);
      cy.openCardInWindow(Manufacturer.MANUFACTURERS);
    });
  });
});
