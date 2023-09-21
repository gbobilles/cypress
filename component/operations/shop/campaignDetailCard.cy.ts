import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Campaign } from "cypress/support/enums/shop/campaign";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { CampaignDetailCard } from "cypress/support/pages/operations/shop/campaignDetailCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'campaigns'], () => {
  describe('Campaign Detail Card', () => {
    const listCardPage = new ListCard();
    const campaignDetailCardPage = new CampaignDetailCard();
    const assetDetailCardPage = new AssetDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const compaignDetailCardLocators = campaignDetailCardPage.getLocators();
    const detailCardLocators = campaignDetailCardPage.getDetailCardLocators();
    const commonLocators = assetDetailCardPage.getCommonLocators();
    const name = 'campaign' + MathUtils.generateRandomNumber(5);
    const id = 'campaign' + MathUtils.generateRandomNumber(5);
    const campaignNameColumn = 'campaignName'
    const emailRecipient = email.email;
    const emailSubject = email.subject;
    const emailBody = email.body;
    let lockWarning: any;

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
     * Checks the General section of the Campaign Detail Card and creates a new Campaign.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/3943} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: August 28, 2023
     */
    it('checks the General section and creates a new Campaign', { tags: 'campaign-add' }, () => {
      listCardPage.searchRecord(campaignNameColumn, name);
    });

    it('checks the Standard Repairs section', { tags: 'campaign-standard-repairs' }, () => {
      const standardRepairColumn = 'standardRepair_standardRepairIdentifier';
      listCardPage.searchRecord(campaignNameColumn, name);
      campaignDetailCardPage.verifyCardByTitle(Campaign.Campaign);
      campaignDetailCardPage.goToSection(Campaign.STANDARD_REPAIRS);
      assetDetailCardPage.createStandardRepair();
      campaignDetailCardPage.sortColumn(Campaign.STANDARD_REPAIRS, standardRepairColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      campaignDetailCardPage.sortColumn(Campaign.STANDARD_REPAIRS, standardRepairColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      campaignDetailCardPage.exportSectionReportViaPrint(Campaign.STANDARD_REPAIRS, ReportFormat.XML);
      campaignDetailCardPage.exportSectionReportViaEmail(Campaign.STANDARD_REPAIRS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    it('checks the Edit Campaign and validate lock warning message section', { tags: 'campaign-edit' }, () => {
      listCardPage.searchRecord(campaignNameColumn, name);
      campaignDetailCardPage.goToSection(Campaign.GENERAL);
      campaignDetailCardPage.editCampaign(Status.OPEN, Disposition.SUBMITTED);
      campaignDetailCardPage.getCardTextField(Campaign.ASSETS, compaignDetailCardLocators.lockWarning).invoke('text').then($data => {
        console.log($data.toString());
        lockWarning = $data;
        cy.wrap(lockWarning).as('warning');
      });
      cy.get('@warning').then(lockmessage => {
        expect(lockmessage.toString().replace(/^\s+|\s+$/gm, '')).to.eq('Once a Campaign is submitted, Assets may not be modified.');
      });
    });

    it('checks the Documents section', { tags: 'campaign-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(campaignNameColumn, name);
      campaignDetailCardPage.goToSection(Campaign.DOCUMENTS);
      campaignDetailCardPage.getDetailCardElements().sectionContainer(Campaign.DOCUMENTS).should('be.visible');
      campaignDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      campaignDetailCardPage.validateUploadedFile(filenameRegex);
      campaignDetailCardPage.deleteUploadedFile();
    });
  });
});
