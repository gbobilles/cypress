import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Vendor } from "cypress/support/enums/vend/vendor";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { VendorDetailCard } from "cypress/support/pages/operations/vend/vendorDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import vendor from "../../../fixtures/vend/createVendor.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'vendor'], () => {
  describe('Vendor Detail Card', () => {
    const listCardPage = new ListCard();
    const vendorDetailCardPage = new VendorDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = vendorDetailCardPage.getDetailCardLocators();
    const vendorName = vendor.name + MathUtils.generateRandomNumber(5);
    const vendorId = vendor.vendorId + MathUtils.generateRandomNumber(5);
    const vendorNameColumn = 'name';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Vendor.VENDORS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      vendorDetailCardPage.createVendor(
        vendorName,
        vendorId,
        vendor.description,
        vendor.notes
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(Vendor.VENDORS);
    });

    /**
     * Checks the General section of the Vendor Detail Card and creates a new Vendor.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3239} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 12, 2023
     */
    it('checks the General section and creates a new Vendor', { tags: 'vendor-add' }, () => {
      listCardPage.searchRecord(vendorNameColumn, vendorName);
    });

    /**
     * Checks the Contact Info section of the Vendor Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12672} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 13, 2023
     */
    it('checks the Contact Info section', { tags: 'vendor-contact-info' }, () => {
      const contactInfoName = 'Home';
      const contactInfoPhoneNumber = MathUtils.generateRandomNumber(9).toString();
      const contactInfoEmailAddress = 'elise.sumanga@amcsgroup.com';
      listCardPage.searchRecord(vendorNameColumn, vendorName);
      vendorDetailCardPage.goToSection(Vendor.CONTACT_INFO);
      vendorDetailCardPage.createContactInfoPhoneNumber(contactInfoName, contactInfoPhoneNumber);
      cy.wait(2000);
      vendorDetailCardPage.createContactInfoEmailAddress(contactInfoName, contactInfoEmailAddress);
      cy.wait(2000);
      vendorDetailCardPage.createContactInfoAddress(contactInfoName, 'Address 1', 'Address 2', 'New York', MathUtils.generateRandomNumber(4));
      vendorDetailCardPage.deleteContactInfoPhoneNumber();
      vendorDetailCardPage.deleteContactInfoEmailAddress();
      vendorDetailCardPage.deleteContactInfoAddress();
    });

    /**
     * Checks the Documents section of the Vendor Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12673} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: April 13, 2023
     */
    it('checks the Documents section', { tags: 'vendor-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(vendorNameColumn, vendorName);
      vendorDetailCardPage.goToSection(Vendor.DOCUMENTS);
      vendorDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      vendorDetailCardPage.validateUploadedFile(filenameRegex);
      vendorDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Vendor Types section of the Vendor Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12674} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 17, 2023
     */
    it('checks the Vendor Types section', { tags: 'vendor-types' }, () => {
      listCardPage.searchRecord(vendorNameColumn, vendorName);
      vendorDetailCardPage.goToSection(Vendor.VENDOR_TYPES);
      vendorDetailCardPage.createVendorTypes();
    });

    /**
     * Checks the Vendor Edit section of the Vendor Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3240} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 20, 2023
     */
    it('checks the Vendor Edit section', { tags: 'vendor-edit' }, () => {
      const contactInfoName = 'Home';
      const contactInfoEmailAddress = 'elise.sumanga@amcsgroup.com';
      listCardPage.searchRecord(vendorNameColumn, vendorName);
      vendorDetailCardPage.goToSection(Vendor.CONTACT_INFO);
      vendorDetailCardPage.createContactInfoEmailAddress(contactInfoName, contactInfoEmailAddress);
      cy.wait(2000);
      const contactInfoNewEmailAddress = 'test@amcsgroup.com';
      vendorDetailCardPage.editContactInfoEmailAddress(contactInfoName, contactInfoNewEmailAddress);
      cy.wait(2000);
    });

    /**
     * Checks the Status/Disposition - Active/Inactive section of the Vendor Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3241} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 24, 2023
     */
    it('checks the Status/Disposition - Active/Inactive section', { tags: 'vendor-status' }, () => {
      const dispposition_status = 'disposition_status_name'
      listCardPage.searchRecord(vendorNameColumn, vendorName);
      vendorDetailCardPage.goToSection(Vendor.VENDOR_STORES);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      vendorDetailCardPage.createVendorStore(MathUtils.generateRandomNumber(5), vendorName);
      vendorDetailCardPage.goToSection(Vendor.GENERAL);
      vendorDetailCardPage.selectRecordStatus(Vendor.GENERAL, Status.INACTIVE);
      vendorDetailCardPage.selectRecordDisposition(Vendor.GENERAL, Disposition.INACTIVE);
      vendorDetailCardPage.clickElement(listCardLocators.snsSaveButton);
      cy.get(vendorDetailCardPage.getCommonLocators().successMessage).contains(vendorDetailCardPage.getCommonConstants().successMessage).should('be.visible');
      vendorDetailCardPage.clickElement(vendorDetailCardPage.getCommonLocators().successMessageCloseButton).wait(3000);
      cy.closeCardByTitle(`Vendor: ${vendorName}`);

      //**Make Vendor Inactive */
      listCardPage.clickColumnEllipsis(dispposition_status);
      cy.wait(1000)
      vendorDetailCardPage.clickElement(vendorDetailCardPage.getCommonLocators().columnFilterIcon, -1);
      cy.wait(1000)
      vendorDetailCardPage.typeWithinField(vendorDetailCardPage.getCommonLocators().columnFilterInputField, 'Inactive', -1);
      vendorDetailCardPage.clickElement(vendorDetailCardPage.getCommonLocators().columnFilterButton, -1).wait(2000);
      vendorDetailCardPage.getTableColumnIndex(vendorNameColumn).then(index => {
        if (true) {
          vendorDetailCardPage.getCommonElements().table().find('td').eq(index).contains(vendorName).should('be.visible');
          vendorDetailCardPage.doubleClickRecordByText(vendorName);
        }
      });
      vendorDetailCardPage.goToSection(Vendor.VENDOR_STORES);
      cy.get(detailCardLocators.statusDisposition).eq(4).should('have.text', 'Inactive');
      cy.get(detailCardLocators.statusDisposition).eq(5).should('have.text', 'Inactive');

      //**Make Vendor Active */
      cy.closeCardByTitle(`Vendor: ${vendorName}`);
      vendorDetailCardPage.doubleClickRecordByText(vendorName);
      vendorDetailCardPage.goToSection(Vendor.GENERAL);
      vendorDetailCardPage.selectRecordStatus(Vendor.GENERAL, Status.ACTIVE);
      vendorDetailCardPage.selectRecordDisposition(Vendor.GENERAL, Disposition.ACTIVE);
      vendorDetailCardPage.clickElement(listCardLocators.snsSaveButton);
      cy.get(vendorDetailCardPage.getCommonLocators().successMessage).contains(vendorDetailCardPage.getCommonConstants().successMessage).should('be.visible');
      vendorDetailCardPage.clickElement(vendorDetailCardPage.getCommonLocators().successMessageCloseButton).wait(3000);
      cy.closeCardByTitle(`Vendor: ${vendorName}`);

      listCardPage.clickColumnEllipsis(dispposition_status);
      cy.wait(1000)
      vendorDetailCardPage.typeWithinField(vendorDetailCardPage.getCommonLocators().columnFilterInputField, 'Active', -1);
      vendorDetailCardPage.clickElement(vendorDetailCardPage.getCommonLocators().columnFilterButton, -1).wait(2000);
      vendorDetailCardPage.getTableColumnIndex(vendorNameColumn).then(index => {
        if (true) {
          vendorDetailCardPage.getCommonElements().table().find('td').eq(index).contains(vendorName).should('be.visible');
          vendorDetailCardPage.doubleClickRecordByText(vendorName);
        }
      });
    });

    /**
     * Checks the Export Reports functionality of the Vendor Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18283} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 23, 2023
     */
    it('checks the Export Reports functionality', { tags: 'vendor-export' }, () => {
      listCardPage.searchRecord(vendorNameColumn, vendorName);
      vendorDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF, 10000);
    });
  });
});
