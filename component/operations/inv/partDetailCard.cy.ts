import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Part } from 'cypress/support/enums/inv/part';
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PartDetailCard } from 'cypress/support/pages/operations/inv/partDetailCard.page';
import part from "../../../fixtures/inv/createPart.json";
import TestFilters from '../../../support/utils/filterTest';
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['regression', 'parts'], () => {
  describe('Part Detail Card', () => {
    const listCardPage = new ListCard();
    const partDetailCardPage = new PartDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = partDetailCardPage.getDetailCardLocators();
    const commonLocators = partDetailCardPage.getCommonLocators();
    const partId = part.partId + MathUtils.generateRandomNumber(5);
    const partIdColumn = 'manufacturerIdentifier';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Part.PARTS).wait(5000);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      partDetailCardPage.createPart(
        part.avatarFilename,
        partId,
        part.partType,
        part.description,
        part.notes
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(Part.PARTS);
    });

    /**
     * Checks the General section of the Part Detail Card and creates a new Part.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3343} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 25, 2023
     */
    it('checks the General section and creates a new Part', { tags: 'part-add' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
    });

    /**
     * Checks the Barcodes section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18046} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 27, 2023
     */
    it('checks the Barcodes section', { tags: 'part-barcodes' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.GENERAL);
      partDetailCardPage.createBarcode('Dossier Barcode 1', 'PART000000000049');
    });

    /**
     * Checks the Equivalent Parts section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18050} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 26, 2023
     */
    it('checks the Equivalent Parts section', { tags: 'part-equivalent-parts' }, () => {
      const newPartId = part.partId + MathUtils.generateRandomNumber(5);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      partDetailCardPage.createPart(
        part.avatarFilename,
        newPartId,
        part.partType,
        part.description,
        part.notes
      );
      cy.closeCardByTitle(Part.PART);
      listCardPage.searchRecord(partIdColumn, newPartId);
      partDetailCardPage.goToSection(Part.EQUIVALENT_PARTS);
      partDetailCardPage.createEquivalentPart(partIdColumn);
    });

    /**
     * Checks the Transfer Part section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18051} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 8, 2023
     */
    it('checks the Transfer Part section', { tags: 'part-transfer-part' }, () => {
      const partTransferNotes = 'Part transfer';
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.PART_IN_STOREROOMS);
      partDetailCardPage.createPartInStoreroom(5, 0);
      partDetailCardPage.createPartInStoreroom(5, 1);
      partDetailCardPage.goToSection(Part.TRANSFER_PART);
      partDetailCardPage.transferPart(partTransferNotes);
    });

    /**
     * Checks the Documents section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18052} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 26, 2023
     */
    it('checks the Documents section', { tags: 'part-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.DOCUMENTS);
      partDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      partDetailCardPage.validateUploadedFile(filenameRegex);
      partDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Part in Storerooms section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18054} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 26, 2023
     */

    it('checks the Part in Storerooms section', { tags: 'part-parts-in-storeroom' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.PART_IN_STOREROOMS);
      partDetailCardPage.createPartInStoreroom(5, 0);
    });

    /**
     * Checks the Vendor Stores section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18056} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: May 02, 2023
     */
    it('checks the Vendor Stores section', { tags: 'part-vendor-stores' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.VENDOR_STORES);
      partDetailCardPage.createPartVendorStore();
    });

    /**
     * Checks the Warranties section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18057} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: May 02, 2023
     */
    it('checks the Warranties section', { tags: 'part-warranties' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.VENDOR_STORES);
      partDetailCardPage.createPartWarranties();
    });

    /**
     * Checks the System / Assembly / Component Allowed Usage section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18058} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: May 03, 2023
     */
    it('checks the System / Assembly / Component Allowed Usage section', { tags: 'part-code-usage' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.SYSTEM_ASSEMBLY_COMPONENT_ALLOWED_USAGE);
      partDetailCardPage.createPartSystemAssemblyComponentAllowedUsage();
    });

    /**
     * Checks the Assets section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18059} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: May 03, 2023
     */
    it('checks the Assets section', { tags: 'part-assets' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.goToSection(Part.ASSETS);
      partDetailCardPage.createPartAsset();
    });

    /**
     * Checks the Status - Active/Inactive section of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3345} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 30, 2023
     */
    it('checks the Status - Active/Inactive section', { tags: 'part-status' }, () => {
      const statusColumn = 'disposition_status_name';
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.setPartStatus(Status.INACTIVE, Disposition.INACTIVE);
      cy.closeAllCards();
      cy.openCardByTitle(Part.PARTS);
      listCardPage.searchRecord(partIdColumn, partId, false);
      listCardPage.clickColumnEllipsis(statusColumn);
      listCardPage.clickElement(commonLocators.columnFilterIcon, -1).wait(2000);
      listCardPage.typeWithinVisibleField(commonLocators.columnFilterInputField, Status.INACTIVE).wait(2000);
      listCardPage.clickVisibleElement(commonLocators.columnFilterButton).wait(3000);
      listCardPage.verifyRecordExists(partIdColumn, partId);
      partDetailCardPage.setPartStatus(Status.ACTIVE, Disposition.ACTIVE);
    });

    /**
     * Checks the Export Reports functionality of the Part Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18061} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: May 04, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Export Reports functionality', { tags: 'part-export' }, () => {
      listCardPage.searchRecord(partIdColumn, partId);
      partDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF, 15000);
    });
  });
});
