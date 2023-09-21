import { Sites } from "cypress/support/enums/admin/sites";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { SiteDetailCard } from "cypress/support/pages/admin/siteDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { PartDetailCard } from 'cypress/support/pages/operations/inv/partDetailCard.page';
import { PartStoreroomDetailCard } from "cypress/support/pages/operations/inv/partStoreroomDetailCard.page";
import { PersonnelDetailCard } from "cypress/support/pages/operations/pers/personnelDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import site from "../../fixtures/admin/createSite.json";
import asset from "../../fixtures/asset/createAsset.json";
import partStoreroom from "../../fixtures/inv/createPartStoreroom.json";
import personnel from "../../fixtures/pers/createPersonnel.json";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'sites'], () => {
  describe('Site Detail Card', () => {
    const listCardPage = new ListCard();
    const siteDetailCardPage = new SiteDetailCard();
    const assetDetailCardPage = new AssetDetailCard();
    const personnelDetailCardPage = new PersonnelDetailCard();
    const partDetailCardPage = new PartDetailCard();
    const partStoreroomDetailCardPage = new PartStoreroomDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = listCardPage.getCommonLocators();
    const detailCardLocators = siteDetailCardPage.getDetailCardLocators();
    const siteName = site.siteName + MathUtils.generateRandomNumber(5);
    const shiftName = site.shiftName + MathUtils.generateRandomNumber(5);
    const laborRateName = site.laborRateName + MathUtils.generateRandomNumber(5);
    const personnelLastName = personnel.lastName + MathUtils.generateRandomNumber(5);
    const partStoreroomName = partStoreroom.name + MathUtils.generateRandomNumber(5);
    const assetId = asset.id + MathUtils.generateRandomNumber(5);
    const siteId = 'name';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Sites.SITES).wait(4000);
      listCardPage.clickElement(listCardLocators.addButton).wait(4000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(2000);
        }
      });
      siteDetailCardPage.createSite(siteName);
      siteDetailCardPage.goToSection(Sites.SHIFTS);
      siteDetailCardPage.clickSectionButton(Sites.SHIFTS, commonLocators.addButton).wait(2000);
      siteDetailCardPage.createShift(shiftName);
      siteDetailCardPage.goToSection(Sites.LABOR_RATES);
      siteDetailCardPage.clickSectionButton(Sites.LABOR_RATES, commonLocators.addButton).wait(2000);
      siteDetailCardPage.createLaborRate(laborRateName);
    });

    beforeEach(() => {
      cy.openCardByTitle(Sites.SITES);
    });

    after(() => {
      cy.openCardByTitle(Sites.SITES);
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.selectRecordStatus(Sites.GENERAL, Status.INACTIVE);
      siteDetailCardPage.selectRecordDisposition(Sites.GENERAL, Disposition.INACTIVE);
      siteDetailCardPage.clickElement(commonLocators.saveButton).wait(2000);
    });

    /**
     * Checks the Site Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/587} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: September 12, 2023
     */
    it('checks the General section and creates a new Site', { tags: 'sites-add' }, () => {
      listCardPage.searchRecord(siteId, siteName);
    });

    it('checks the Contact Info section', { tags: 'sites-contact-info' }, () => {
      const contactInfoName = 'Home';
      const contactInfoPhoneNumber = MathUtils.generateRandomNumber(9).toString();
      const contactInfoEmailAddress = 'elise.sumanga@amcsgroup.com';
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.CONTACK_INFO);
      siteDetailCardPage.createContactInfoPhoneNumber(contactInfoName, contactInfoPhoneNumber);
      siteDetailCardPage.createContactInfoEmailAddress(contactInfoName, contactInfoEmailAddress);
      siteDetailCardPage.createContactInfoAddress(contactInfoName, 'Address 1', 'Address 2', 'New York', MathUtils.generateRandomNumber(4));
      siteDetailCardPage.clickElement(commonLocators.saveButton).wait(2000);
      siteDetailCardPage.verifyAlertMessage(siteDetailCardPage.getCommonConstants().successMessage);
      siteDetailCardPage.clickElement(commonLocators.alertDialogCloseButton);
    });

    it('checks the Documents section', { tags: 'sites-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.DOCUMENTS);
      siteDetailCardPage.getDetailCardElements().sectionContainer(Sites.DOCUMENTS).should('be.visible');
      siteDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      siteDetailCardPage.validateUploadedFile(filenameRegex);
      siteDetailCardPage.deleteUploadedFile();
    });

    it('checks the Assets section', { tags: 'sites-assets' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.ASSETS).wait(3000);
      siteDetailCardPage.clickSectionButton(Sites.ASSETS, commonLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(2000);
        }
      });
      assetDetailCardPage.createAsset(
        assetId,
        Number(asset.acquisitionCost),
        asset.acquisitionDate,
        asset.dateInService,
        asset.licensePlate,
        asset.serialNumber,
        asset.vin,
        asset.avatarFilename,
        true
      );
      cy.closeCardByTitle(Sites.ASSET)
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.ASSETS, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', assetId);
    });

    it('checks the Personnel section', { tags: 'sites-personnel' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.PERSONNEL).wait(3000);
      siteDetailCardPage.clickSectionButton(Sites.PERSONNEL, commonLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(2000);
        }
      });
      personnelDetailCardPage.createPersonnel(
        personnel.avatarFilename,
        personnelLastName,
        personnel.firstName,
        personnel.middleName,
        MathUtils.generateRandomNumber(8).toString(),
        personnel.notes,
        true
      );
      cy.closeCardByTitle(Sites.PERSON)
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.PERSONNEL, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', personnelLastName);
    });

    it('checks the Shifts section', { tags: 'sites-shifts' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.SHIFTS);
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.SHIFTS, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', shiftName);
    });

    it('checks the Labor Rates section', { tags: 'sites-labor-rates' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.LABOR_RATES);
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.LABOR_RATES, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', laborRateName);
    });

    it('checks the Fees section', { tags: 'sites-fees' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.FEES);
      siteDetailCardPage.clickSectionButton(Sites.FEES, commonLocators.addButton).wait(3000);
      siteDetailCardPage.createFee();
      cy.closeCardByTitle(Sites.FEE);
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.FEES, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', siteName);
    });

    it('checks the Other Costs section', { tags: 'sites-other-costs' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.OTHER_COSTS);
      siteDetailCardPage.clickSectionButton(Sites.OTHER_COSTS, commonLocators.addButton).wait(3000);
      siteDetailCardPage.createOtherCost();
      cy.closeCardByTitle(Sites.OTHER_COST);
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.OTHER_COSTS, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', siteName);
    });

    it('checks the Taxes section', { tags: 'sites-taxes' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.TAXES);
      siteDetailCardPage.clickSectionButton(Sites.TAXES, commonLocators.addButton).wait(3000);
      siteDetailCardPage.createTax();
      cy.closeCardByTitle(Sites.TAX);
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.TAXES, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', siteName);
    });

    it('checks the Vendor Stores section', { tags: 'sites-vendor-stores' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.VENDOR_STORES);
      partDetailCardPage.createPartVendorStore();
    });

    it('checks the Part Storerooms section', { tags: 'sites-part-storerooms' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.goToSection(Sites.PART_STOREROOMS);
      siteDetailCardPage.clickSectionButton(Sites.PART_STOREROOMS, commonLocators.addButton).wait(3000);
      partStoreroomDetailCardPage.createPartStoreroom(partStoreroomName, partStoreroom.description, true);
      siteDetailCardPage.getDetailCardElements().sectionContainerElements(Sites.PART_STOREROOMS, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', partStoreroomName);
    });

    it('checks the Export Reports functionality', { tags: 'sites-export' }, () => {
      listCardPage.searchRecord(siteId, siteName);
      siteDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });
  });
});
