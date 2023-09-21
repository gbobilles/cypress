import { Dashboard } from "cypress/support/enums/dashboard/dashboard";
import { DashboardCard } from "cypress/support/pages/dashboard/dashboardCard.page";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['smoke', 'dashboard'], () => {
  describe('Dashboard Smoke Tests', () => {
    const dashboardPage = new DashboardCard();
    const filename = 'cypress/downloads/smoke_test_results.csv';
    const encoding = 'utf-8';
    let contents = '';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      contents = 'Card,Chart Type,Element Clicked,Status\n';
    });

    beforeEach(() => {
      cy.closeAllCards();
    });

    after(() => {
      cy.writeFile(filename, contents, encoding);
    });

    afterEach(function () {
      const state = this.currentTest.state;
      contents = contents.concat(state, '\n');
    });

    it('checks the Asset PM Status dashboard card', { tags: 'dashboard-asset-pm-status' }, () => {
      contents = contents.concat(Dashboard.ASSET_PM_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.ASSET_PM_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.ASSET_PM_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.PM_STATUS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Asset Status dashboard card', { tags: 'dashboard-asset-status' }, () => {
      contents = contents.concat(Dashboard.ASSET_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.ASSET_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.ASSET_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Assets Out of Service dashboard card', { tags: 'dashboard-assets-out-of-service' }, () => {
      contents = contents.concat(Dashboard.ASSETS_OUT_OF_SERVICE, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.ASSETS_OUT_OF_SERVICE).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.ASSETS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Campaign Status dashboard card', { tags: 'dashboard-campaign-status' }, () => {
      contents = contents.concat(Dashboard.CAMPAIGN_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.CAMPAIGN_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.CAMPAIGN_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Fuel Cost Trend dashboard card', { tags: 'dashboard-fuel-cost-trend' }, () => {
      contents = contents.concat(Dashboard.FUEL_COST_TREND, ',Line,');
      cy.openDashboardCardByTitle(Dashboard.FUEL_COST_TREND).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.FUEL_COST_TREND);
      dashboardPage.checkDashboardCardWithLineChart().then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Maintenance Cost Trend dashboard card', { tags: 'dashboard-maintenance-cost-trend' }, () => {
      contents = contents.concat(Dashboard.MAINTENANCE_COST_TREND, ',Line,');
      cy.openDashboardCardByTitle(Dashboard.MAINTENANCE_COST_TREND).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.MAINTENANCE_COST_TREND);
      dashboardPage.checkDashboardCardWithLineChart().then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Purchase Orders dashboard card', { tags: 'dashboard-open-purchase-orders' }, () => {
      contents = contents.concat(Dashboard.OPEN_PURCHASE_ORDERS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_PURCHASE_ORDERS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.PURCHASE_ORDERS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Purchase Receipts dashboard card', { tags: 'dashboard-open-purchase-receipts' }, () => {
      contents = contents.concat(Dashboard.OPEN_PURCHASE_RECEIPTS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_PURCHASE_RECEIPTS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.PURCHASE_RECEIPTS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Purchase Requisitions dashboard card', { tags: 'dashboard-open-purchase-requisitions' }, () => {
      contents = contents.concat(Dashboard.OPEN_PURCHASE_REQUISITIONS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_PURCHASE_REQUISITIONS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.PURCHASE_REQUISITIONS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Purchase Returns dashboard card', { tags: 'dashboard-open-purchase-returns' }, () => {
      contents = contents.concat(Dashboard.OPEN_PURCHASE_RETURNS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_PURCHASE_RETURNS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.PURCHASE_RETURNS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Tasks dashboard card', { tags: 'dashboard-open-tasks' }, () => {
      contents = contents.concat(Dashboard.OPEN_TASKS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_TASKS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.TASKS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Work Estimates dashboard card', { tags: 'dashboard-open-work-estimates' }, () => {
      contents = contents.concat(Dashboard.OPEN_WORK_ESTIMATES, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_WORK_ESTIMATES).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.WORK_ESTIMATES).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Work Orders dashboard card', { tags: 'dashboard-open-work-orders' }, () => {
      contents = contents.concat(Dashboard.OPEN_WORK_ORDERS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_WORK_ORDERS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.WORK_ORDERS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Open Work Requests dashboard card', { tags: 'dashboard-open-work-requests' }, () => {
      contents = contents.concat(Dashboard.OPEN_WORK_REQUESTS, ',Number,');
      cy.openDashboardCardByTitle(Dashboard.OPEN_WORK_REQUESTS).wait(3000);
      dashboardPage.checkDashboardCardWithNumber(Dashboard.WORK_REQUESTS).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Purchase Order Status dashboard card', { tags: 'dashboard-purchase-order-status' }, () => {
      contents = contents.concat(Dashboard.PURCHASE_ORDER_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.PURCHASE_ORDER_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.PURCHASE_ORDER_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Purchase Receipt Status dashboard card', { tags: 'dashboard-purchase-receipt-status' }, () => {
      contents = contents.concat(Dashboard.PURCHASE_RECEIPT_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.PURCHASE_RECEIPT_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.PURCHASE_RECEIPT_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Purchase Requisition Status dashboard card', { tags: 'dashboard-purchase-requisition-status' }, () => {
      contents = contents.concat(Dashboard.PURCHASE_REQUISITION_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.PURCHASE_REQUISITION_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.PURCHASE_REQUISITION_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Purchase Return Status dashboard card', { tags: 'dashboard-purchase-return-status' }, () => {
      contents = contents.concat(Dashboard.PURCHASE_RETURN_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.PURCHASE_RETURN_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.PURCHASE_RETURN_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Task Status dashboard card', { tags: 'dashboard-task-status' }, () => {
      contents = contents.concat(Dashboard.TASK_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.TASK_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.TASK_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value + ',');
      });
    });

    it('checks the Work Estimate Status dashboard card', { tags: 'dashboard-work-estimate-status' }, () => {
      contents = contents.concat(Dashboard.WORK_ESTIMATE_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.WORK_ESTIMATE_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.WORK_ESTIMATE_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Work Order Status dashboard card', { tags: 'dashboard-work-order-status' }, () => {
      contents = contents.concat(Dashboard.WORK_ORDER_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.WORK_ORDER_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.WORK_ORDER_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the Work Request Status dashboard card', { tags: 'dashboard-work-request-status' }, () => {
      contents = contents.concat(Dashboard.WORK_REQUEST_STATUS, ',Pie,');
      cy.openDashboardCardByTitle(Dashboard.WORK_REQUEST_STATUS).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.WORK_REQUEST_STATUS);
      dashboardPage.checkDashboardCardWithPieChart(Dashboard.DISPOSITION).then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the YTD Minutes Over 3rd Party Repair Time dashboard card', { tags: 'dashboard-ytd-minutes-over-3rd-party-repair-time' }, () => {
      contents = contents.concat(Dashboard.YTD_MINUTES_OVER_3RD_PARTY_REPAIR_TIME, ',Line,');
      cy.openDashboardCardByTitle(Dashboard.YTD_MINUTES_OVER_3RD_PARTY_REPAIR_TIME).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.YTD_MINUTES_OVER_3RD_PARTY_REPAIR_TIME);
      dashboardPage.checkDashboardCardWithLineChart().then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the YTD Minutes Over Avg. Repair Time dashboard card', { tags: 'dashboard-ytd-minutes-over-avg-repair-time' }, () => {
      contents = contents.concat(Dashboard.YTD_MINUTES_OVER_AVG_REPAIR_TIME, ',Line,');
      cy.openDashboardCardByTitle(Dashboard.YTD_MINUTES_OVER_AVG_REPAIR_TIME).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.YTD_MINUTES_OVER_AVG_REPAIR_TIME);
      dashboardPage.checkDashboardCardWithLineChart().then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the YTD Minutes Over Company Repair Time dashboard card', { tags: 'dashboard-ytd-minutes-over-company-repair-time' }, () => {
      contents = contents.concat(Dashboard.YTD_MINUTES_OVER_COMPANY_REPAIR_TIME, ',Line,');
      cy.openDashboardCardByTitle(Dashboard.YTD_MINUTES_OVER_COMPANY_REPAIR_TIME).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.YTD_MINUTES_OVER_COMPANY_REPAIR_TIME);
      dashboardPage.checkDashboardCardWithLineChart().then(value => {
        contents = contents.concat(value, ',');
      });
    });

    it('checks the YTD Minutes Over OEM Repair Time dashboard card', { tags: 'dashboard-ytd-minutes-over-oem-repair-time' }, () => {
      contents = contents.concat(Dashboard.YTD_MINUTES_OVER_OEM_REPAIR_TIME, ',Line,');
      cy.openDashboardCardByTitle(Dashboard.YTD_MINUTES_OVER_OEM_REPAIR_TIME).wait(3000);
      dashboardPage.expandDashboardCard(Dashboard.YTD_MINUTES_OVER_OEM_REPAIR_TIME);
      dashboardPage.checkDashboardCardWithLineChart().then(value => {
        contents = contents.concat(value, ',');
      });
    });
  });
});
