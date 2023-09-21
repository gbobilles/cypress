import { PmCompliance } from "cypress/support/enums/pm/pmCompliance";
import { Reports } from "cypress/support/enums/reports/reports";
import { ReportsCard } from "cypress/support/pages/reports/reportsCard.page";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['smoke', 'reports'], () => {
  describe('Reports and Analytics Smoke Tests', () => {
    const reportsCardPage = new ReportsCard();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
    });

    it('checks the Asset Analytics report', { tags: 'report-asset-analytics' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.ASSET_ANALYTICS).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Asset PM Status report', { tags: 'report-asset-pm-status' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.ASSET_PM_STATUS).wait(3000);
      reportsCardPage.checkReportData(Reports.ASSET);
    });

    it('checks the Auditing Events report', { tags: 'report-auditing-events' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.AUDITING_EVENTS).wait(3000);
      reportsCardPage.checkReportData(Reports.AUDITING_EVENT);
    });

    it('checks the General Accounting report', { tags: 'report-general-accounting' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.GENERAL_ACCOUNTING).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Historical Inventory Valuation report', { tags: 'report-historical-inventory-valuation' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.HISTORICAL_INVENTORY_VALUATION).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Part Receipt History report', { tags: 'report-part-receipt-history' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PART_RECEIPT_HISTORY).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Part Usage History report', { tags: 'report-part-usage-history' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PART_USAGE_HISTORY).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Parts Being Returned report', { tags: 'report-parts-being-returned' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PARTS_BEING_RETURNED).wait(3000);
      reportsCardPage.checkReportData(Reports.PURCHASE_RETURN_PART);
    });

    it('checks the Parts on Order report', { tags: 'report-parts-on-order' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PARTS_ON_ORDER).wait(3000);
      reportsCardPage.checkReportData(Reports.PART);
    });

    it('checks the Parts Over Maximum Stocking Level report', { tags: 'report-parts-over-maximum' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PARTS_OVER_MAXIMUM_STOCKING_LEVEL).wait(3000);
      reportsCardPage.checkReportData(Reports.PART_ON_HAND);
    });

    it('checks the Parts Under Minimum Stocking Level report', { tags: 'report-parts-under-minimum' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PARTS_UNDER_MINIMUM_STOCKING_LEVEL).wait(3000);
      reportsCardPage.checkReportData(Reports.PART_ON_HAND);
    });

    it('checks the Permits report', { tags: 'report-permits' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PERMITS).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Personnel Analytics report', { tags: 'report-personnel-analytics' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PERSONNEL_ANALYTICS).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the PM Compliance report', { tags: 'report-pm-compliance' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PM_COMPLIANCE).wait(3000);
      reportsCardPage.checkPmComplianceReport(PmCompliance.PM_COMPLETED_BY_STATUS);
      reportsCardPage.checkPmComplianceReport(PmCompliance.PERFORMANCE_OF_COMPLETED_PMS_DUE_BY_MONTH);
      reportsCardPage.checkPmComplianceReport(PmCompliance.PMS_IN_COMPLIANCE_BY_SITE);
      reportsCardPage.checkPmComplianceReport(PmCompliance.PERCENTAGE_OF_PMS_AND_ASSETS_IN_COMPLIANCE);
      reportsCardPage.checkPmComplianceReport(PmCompliance.PMS_IN_COMPLIANCE);
      reportsCardPage.checkPmComplianceReport(PmCompliance.ASSETS_IN_COMPLIANCE);
      reportsCardPage.checkPmComplianceReport(PmCompliance.DETAIL_BY_SITE);
    });

    it('checks the PM Detail Status report', { tags: 'report-pm-detail-status' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.PM_DETAIL_STATUS).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Search and Select Queries report', { tags: 'report-sns-queries' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.SEARCH_AND_SELECT_QUERIES).wait(3000);
      reportsCardPage.checkReportData(Reports.QUERY);
    });

    it('checks the Waste & Recycling General Accounting report', { tags: 'report-waste-and-recycling' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.WASTE_AND_RECYCLING_GENERAL_ACCOUNTING).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Work Order History report', { tags: 'report-work-order-history' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.WORK_ORDER_HISTORY).wait(3000);
      reportsCardPage.checkReportData();
    });

    it('checks the Work Request Analytics report', { tags: 'report-work-request-analytics' }, () => {
      cy.openReportsAndAnalyticsCardByTitle(Reports.WORK_REQUEST_ANALYTICS).wait(3000);
      reportsCardPage.checkReportData();
    });
  });
});
