import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { AddPartoStoreroom } from "cypress/support/enums/inv/addPartToStoreroom";
import { PartOnHand } from "cypress/support/enums/inv/partOnHand";
import { PartStoreroom } from "cypress/support/enums/inv/partStoreroom";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PartOnHandDetailCard } from "cypress/support/pages/operations/inv/partOnHandDetailCard.page";
import { PartStoreroomDetailCard } from "cypress/support/pages/operations/inv/partStoreroomDetailCard.page";
import partStoreroom from "../../../fixtures/inv/createPartStoreroom.json";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['regression', 'partStorerooms'], () => {
  describe('Part Storeroom Detail Card', () => {
    const listCardPage = new ListCard();
    const partStoreroomDetailCardPage = new PartStoreroomDetailCard();
    const partOnHandDetailCardPage = new PartOnHandDetailCard();
    const commonLocators = partStoreroomDetailCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const partStoreroomDetailCardLocators = partStoreroomDetailCardPage.getLocators();
    const detailCardLocators = partStoreroomDetailCardPage.getDetailCardLocators();
    const partStoreroomNameColumn = 'name';
    const partStoreroomName = partStoreroom.name + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PartStoreroom.PART_STOREROOMS);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      partStoreroomDetailCardPage.createPartStoreroom(partStoreroomName, partStoreroom.description);
    });

    beforeEach(() => {
      cy.openCardByTitle(PartStoreroom.PART_STOREROOMS);
    });

    /**
     * Checks the General section of the Part Storeroom Detail Card and creates a new Part Storeroom.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12784} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 29, 2023
     */
    it('checks the General section and creates a new Part Storeroom', { tags: 'part-storeroom-add' }, () => {
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
    });

    /**
     * Checks the Parts in Storeroom section of the Part Storeroom Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18107} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 8, 2023
     */
    it.skip('checks the Parts in Storeroom section', { tags: 'part-storeroom-parts' }, () => {
      const partStoreroomLocationName = 'New location_' + MathUtils.generateRandomNumber(5);
      const partStoreroomLocationDescription = 'New part storeroom location';
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
      partStoreroomDetailCardPage.goToSection(PartStoreroom.PART_STOREROOM_LOCATIONS).wait(3000);
      partStoreroomDetailCardPage.clickSectionButton(PartStoreroom.PART_STOREROOM_LOCATIONS, commonLocators.addButton).wait(2000);
      partStoreroomDetailCardPage.createPartStoreroomLocation(partStoreroomLocationName, partStoreroomLocationDescription);
      partStoreroomDetailCardPage.goToSection(PartStoreroom.PARTS_IN_STOREROOM);
      partStoreroomDetailCardPage.createPartInStoreroom(25, 25, 25, 25);
      partStoreroomDetailCardPage.getCommonElements().table().find('tr').first().find(commonLocators.gearIcon).click({ force: true }).wait(1000);
      partOnHandDetailCardPage.saveGeneralSettings(true);
      partOnHandDetailCardPage.goToSection(PartOnHand.GL_SPECIFICATIONS);
      partOnHandDetailCardPage.createGlSpecifications();
      partOnHandDetailCardPage.goToSection(PartOnHand.INVENTORY_LOCATIONS);
      partOnHandDetailCardPage.createInventoryLocation();
    });

    /**
     * Checks the Part Storeroom Locations section of the Part Storeroom Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18109} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 21, 2023
     */
    it('checks the Part Storeroom Locations section', { tags: 'part-storeroom-locations' }, () => {
      const partStoreroomLocationName = 'New location_' + MathUtils.generateRandomNumber(5);
      const partStoreroomLocationDescription = 'New part storeroom location';
      const childPartStoreroomLocationName = 'Child location_' + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
      partStoreroomDetailCardPage.goToSection(PartStoreroom.PART_STOREROOM_LOCATIONS).wait(3000);
      partStoreroomDetailCardPage.clickSectionButton(PartStoreroom.PART_STOREROOM_LOCATIONS, commonLocators.addButton).wait(2000);
      partStoreroomDetailCardPage.createPartStoreroomLocation(partStoreroomLocationName, partStoreroomLocationDescription);
      partStoreroomDetailCardPage.addChildPartStoreroomLocation(partStoreroomLocationName, childPartStoreroomLocationName, partStoreroomLocationDescription);
      partStoreroomDetailCardPage.expandPartStoreoomLocation(partStoreroomLocationName, childPartStoreroomLocationName);
      partStoreroomDetailCardPage.showPartStoreroomLocationDetails(partStoreroomLocationName);
    });

    /**
     * Checks the Part Transfer section of the Part Storeroom Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18110} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: June 29, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: July 12, 2023
     */
    it('checks the Part Transfer section', { tags: 'part-storeroom-part-transfer' }, () => {
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
      partStoreroomDetailCardPage.addPartToStoreroom(true);
      cy.get(partStoreroomDetailCardLocators.partQuantityInputField).invoke('val').then($data => {
        cy.wrap($data).as('addedPartQuantity')
      });
      cy.get(partStoreroomDetailCardLocators.partIdDropdown).invoke('val').then($data => {
        let addedPartId = null;
        addedPartId = $data;
        addedPartId = addedPartId.toString().split(' ')[0];
        cy.wrap(addedPartId).as('addedPartId');
      });
      cy.closeCardByTitle(AddPartoStoreroom.ADD_PART_TO_STOREROOM);
      partStoreroomDetailCardPage.goToSection(PartStoreroom.PART_TRANSFER).wait(3000);
      partStoreroomDetailCardPage.getCardTextField(PartStoreroom.PART_TRANSFER, partStoreroomDetailCardLocators.partQuantityInputField).invoke('val').then($data => {
        cy.wrap($data).as('transferableQuantity');
      });
      cy.get('@addedPartId').then(addedPartId => {
        partStoreroomDetailCardPage.transferPart(addedPartId.toString());
      });
      partStoreroomDetailCardPage.goToSection(PartStoreroom.PARTS_IN_STOREROOM).wait(3000);
      cy.get('@addedPartId').then(addedPartId => {
        partStoreroomDetailCardPage.doubleClickRecordByText(addedPartId.toString()).wait(3000);
      });
      partStoreroomDetailCardPage.getCardTextField(PartOnHand.GENERAL, partStoreroomDetailCardLocators.partQuantityInputField).invoke('val').then($data => {
        cy.wrap($data).as('newPartQuantity');
      });
      cy.get('@addedPartQuantity').then(addedPartQuantity => {
        cy.get('@transferableQuantity').then(transferableQuantity => {
          cy.get('@newPartQuantity').then(newPartQuantity => {
            const updatedQuantity = Number(addedPartQuantity) - Number(transferableQuantity);
            expect(Number(newPartQuantity)).to.eq(updatedQuantity);
          });
        });
      });
    });

    /**
     * Checks the Part Stocking Levels section of the Part Storeroom Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18108} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: June 29, 2023
     *
     * Updated by: Elise Margaret R. Sumanga
     * Date updated: July 12, 2023
     */
    it('checks the Part Stocking Levels section', { tags: 'part-storeroom-stocking-levels' }, () => {
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
      partStoreroomDetailCardPage.addPartToStoreroom(true);
      cy.get(partStoreroomDetailCardLocators.partIdDropdown).invoke('val').then($data => {
        let addedPartId = $data;
        addedPartId = addedPartId.toString().split(' ')[0];
        cy.wrap(addedPartId).as('addedPartId');
      });
      cy.closeCardByTitle(AddPartoStoreroom.ADD_PART_TO_STOREROOM);
      partStoreroomDetailCardPage.goToSection(PartStoreroom.PART_STOCKING_LEVELS).wait(3000);
      cy.get('@addedPartId').then(addedPartId => {
        const partId = addedPartId.toString();
        partStoreroomDetailCardPage.doubleClickRecordByText(partId);
        partStoreroomDetailCardPage.editStockingLevel(PartStoreroom.STOCKING_LEVEL_TYPE_SINGLE);
        cy.get(detailCardLocators.sectionHeader).contains(PartStoreroom.PART_STOCKING_LEVELS).should('have.class', 'el-menu-item is-active');
      });
    });

    /**
     * Checks the Documents section of the Part Storeroom Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18111} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: May 29, 2023
     */
    it('checks the Documents section', { tags: 'part-storeroom-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
      partStoreroomDetailCardPage.goToSection(PartStoreroom.DOCUMENTS).wait(3000);
      partStoreroomDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      partStoreroomDetailCardPage.validateUploadedFile(filenameRegex);
      partStoreroomDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Export Reports functionality of the Part Storeroom Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18288} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 29, 2023
     */
    it('checks the Export Reports functionality', { tags: 'part-storeroom-export' }, () => {
      listCardPage.searchRecord(partStoreroomNameColumn, partStoreroomName);
      partStoreroomDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });
  });
});
