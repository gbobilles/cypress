import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Task } from "cypress/support/enums/shop/task";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import DateUtils from "cypress/support/utils/dateUtils";
import MathUtils from "cypress/support/utils/mathUtils";
import workRequest from "../../../fixtures/shop/createWorkRequest.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'workOrder'], () => {
  describe('Work Order Detail Card', () => {
    const listCardPage = new ListCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const workOrderDetailCardLocators = workOrderDetailCardPage.getLocators();
    const detailCardLocators = workOrderDetailCardPage.getDetailCardLocators();
    const workOrderIdColumn = 'workOrderIdentifier';
    let workOrderId = '';
    let description = '';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(WorkOrder.WORK_ORDERS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workOrderDetailCardPage.createWorkOrderWithOutAsset().then($workOrdertId => {
        workOrderId = $workOrdertId.toString();
      });
    });

    beforeEach(() => {
      cy.openCardByTitle(WorkOrder.WORK_ORDERS).wait(3000);
    });

    /**
     * Checks the General section of the Work Order Detail Card and creates a new External Work Order.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 21, 2023
     */
    it('checks the General section and creates a new Work Order', { tags: 'work-order-external-add' }, () => {
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
    });

    /**
     * Checks the Work Request section of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 21, 2023
     */
    it('checks the Work Request section', { tags: 'work-order-work-request' }, () => {
      description = workRequest.description + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.goToSection(WorkOrder.WORK_REQUESTS).wait(2000);
      workOrderDetailCardPage.createWorkRequest(description);
      cy.closeCardByTitle(WorkRequest.WORK_REQUEST);
    });

    /**
     * Checks the Work Hisory section of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the Work History section', { tags: 'work-order-work-history' }, () => {
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.goToSection(WorkOrder.WORK_HISTORY);
      cy.contains(/^WO-[0-9]{5}$/).dblclick({ force: true });
      cy.get(workOrderDetailCardLocators.workOrderIdInputField).should('be.visible');
      cy.closeCardByTitle(WorkOrder.WORK_ORDER);
    });

    /**
     * Checks the Task section of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the Tasks section', { tags: 'work-order-task' }, () => {
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.goToSection(WorkOrder.TASKS);
      cy.contains(description).dblclick({ force: true });
      workOrderDetailCardPage.verifyCardByTitle(Task.TASK + `: ${description}`);
      cy.closeCardByTitle(Task.TASK);
    });

    /**
     * Checks the Meter Readings section of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the Meter Readings section', { tags: 'work-order-meter-readings' }, () => {
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.goToSection(WorkOrder.METER_READINGS);
      workOrderDetailCardPage.updateMeterReading('Regression', 80, DateUtils.getDateTodayMinusMonths(3).toLocaleDateString() + ' 12:00 AM');
    });

    /**
     * Checks the To Do section of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the To Do section', { tags: 'work-order-to-do' }, () => {
      const name = workRequest.description + MathUtils.generateRandomNumber(5);
      description = workRequest.description + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.goToSection(WorkOrder.TO_DO);
      workOrderDetailCardPage.createToDo(name, description);
      cy.get(workOrderDetailCardLocators.todoItemList).should('be.visible');
    });

    /**
     * Checks the Documents section of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/613} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: July 24, 2023
     */
    it('checks the Documents section', { tags: 'work-order-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.goToSection(WorkOrder.DOCUMENTS);
      workOrderDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      workOrderDetailCardPage.validateUploadedFile(filenameRegex);
      workOrderDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Export Reports functionality of the Work Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18294} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: August 2, 2023
     */
    it('checks the Export Reports functionality', { tags: 'work-order-export' }, () => {
      listCardPage.searchRecord(workOrderIdColumn, workOrderId);
      workOrderDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });
  });
});
