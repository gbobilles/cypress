import { Asset } from "cypress/support/enums/asset/asset";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Task } from "cypress/support/enums/shop/task";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { WorkOrderType } from "cypress/support/enums/shop/workOrderType";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { TaskDetailCard } from "cypress/support/pages/operations/shop/taskDetailCard.page";
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import { WorkRequestDetailCard } from "cypress/support/pages/operations/shop/workRequestDetailCard.page";
import asset from "../../../fixtures/asset/createAsset.json";
import email from "../../../fixtures/common/email.json";
import workRequest from "../../../fixtures/shop/createWorkRequest.json";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['e2e', 'workOrderInternal'], () => {
  describe('E2E workflow - Work Request / Internal Work Order / PDF Generation', () => {
    const listCardPage = new ListCard();
    const assetDetailCardPage = new AssetDetailCard();
    const workRequestDetailCardPage = new WorkRequestDetailCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const taskDetailCardPage = new TaskDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const assetId = asset.id + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Asset.ASSETS);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
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
        asset.avatarFilename
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(WorkRequest.WORK_REQUESTS).wait(3000);
    });

    it('checks the E2E workflow - Work Request / Internal Work Order / PDF Generation', { tags: 'e2e-internal-wo' }, () => {
      listCardPage.clickElement(listCardLocators.addButton);
      listCardPage.isElementVisible(listCardLocators.continueButton).then($visible => {
        if ($visible) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequest(workRequest, assetId);
      workRequestDetailCardPage.generateWorkOrderFromWorkRequest(WorkOrderType.INTERNAL);
      workOrderDetailCardPage.goToSection(WorkOrder.TASKS);
      workOrderDetailCardPage.doubleClickSectionRow(WorkOrder.TASKS, 0, 0);
      taskDetailCardPage.editCodes();
      taskDetailCardPage.goToSection(Task.LABOR);
      taskDetailCardPage.createLabor(20);
      taskDetailCardPage.goToSection(Task.GENERAL);
      taskDetailCardPage.changeTaskStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
      cy.closeCardByTitle(Task.TASK);
      workOrderDetailCardPage.verifyOpenWorkRequestsAndTasks(0, 0);
      workOrderDetailCardPage.changeWorkOrderStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
      workOrderDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF, 10000);
      workOrderDetailCardPage.exportMainReportViaEmail(ReportFormat.PDF, email.email, email.subject, email.body, 10000);
    });
  });
});
