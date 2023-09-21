import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Personnel } from "cypress/support/enums/pers/personnel";
import { Task } from "cypress/support/enums/shop/task";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PersonnelDetailCard } from "cypress/support/pages/operations/pers/personnelDetailCard.page";
import { TaskDetailCard } from "cypress/support/pages/operations/shop/taskDetailCard.page";
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import { WorkRequestDetailCard } from "cypress/support/pages/operations/shop/workRequestDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import email from "../../../fixtures/common/email.json";
import personnel from "../../../fixtures/pers/createPersonnel.json";
import workRequest from "../../../fixtures/shop/createWorkRequest.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'personnel'], () => {
  describe('Personnel Detail Card', () => {
    const listCardPage = new ListCard();
    const personnelDetailCardPage = new PersonnelDetailCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const workRequestDetailCardPage = new WorkRequestDetailCard();
    const taskDetailCardPage = new TaskDetailCard();
    const commonLocators = listCardPage.getCommonLocators();
    const detailCardLocators = personnelDetailCardPage.getDetailCardLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const personnelDetailCardLocators = personnelDetailCardPage.getLocators();
    const personnelLastName = personnel.lastName + MathUtils.generateRandomNumber(5);
    const personnelLastNameColumn = 'lastName';
    const emailRecipient = email.email;
    const emailSubject = email.subject;
    const emailBody = email.body;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Personnel.PERSONNEL);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      personnelDetailCardPage.createPersonnel(
        personnel.avatarFilename,
        personnelLastName,
        personnel.firstName,
        personnel.middleName,
        MathUtils.generateRandomNumber(8).toString(),
        personnel.notes
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(Personnel.PERSONNEL);
    });

    /**
     * Checks the General section of the Personnel Detail Card and creates a new Personnel.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/605} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 7, 2023
     */
    it('checks the General section and creates a new Personnel', { tags: 'personnel-add' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
    });

    /**
     * Checks the General section of the Personnel Detail Card and edits an existing Personnel.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/607} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 7, 2023
     */
    it('checks the General section and edits an existing Personnel', { tags: 'personnel-edit' }, () => {
      const updatedNotes = personnel.notes + '_' + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.typeWithinField(personnelDetailCardLocators.notesInputField, updatedNotes);
      personnelDetailCardPage.clickVisibleElement(commonLocators.saveButton);
      cy.closeCardByTitle(Personnel.PERSON + personnel.firstName + ' ' + personnel.lastName);
      cy.contains('td', updatedNotes).scrollIntoView().should('be.visible');
    });

    /**
     * Checks the Contact Info section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3238} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 8, 2023
     */
    it('checks the Contact Info section', { tags: 'personnel-contact-info' }, () => {
      const contactInfoName = 'Home';
      const contactInfoPhoneNumber = MathUtils.generateRandomNumber(9).toString();
      const contactInfoEmailAddress = 'elise.sumanga@amcsgroup.com';
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.CONTACT_INFO);
      personnelDetailCardPage.createContactInfoPhoneNumber(contactInfoName, contactInfoPhoneNumber);
      personnelDetailCardPage.createContactInfoEmailAddress(contactInfoName, contactInfoEmailAddress);
      personnelDetailCardPage.createContactInfoAddress(contactInfoName, 'Address 1', 'Address 2', 'New York', MathUtils.generateRandomNumber(4));
      personnelDetailCardPage.deleteContactInfoPhoneNumber();
      personnelDetailCardPage.deleteContactInfoEmailAddress();
      personnelDetailCardPage.deleteContactInfoAddress();
    });

    /**
     * Checks the GL Specifications section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12659} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 8, 2023
     */
    it('checks the GL Specifications section', { tags: 'personnel-gl-specs' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.GL_SPECIFICATIONS);
      personnelDetailCardPage.createGlSpecifications();
      personnelDetailCardPage.deleteGlSpecifications();
    });

    /**
     * Checks the Security Credentials section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3237} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 10, 2023
     */
    it('checks the Security Credentials section', { tags: 'personnel-security-credentials' }, () => {
      const emailAddress = 'elise.sumanga' + MathUtils.generateRandomNumber(5) + '@gmail.com';
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.SECURITY_CREDENTIALS);
      personnelDetailCardPage.createSecurityCredentials(emailAddress, 'Administrator');
    });

    /**
     * Checks the Documents section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12660} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 9, 2023
     */
    it('checks the Documents section', { tags: 'personnel-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.DOCUMENTS);
      personnelDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      personnelDetailCardPage.validateUploadedFile(filenameRegex);
      personnelDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Barcodes section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12661} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: March 14, 2023
     */
    it('checks the Barcodes under the General section', { tags: 'personnel-barcodes' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.GENERAL);
      personnelDetailCardPage.createBarcode('Dossier Barcode 1', 'PERSON000000000049');
    });

    /**
     * Checks the Driver Assignments section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3772} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: March 6, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: July 12, 2023
     */
    it('checks the Driver Assignments section', { tags: 'personnel-driver-assignments' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.DRIVER_ASSIGNMENTS);
      personnelDetailCardPage.createDriverAssignment(800);
      personnelDetailCardPage.exportSectionReportViaPrint(Personnel.DRIVER_ASSIGNMENTS, ReportFormat.XML);
      personnelDetailCardPage.exportSectionReportViaEmail(Personnel.DRIVER_ASSIGNMENTS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Certifications section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3769} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: March 7, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: July 12, 2023
     */
    it('checks the Certifications section', { tags: 'personnel-certifications' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.CERTIFICATIONS);
      personnelDetailCardPage.createCertification();
      personnelDetailCardPage.exportSectionReportViaPrint(Personnel.CERTIFICATIONS, ReportFormat.XML);
      personnelDetailCardPage.exportSectionReportViaEmail(Personnel.CERTIFICATIONS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Certification Endorsements and Restrictions section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12662} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: March 8, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: July 12, 2023
     */
    it('checks the Certification Endorsements and Restrictions section', { tags: 'personnel-endorsements-restrictions' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.CERTIFICATIONS);
      personnelDetailCardPage.createCertification();
      personnelDetailCardPage.goToSection(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS);
      personnelDetailCardPage.createEndorsementAndRestriction('Code_' + MathUtils.generateRandomNumber(5), 'New endorsement/restriction');
      personnelDetailCardPage.exportSectionReportViaPrint(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS, ReportFormat.XML);
      personnelDetailCardPage.exportSectionReportViaEmail(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
    * Checks the Assigned Tasks section of the Personnel Detail Card.
    *
    * @remarks
    * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12663} for the actual test case.
    * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
    *
    * Author: Gabriel Bobilles
    * Date completed: March 30, 2023
    *
    * Updated by: Elise Margaret Sumanga
    * Date updated: July 12, 2023
    */
    it('checks the Assigned Tasks section', { tags: 'personnel-assigned-tasks' }, () => {
      const taskNameColumn = 'task_name';
      const description = workRequest.description + MathUtils.generateRandomNumber(5);
      cy.openCardByTitle(WorkOrder.WORK_ORDERS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workOrderDetailCardPage.createWorkOrder();
      workOrderDetailCardPage.goToSection(WorkOrder.WORK_REQUESTS).wait(2000);
      workOrderDetailCardPage.createWorkRequest(description);
      workRequestDetailCardPage.goToSection(WorkOrder.TASKS).wait(3000);
      workRequestDetailCardPage.doubleClickRecordByText(description).wait(2000);
      taskDetailCardPage.goToSection(Task.ASSIGNED_PERSONNEL).wait(3000);
      taskDetailCardPage.createPersonnel(personnelLastName);
      cy.openCardByTitle(Personnel.PERSONNEL);
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.ASSIGNED_TASKS).wait(3000);
      personnelDetailCardPage.getTableColumnIndex(taskNameColumn).then(index => {
        personnelDetailCardPage.getCommonElements().table().find('td').eq(index).contains(description).should('exist');
      });
      personnelDetailCardPage.exportSectionReportViaPrint(Personnel.ASSIGNED_TASKS, ReportFormat.XML);
      personnelDetailCardPage.exportSectionReportViaEmail(Personnel.ASSIGNED_TASKS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Requested Work section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12664} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: March 8, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: July 12, 2023
     */
    it('checks the Requested Work section', { tags: 'personnel-requested-work' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.goToSection(Personnel.REQUESTED_WORK).wait(3000);
      personnelDetailCardPage.createWorkRequest('New work request');
      personnelDetailCardPage.exportSectionReportViaPrint(Personnel.REQUESTED_WORK, ReportFormat.XML);
      personnelDetailCardPage.exportSectionReportViaEmail(Personnel.REQUESTED_WORK, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Personnel Certifications Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12789} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: April 8, 2023
     */
    it('checks the Personnel Certifications Card', { tags: 'personnel-certifications-card' }, () => {
      cy.openCardByTitle(Personnel.PERSONNEL_CERTIFICATION);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      personnelDetailCardPage.createCertificationViaCard(personnelLastName, 'Air Brakes');
      personnelDetailCardPage.goToSection(Personnel.CERTIFICATION_ENDORSEMENTS_AND_RESTRICTIONS);
      personnelDetailCardPage.createEndorsementAndRestriction('Code_' + MathUtils.generateRandomNumber(5), 'New endorsement/restriction', true);
    });

    /**
     * Checks the Status - Active/Inactive section of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/608} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: March 9, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 31, 2023
     */
    it('checks the Status - Active/Inactive section', { tags: 'personnel-status' }, () => {
      const statusColumn = 'disposition_status_name';
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.setPersonnelStatus(Status.INACTIVE, Disposition.INACTIVE);
      cy.closeAllCards();
      cy.openCardByTitle(Personnel.PERSONNEL);
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName, false);
      listCardPage.clickColumnEllipsis(statusColumn);
      listCardPage.clickElement(commonLocators.columnFilterIcon, -1).wait(2000);
      listCardPage.typeWithinVisibleField(commonLocators.columnFilterInputField, Status.INACTIVE).wait(2000);
      listCardPage.clickVisibleElement(commonLocators.columnFilterButton).wait(3000);
      listCardPage.verifyRecordExists(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.setPersonnelStatus(Status.ACTIVE, Disposition.ACTIVE);
    });

    /**
     * Checks the Export Reports functionality of the Personnel Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18282} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 23, 2023
     */
    it('checks the Export Reports functionality', { tags: 'personnel-export' }, () => {
      listCardPage.searchRecord(personnelLastNameColumn, personnelLastName);
      personnelDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });
  });
});
