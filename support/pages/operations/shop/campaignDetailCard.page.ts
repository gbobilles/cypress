import { Campaign } from "cypress/support/enums/shop/campaign";
import { Disposition } from 'cypress/support/enums/common/statusDisposition/disposition';
import { Status } from 'cypress/support/enums/common/statusDisposition/status';
import MathUtils from "cypress/support/utils/mathUtils";
import { DetailCard } from "../../common/detailCard.page";

export class CampaignDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    campaignId: 'div[field=campaignIdentifier] input',
    campaignName: 'div[field=campaignName] input',
    requestReason: 'div[field=complaintId] input',
    priorityDropdown: 'div[field=priorityId] input',
    createdByField: 'div[field=createdByPersonId] input',
    descriptionTextArea: 'div[field=description] textarea',
    estimatedHours: 'div[field=estimatedHours] input',
    assetHistory:'.fa-history',
    instruction: '.instructions',
    lockWarning: 'p[class="locked-warning"]'
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }


  createCampaign(name: any, Id: any): void {
    this.typeWithinField(this.locators.campaignId, Id);
    this.typeWithinField(this.locators.campaignName, name);
    this.selectFromDropdownByRandomValue(this.locators.requestReason);
    this.selectFromDropdownByRandomValue(this.locators.priorityDropdown);
    this.selectFromDropdownByRandomValue(this.locators.createdByField);
    this.typeWithinField(this.locators.descriptionTextArea, name + MathUtils.generateRandomNumber(5));
    this.typeWithinField(this.locators.estimatedHours, MathUtils.generateRandomNumber(2)).wait(3000);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  editCampaign(status: Status, disposition: Disposition): void {
    this.selectRecordStatus(Campaign.GENERAL, status);
    this.selectRecordDisposition(Campaign.GENERAL, disposition);
    this.clickElement(this.commonLocators.saveButton).wait(5000);
    this.getTextRecordStatus(Campaign.GENERAL).should('eq', status);
    this.getTextRecordDisposition(Campaign.GENERAL).should('eq', disposition);
  }

}
