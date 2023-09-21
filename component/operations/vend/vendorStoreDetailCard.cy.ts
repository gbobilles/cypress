import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { VendorStore } from "cypress/support/enums/vend/vendorStore";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { VendorStoreDetailCard } from "cypress/support/pages/operations/vend/vendorStoreDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import email from "../../../fixtures/common/email.json";
import vendorStore from "../../../fixtures/vend/createVendorStore.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'vendor_store'], () => {
  describe('Vendor Store Detail Card', () => {
    const listCardPage = new ListCard();
    const vendorStoreDetailCardPage = new VendorStoreDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = vendorStoreDetailCardPage.getDetailCardLocators();
    const vendorStoreName = vendorStore.name + MathUtils.generateRandomNumber(5);
    const vendorStoreId = vendorStore.vendorStoreId + MathUtils.generateRandomNumber(5);
    const vendorStoreNameColumn = 'name';
    const emailRecipient = email.email;
    const emailSubject = email.subject;
    const emailBody = email.body;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(VendorStore.VENDOR_STORES).wait(2000);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      vendorStoreDetailCardPage.createVendorStore(
        vendorStoreName,
        vendorStoreId,
        vendorStore.notes
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(VendorStore.VENDOR_STORES);
    });

    /**
     * Checks the General section of the Vendor Store Detail Card and creates a new Vendor Store.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12766} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 17, 2023
     */
    it('checks the General section and creates a new Vendor Store', { tags: 'vendor-store-add' }, () => {
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
    });

    /**
     * Checks the Contact Info section of the Vendor Store Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12767} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 17, 2023
     */
    it('checks the Contact Info section', { tags: 'vendor-store-contact-info' }, () => {
      const contactInfoName = 'Home';
      const contactInfoPhoneNumber = MathUtils.generateRandomNumber(9).toString();
      const contactInfoEmailAddress = 'elise.sumanga@amcsgroup.com';
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
      vendorStoreDetailCardPage.goToSection(VendorStore.CONTACT_INFO);
      vendorStoreDetailCardPage.createContactInfoPhoneNumber(contactInfoName, contactInfoPhoneNumber);
      cy.wait(2000);
      vendorStoreDetailCardPage.createContactInfoEmailAddress(contactInfoName, contactInfoEmailAddress);
      cy.wait(2000);
      vendorStoreDetailCardPage.createContactInfoAddress(contactInfoName, 'Address 1', 'Address 2', 'New York', MathUtils.generateRandomNumber(4));
      vendorStoreDetailCardPage.deleteContactInfoPhoneNumber();
      vendorStoreDetailCardPage.deleteContactInfoEmailAddress();
      vendorStoreDetailCardPage.deleteContactInfoAddress();
    });

    /**
     * Checks the Documents section of the Vendor Store Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12768} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 17, 2023
     */
    it('checks the Documents section', { tags: 'vendor-store-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
      vendorStoreDetailCardPage.goToSection(VendorStore.DOCUMENTS);
      vendorStoreDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      vendorStoreDetailCardPage.validateUploadedFile(filenameRegex);
      vendorStoreDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Parts section of the Vendor Store Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12769} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 17, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Parts section', { tags: 'vendor-store-parts' }, () => {
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
      vendorStoreDetailCardPage.goToSection(VendorStore.PARTS);
      vendorStoreDetailCardPage.createVendorStorePart();
      vendorStoreDetailCardPage.exportSectionReportViaPrint(VendorStore.PARTS, ReportFormat.CSV);
      vendorStoreDetailCardPage.exportSectionReportViaEmail(VendorStore.PARTS, ReportFormat.XML, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Sites section of the Vendor Store Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12770} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 17, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Sites section', { tags: 'vendor-store-sites' }, () => {
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
      vendorStoreDetailCardPage.goToSection(VendorStore.SITES);
      vendorStoreDetailCardPage.createVendorStoreSite();
      vendorStoreDetailCardPage.exportSectionReportViaPrint(VendorStore.SITES, ReportFormat.CSV);
      vendorStoreDetailCardPage.exportSectionReportViaEmail(VendorStore.SITES, ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      vendorStoreDetailCardPage.setRecordToInactive(VendorStore.SITES);
    });

    /**
     * Checks the Site GL Specifications section of the Vendor Store Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/17371} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 17, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 16, 2023
     */
    it('checks the Site GL Specifications section', { tags: 'vendor-store-gl-specs' }, () => {
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
      vendorStoreDetailCardPage.goToSection(VendorStore.SITES);
      vendorStoreDetailCardPage.createVendorStoreSite();
      cy.wait(3000);
      vendorStoreDetailCardPage.goToSection(VendorStore.SITE_GL_SPECIFICATIONS);
      vendorStoreDetailCardPage.createVendorSiteGlSpecifications();
    });

    /**
     * Checks the Export Reports functionality of the Vendor Store Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18284} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 23, 2023
     */
    it('checks the Export Reports functionality', { tags: 'vendor-store-export' }, () => {
      listCardPage.searchRecord(vendorStoreNameColumn, vendorStoreName);
      vendorStoreDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });
  });
});
