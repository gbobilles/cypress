import { Manufacturer } from "cypress/support/enums/inv/manufacturer";
import { Part } from "cypress/support/enums/inv/part";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { ManufacturerDetailCard } from "cypress/support/pages/operations/inv/manufacturerDetailCard.page";
import part from "../../../fixtures/inv/createPart.json";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['regression', 'manufacturers'], () => {
  describe('Manufacturers Card', () => {
    const listCardPage = new ListCard()
    const manufacturerDetailCard = new ManufacturerDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const manufacturerNameColumn = 'name';
    const name = 'manufacturer_' + MathUtils.generateRandomNumber(5);
    const id = 'manufacturer_' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Manufacturer.MANUFACTURERS);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      manufacturerDetailCard.createManufacturer(
        name,
        id
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(Manufacturer.MANUFACTURERS);
    });

    it('checks the General section and creates a new Manufacturer', { tags: 'manufacturer-add' }, () => {
      listCardPage.searchRecord(manufacturerNameColumn, name);
    });

    it('checks the Parts section', { tags: 'manufacturer-parts' }, () => {
      listCardPage.searchRecord(manufacturerNameColumn, name);
      manufacturerDetailCard.goToSection(Manufacturer.PARTS).wait(1000);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      manufacturerDetailCard.manufacturerPartCreation(
        part.avatarFilename,
        part.description,
        part.notes
      );
      cy.closeCardByTitle(Part.PART).wait(3000);
      manufacturerDetailCard.getDetailCardElements().sectionContainerElements(Part.PARTS, commonLocators.table)
      .find('tr')
      .should('have.length.at.least', 1)
      .find('td')
      .should('contain.text', id);
    });
  });
});
