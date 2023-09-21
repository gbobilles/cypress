import { AssetCostSummary } from "../../reports/asset/assetCostSummary.page";
import { AssetInstantInsights } from "./assetInstantInsights.page";
import { ListCard } from "../../common/listCard.page";

export class AssetListCard extends ListCard {

  private assetInstantInsightsPage = new AssetInstantInsights();

  private assetCostSummaryPage = new AssetCostSummary();

  showInstantInsights(row: number): void {
    const assetCostSummaryConstants = this.assetCostSummaryPage.getConstants();
    const instantInsightsLocators = this.assetInstantInsightsPage.getLocators();
    this.clickInstantInsights(row).wait(3000);
    this.assetInstantInsightsPage.getElements().instantInsightsWindow().should('be.visible');
    this.assetInstantInsightsPage.clickElement(instantInsightsLocators.assetCostSummaryLink).wait(2000);
    this.assetCostSummaryPage.getElements().assetCostSummaryWindow().should('be.visible');
    cy.closeCardByTitle(assetCostSummaryConstants.assetCostSummary);
    this.assetInstantInsightsPage.clickElement(this.getListCardLocators().instantInsightsWindowCloseButton);
  }
}
