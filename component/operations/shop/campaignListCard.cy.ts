import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Campaign } from "cypress/support/enums/shop/campaign";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { CampaignDetailCard } from "cypress/support/pages/operations/shop/campaignDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'campaigns'], () => {
  describe('Campaign List Card', () => {
    const listCardPage = new ListCard();
    const campaignDetailCardPage = new CampaignDetailCard();
    const assetDetailCardPage = new AssetDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = assetDetailCardPage.getCommonLocators();
    const campaignIdColumn = 'campaignIdentifier';
    const name = 'campaign' + MathUtils.generateRandomNumber(5);
    const id = 'campaign' + MathUtils.generateRandomNumber(5);

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Campaign.Campaigns).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      campaignDetailCardPage.createCampaign(name, id);
    });

    beforeEach(() => {
      cy.openCardByTitle(Campaign.Campaigns).wait(3000);
    });

    /**
     * Checks the functionalities of the Campaign List Card including but not limited to pagination,
     * column filters, sorting, grouping, instant insights, export reports, and search and select.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3223} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: August 28, 2023
     */
    it('checks Campaign List Card', { tags: 'campaign-list-card' }, () => {
      const campainName = 'campaignName';
      const emailRecipient = email.email;
      const emailSubject = email.subject;
      const emailBody = email.body;
      const site = 'Campaign Name';
      listCardPage.verifyRecordCount(10);
      listCardPage.paginate(2, 10);
      listCardPage.selectItemsPerPage('50', 50);
      listCardPage.selectItemsPerPage('10', 10);
      listCardPage.verifyColumnFilters();
      listCardPage.sortColumn(campainName, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      listCardPage.sortColumn(campainName, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      listCardPage.showColumn(campainName);
      listCardPage.filterColumn(campainName, 1);
      listCardPage.clearColumnFilter(campainName, 10);
      listCardPage.showInstantInsights(0, campainName);
      listCardPage.groupColumn(site);
      listCardPage.ungroupColumn(site);
      listCardPage.exportReportsViaPrint(ReportFormat.PDF, 15000);
      listCardPage.exportReportsViaPrint(ReportFormat.CSV);
      listCardPage.exportReportsViaPrint(ReportFormat.XML);
      listCardPage.exportReportsViaPrint(ReportFormat.JSON);
      listCardPage.exportReportsViaEmail(ReportFormat.PDF, emailRecipient, emailSubject, emailBody, 15000);
      listCardPage.exportReportsViaEmail(ReportFormat.CSV, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.XML, emailRecipient, emailSubject, emailBody);
      listCardPage.exportReportsViaEmail(ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      listCardPage.searchAndSelect(campaignIdColumn, 'Campaign ID', 'Contains', 'Public');
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      campaignDetailCardPage.getCommonElements().windowTitle().should('contain.text', Campaign.Campaign).and('be.visible');
      cy.closeCardByTitle(Campaign.Campaign);
      campaignDetailCardPage.getCommonElements().windowTitle().should('not.contain.text', Campaign.Campaign);
      cy.openCardInWindow(Campaign.Campaigns);
    });
  });
});
