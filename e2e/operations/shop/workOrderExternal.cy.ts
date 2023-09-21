import { Asset } from "cypress/support/enums/asset/asset";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";
import { PurchaseReceipt } from "cypress/support/enums/inv/purchaseReceipt";
import { Task } from "cypress/support/enums/shop/task";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { WorkOrderType } from "cypress/support/enums/shop/workOrderType";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { PurchaseOrderDetailCard } from "cypress/support/pages/operations/inv/purchaseOrderDetailCard.page";
import { PurchaseReceiptDetailCard } from "cypress/support/pages/operations/inv/purchaseReceiptDetailCard.page";
import { TaskDetailCard } from "cypress/support/pages/operations/shop/taskDetailCard.page";
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import { WorkRequestDetailCard } from "cypress/support/pages/operations/shop/workRequestDetailCard.page";
import asset from "../../../fixtures/asset/createAsset.json";
import email from "../../../fixtures/common/email.json";
import externalLabor from "../../../fixtures/shop/createExternalLabor.json";
import externalPart from "../../../fixtures/shop/createExternalPart.json";
import workRequest from "../../../fixtures/shop/createWorkRequest.json";
import DateUtils from "../../../support/utils/dateUtils";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['e2e', 'workOrderExternal'], () => {
  describe('E2E workflow - Work Request / External Work Order / Purchase Order / Purchase Receipt / Close Work Order / PDF Generation', () => {
    const listCardPage = new ListCard();
    const assetDetailCardPage = new AssetDetailCard();
    const workRequestDetailCardPage = new WorkRequestDetailCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const taskDetailCardPage = new TaskDetailCard();
    const purchaseOrderDetailCardPage = new PurchaseOrderDetailCard();
    const purchaseReceiptDetailCardPage = new PurchaseReceiptDetailCard();
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

    it('checks the E2E workflow - Work Request / External Work Order / Purchase Order / Purchase Receipt / Close Work Order / PDF Generation', { tags: 'e2e-external-wo' }, () => {
      const statusColumn = 'disposition_status_name';
      const dispositionColumn = 'disposition_dispositionName';
      listCardPage.clickElement(listCardLocators.addButton);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequest(workRequest, assetId);
      workRequestDetailCardPage.generateWorkOrderFromWorkRequest(WorkOrderType.EXTERNAL);
      workOrderDetailCardPage.goToSection(WorkOrder.TASKS);
      workOrderDetailCardPage.doubleClickSectionRow(WorkOrder.TASKS, 0, 0);
      taskDetailCardPage.editCodes();
      taskDetailCardPage.goToSection(Task.EXTERNAL_PARTS);
      taskDetailCardPage.createExternalPart(
        externalPart.description,
        DateUtils.getDateTodayAsString(),
        externalPart.quantity,
        externalPart.cost,
        externalPart.tax,
        externalPart.workDescription
      );
      taskDetailCardPage.createExternalLabor(
        externalLabor.description,
        DateUtils.getDateTodayAsString(),
        externalLabor.hours,
        externalLabor.cost,
        externalLabor.tax,
        externalLabor.workDescription
      );
      cy.closeCardByTitle(Task.TASK);
      workOrderDetailCardPage.generatePurchaseOrderFromWorkOrder();
      purchaseOrderDetailCardPage.editPurchaseOrder();
      purchaseOrderDetailCardPage.receiveServices();
      purchaseReceiptDetailCardPage.changePurchaseReceiptStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
      cy.closeCardByTitle(PurchaseReceipt.PURCHASE_RECEIPT);
      purchaseOrderDetailCardPage.getTextRecordStatus(PurchaseOrder.GENERAL).should('eq', Status.CLOSED);
      purchaseOrderDetailCardPage.getTextRecordDisposition(PurchaseOrder.GENERAL).should('eq', Disposition.FULFILLED);
      cy.closeCardByTitle(PurchaseOrder.PURCHASE_ORDER);
      workOrderDetailCardPage.doubleClickSectionRow(WorkOrder.TASKS, 0, 0);
      taskDetailCardPage.changeTaskStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
      cy.closeCardByTitle(Task.TASK);
      workOrderDetailCardPage.goToSection(WorkOrder.WORK_REQUESTS);
      workOrderDetailCardPage.verifyWorkRequestStatus(statusColumn, dispositionColumn, Status.CLOSED, Disposition.COMPLETED);
      workOrderDetailCardPage.goToSection(WorkOrder.GENERAL);
      workOrderDetailCardPage.verifyOpenWorkRequestsAndTasks(0, 0);
      workOrderDetailCardPage.changeWorkOrderStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
      workOrderDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF, 10000);
      workOrderDetailCardPage.exportMainReportViaEmail(ReportFormat.PDF, email.email, email.subject, email.body, 10000);
    });
  });
});
