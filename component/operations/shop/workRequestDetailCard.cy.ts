import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { WorkOrderType } from "cypress/support/enums/shop/workOrderType";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { TaskDetailCard } from "cypress/support/pages/operations/shop/taskDetailCard.page";
import { WorkRequestDetailCard } from "cypress/support/pages/operations/shop/workRequestDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import workRequest from "../../../fixtures/shop/createWorkRequest.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'workRequest'], () => {
  describe('Work Request Detail Card', () => {
    const listCardPage = new ListCard();
    const workRequestDetailCardPage = new WorkRequestDetailCard();
    const taskDetailCardPage = new TaskDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = workRequestDetailCardPage.getDetailCardLocators();
    const workRequestIdColumn = 'workRequestName';
    let workRequestId = '';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WorkRequest.WORK_REQUESTS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequestWithoutAsset(workRequest).then($workRequestId => {
        workRequestId = $workRequestId.toString();
      });
    });

    beforeEach(() => {
      cy.openCardByTitle(WorkRequest.WORK_REQUESTS).wait(3000);
    });

    /**
     * Checks the General section of the Work Request Detail Card and creates a new Work Request.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the General section and creates a new Work Request', { tags: 'work-request-add' }, () => {
      listCardPage.searchRecord(workRequestIdColumn, workRequestId);
    });

    /**
     * Checks the Tasks section of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Tasks section', { tags: 'work-request-tasks' }, () => {
      listCardPage.searchRecord(workRequestIdColumn, workRequestId);
      workRequestDetailCardPage.goToSection(WorkRequest.TASKS);
      taskDetailCardPage.createTask('New task');
    });

    /**
     * Checks the Standard Repairs section of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Standard Repairs section', { tags: 'work-request-standard-repairs' }, () => {
      listCardPage.searchRecord(workRequestIdColumn, workRequestId);
      workRequestDetailCardPage.goToSection(WorkRequest.STANDARD_REPAIRS);
      workRequestDetailCardPage.createStandardRepair();
    });

    /**
     * Checks the Documents section of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Documents section', { tags: 'work-request-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(workRequestIdColumn, workRequestId);
      workRequestDetailCardPage.goToSection(WorkRequest.DOCUMENTS);
      workRequestDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      workRequestDetailCardPage.validateUploadedFile(filenameRegex);
      workRequestDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Create Internal Work Order functionality of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Create Internal Work Order functionality', { tags: 'work-request-internal-wo' }, () => {
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequestWithoutAsset(workRequest);
      workRequestDetailCardPage.generateWorkOrderFromWorkRequest(WorkOrderType.INTERNAL);
    });

    /**
     * Checks the Create External Work Order functionality of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Create External Work Order functionality', { tags: 'work-request-external-wo' }, () => {
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequestWithoutAsset(workRequest);
      workRequestDetailCardPage.generateWorkOrderFromWorkRequest(WorkOrderType.EXTERNAL);
    });

    /**
     * Checks the Create Work Estimate functionality of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/620} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Create Work Estimate functionality', { tags: 'work-request-work-estimate' }, () => {
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequestWithoutAsset(workRequest);
      workRequestDetailCardPage.generateWorkEstimateFromWorkRequest();
    });

    /**
     * Checks the General section of the Work Request Detail Card and edits an existing Work Request.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3753} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the General section and edits an existing Work Request', { tags: 'work-request-edit' }, () => {
      const updatedDescription = workRequest.description + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(workRequestIdColumn, workRequestId);
      workRequestDetailCardPage.typeWithinField(workRequestDetailCardPage.getLocators().descriptionTextArea, updatedDescription);
      workRequestDetailCardPage.clickElement(workRequestDetailCardPage.getCommonLocators().saveButton);
      cy.closeCardByTitle(WorkRequest.WORK_REQUEST);
      listCardPage.searchRecord('description', updatedDescription);
    });

    /**
     * Checks the Export Reports functionality of the Work Request Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18293} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 20, 2023
     */
    it('checks the Export Reports functionality', { tags: 'work-request-export' }, () => {
      listCardPage.searchRecord(workRequestIdColumn, workRequestId);
      workRequestDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF, 15000);
    });
  });
});
