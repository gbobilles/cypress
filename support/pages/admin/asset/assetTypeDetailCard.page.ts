import { AssetType } from "cypress/support/enums/admin/assetType";
import { DetailCard } from "../../common/detailCard.page";

export class AssetTypeDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    typeInputField: 'div[field=type] input'
  }

  createAssetType(type: string): void {
    this.typeWithinField(this.locators.typeInputField, type);
    this.goToSection(AssetType.GENERAL);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }
}
