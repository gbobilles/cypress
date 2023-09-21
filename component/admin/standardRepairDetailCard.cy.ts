import { StandardRepair } from "cypress/support/enums/admin/standardRepair";
import { StandardRepairDetailCard } from "cypress/support/pages/admin/standardRepairDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import standardRepair from "../../fixtures/admin/createStandardRepair.json";
import TestFilters from "../../support/utils/filterTest";
import MathUtils from "../../support/utils/mathUtils";

TestFilters(['regression', 'standardRepairs'], () => {
  describe('Standard Repairs Detail Card', () => {
    const listCardPage = new ListCard();
    const standardRepairDetailCardPage = new StandardRepairDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = standardRepairDetailCardPage.getDetailCardLocators();
    const standardRepairIdentifier = standardRepair.standardRepairIdentifier + MathUtils.generateRandomNumber(5);
    const standardRepairIdentifierColumn = 'standardRepairIdentifier';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openAdminCardByTitle(StandardRepair.STANDARD_REPAIRS).wait(5000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(2000);
        }
      });
      standardRepairDetailCardPage.createStandardRepair(
        standardRepairIdentifier,
        standardRepair.oemRepairTime,
        standardRepair.thirdPartyPublisherRepairTime,
        standardRepair.companyRepairTime,
        standardRepair.averageRepairTime
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(StandardRepair.STANDARD_REPAIRS);
    });

    /**
     * Checks the General section of the Standard Repairs Detail Card and creates a new Standard Repair.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3764} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 29, 2023
     */
    it('checks the General section and creates a new Standard Repair', { tags: 'standard-repairs-add' }, () => {
      listCardPage.searchRecord(standardRepairIdentifierColumn, standardRepairIdentifier);
    });

    /**
     * Checks the Documents section of the Standard Repairs Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3764} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 29, 2023
     */
    it('checks the Documents section', { tags: 'standard-repairs-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(standardRepairIdentifierColumn, standardRepairIdentifier);
      standardRepairDetailCardPage.goToSection(StandardRepair.DOCUMENTS);
      standardRepairDetailCardPage.getDetailCardElements().sectionContainer(StandardRepair.DOCUMENTS).should('be.visible');
      standardRepairDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      standardRepairDetailCardPage.validateUploadedFile(filenameRegex);
      standardRepairDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Parts section of the Standard Repairs Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3764} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 29, 2023
     */
    it('checks the Parts section', { tags: 'standard-repairs-parts' }, () => {
      listCardPage.searchRecord(standardRepairIdentifierColumn, standardRepairIdentifier);
      standardRepairDetailCardPage.goToSection(StandardRepair.PARTS);
      standardRepairDetailCardPage.createPart(1);
    });

    /**
     * Checks the PMs section of the Standard Repairs Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3764} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 29, 2023
     */
    it('checks the PMs section', { tags: 'standard-repairs-pms' }, () => {
      listCardPage.searchRecord(standardRepairIdentifierColumn, standardRepairIdentifier);
      standardRepairDetailCardPage.goToSection(StandardRepair.PMS);
      standardRepairDetailCardPage.createPm();
    });

    /**
     * Checks the PM Intervals section of the Standard Repairs Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3764} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 29, 2023
     */
    it('checks the PM Intervals section', { tags: 'standard-repairs-pm-intervals' }, () => {
      listCardPage.searchRecord(standardRepairIdentifierColumn, standardRepairIdentifier);
      standardRepairDetailCardPage.goToSection(StandardRepair.PM_INTERVALS);
      standardRepairDetailCardPage.createPmInterval();
    });

    /**
     * Checks the General section of the Standard Repairs Detail Card and edits and existing Standard Repair.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3765} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 29, 2023
     */
    it('checks the General section and edits an existing Standard Repair', { tags: 'standard-repairs-edit' }, () => {
      const newStandardRepairIdentifier = standardRepair.standardRepairIdentifier + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(standardRepairIdentifierColumn, standardRepairIdentifier);
      standardRepairDetailCardPage.editStandardRepair(newStandardRepairIdentifier);
      cy.closeCardByTitle(StandardRepair.STANDARD_REPAIR + newStandardRepairIdentifier);
      listCardPage.searchRecord(standardRepairIdentifierColumn, newStandardRepairIdentifier);
    });
  });
});
