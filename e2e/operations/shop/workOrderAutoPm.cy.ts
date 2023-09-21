import { Asset } from "cypress/support/enums/asset/asset";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Pm } from "cypress/support/enums/pm/pm";
import { PmStatus } from "cypress/support/enums/pm/pmStatus";
import { Task } from "cypress/support/enums/shop/task";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { WorkOrderType } from "cypress/support/enums/shop/workOrderType";
import { WorkRequest } from "cypress/support/enums/shop/workRequest";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { PmDetailCard } from "cypress/support/pages/operations/pm/pmDetailCard.page";
import { TaskDetailCard } from "cypress/support/pages/operations/shop/taskDetailCard.page";
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import { WorkRequestDetailCard } from "cypress/support/pages/operations/shop/workRequestDetailCard.page";
import DateUtils from "cypress/support/utils/dateUtils";
import asset from "../../../fixtures/asset/createAsset.json";
import workRequest from "../../../fixtures/shop/createWorkRequest.json";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['e2e', 'workOrderAutoPm'], () => {
  describe('E2E workflow - Auto Generated PM Work Request / Internal Work Order', () => {
    const listCardPage = new ListCard();
    const assetDetailCardPage = new AssetDetailCard();
    const pmDetailCardPage = new PmDetailCard();
    const workRequestDetailCardPage = new WorkRequestDetailCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const taskDetailCardPage = new TaskDetailCard();
    const commonLocators = workRequestDetailCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const assetId = asset.id + MathUtils.generateRandomNumber(5);
    const assetIdColumn = 'asset_primaryAssetIdentifier';
    const pmName = '100 Mile PM - ' + MathUtils.generateRandomNumber(5);
    const dueValue = 100;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Pm.PMS).wait(2000);
      listCardPage.clickElement(listCardLocators.addButton);
      pmDetailCardPage.createPmWithIntervalAndMetric(pmName, pmName, 'Miles', dueValue, 20, 10, 10);
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
      assetDetailCardPage.goToSection(Asset.METERS);
      assetDetailCardPage.createMeter('Odometer', 500, DateUtils.getDateTodayMinusMonths(5).toLocaleDateString() + ' 12:00 AM');
      assetDetailCardPage.goToSection(Asset.PMS);
      assetDetailCardPage.createPm(pmName, DateUtils.getDateTodayMinusMonths(5).toLocaleDateString());
      cy.closeCardByTitle(Asset.ASSET_PM_ASSIGNMENT);
      cy.closeCardByTitle('Asset: ' + assetId);
      listCardPage.clickColumnEllipsis(assetIdColumn);
      assetDetailCardPage.clickElement(commonLocators.columnFilterIcon);
      assetDetailCardPage.typeWithinField(commonLocators.columnFilterInputField, assetId);
      assetDetailCardPage.clickElement(commonLocators.columnFilterButton).wait(2000);
      assetDetailCardPage.calculatePmMeterReadings(assetId, pmName, PmStatus.NOT_DUE);
      assetDetailCardPage.goToSection(Asset.METER_READINGS);
      assetDetailCardPage.updateMeterReading('Odometer', 80, DateUtils.getDateTodayMinusMonths(3).toLocaleDateString() + ' 12:00 AM')
    });

    it('checks the E2E workflow - Auto PM Work Request / Internal Work Order', { tags: 'e2e-wo-auto-pm' }, () => {
      cy.openCardByTitle(WorkRequest.WORK_REQUESTS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      workRequestDetailCardPage.createWorkRequestWithPmInterval(workRequest, assetId, pmName, dueValue);
      workRequestDetailCardPage.generateWorkOrderFromWorkRequest(WorkOrderType.INTERNAL);
      workOrderDetailCardPage.goToSection(WorkOrder.TASKS);
      workOrderDetailCardPage.doubleClickSectionRow(WorkOrder.TASKS, 0, 0);
      taskDetailCardPage.editCodes();
      taskDetailCardPage.changeTaskStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
      taskDetailCardPage.saveNewReading(125);
      cy.closeCardByTitle(Task.TASK);
      workOrderDetailCardPage.changeWorkOrderStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED);
    });
  });
});
