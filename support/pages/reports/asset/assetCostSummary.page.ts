export class AssetCostSummary {

  private constants: { [key: string]: string } = {
    assetCostSummary: 'Asset Cost Summary',
    assetSummary: 'Asset Summary',
    operatingCostAnalysis: 'Operating Cost Analysis',
    settings: 'Settings'
  }

  private locators: { [key: string]: string } = {
    assetCostDataSummary: '.asset-cost-data-summary',
    assetDropdown: '.asset-cost-data-summary .commands > .asset-select [field=assetId]',
    assetDropdownInput: '.asset-select input',
    assetPage: '.asset-cost-data-summary > .asset-page',
    assetSummary: '.asset-summary-container',
    assetSummaryPicture: '.picture-container',
    assetSummaryFields: '.fields-container',
    expandedAssetDropdown: '.el-select-dropdown[x-placement=bottom-start]',
    fuelAndFluidCostSummary: '.data-summary-table',
    fuelAndFluidCostSummaryHeaders: '.data-summary-table > .summary-header',
    sectionTitle: '.asset-cost-data-summary > .asset-page .asset-specifications-title',
    operatingCostAnalysisCharts: '.asset-cost-data-summary > .asset-page .charts-container',
    settings: '.asset-cost-data-summary .settings-title'
  }

  private elements = {
    assetCostSummaryWindow: () => cy.get('span.k-window-title').contains(this.constants.assetCostSummary),
    assetDropDown: () => cy.get(this.locators.assetDropdown),
    assetDropdownInput: () => cy.get(this.locators.assetDropdownInput),
    assetPage: () => cy.get(this.locators.assetPage),
    assetSummary: () => cy.get(this.locators.assetSummary),
    assetSummaryPicture: () => cy.get(this.locators.assetSummaryPicture),
    assetSummaryFields: () => cy.get(this.locators.assetSummaryFields),
    expandedAssetDropdown: () => cy.get(this.locators.expandedAssetDropdown),
    fuelAndFluidCostSummary: () => cy.get(this.locators.fuelAndFluidCostSummary),
    fuelAndFluidCostSummaryHeaders: () => cy.get(this.locators.fuelAndFluidCostSummaryHeaders),
    settings: () => cy.get(this.locators.settings),
    sectionTitle: () => cy.get(this.locators.sectionTitle),
    operationCostAnalysisCharts: () => cy.get(this.locators.operatingCostAnalysisCharts)
  }

  getConstants(): { [key: string]: string } {
    return this.constants;
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  getElements(): any {
    return this.elements;
  }

  getAssetCostSummaryText(): string {
    return this.constants.assetCostSummary;
  }

  clickAssetDropdown(): void {
    this.elements.assetDropDown().click();
  }

  selectSpecificAsset(index: number): void {
    this.elements.expandedAssetDropdown().find('ul').children('li').eq(index).click();
  }

  typeWithinAssetDropdown(searchString: string): void {
    this.elements.assetDropDown().type(searchString);
    cy.wait(1500);
  }

  verifyAssetCostSummaryWindowIsVisible(): void {
    this.elements.assetCostSummaryWindow().should('be.visible');
  }

  verifySettingsIsVisible(): void {
    this.elements.settings().should('contain.text', this.constants.settings);
    this.elements.assetDropDown().should('be.visible');
  }

  verifyAssetSummaryIsVisible(): void {
    this.elements.assetPage().should('be.visible');
    this.elements.sectionTitle().should('contain.text', this.constants.assetSummary);
  }

  verifyOperatingCostAnalysisIsVisible(): void {
    this.elements.sectionTitle().should('contain.text', this.constants.operatingCostAnalysis);
    this.elements.operationCostAnalysisCharts().scrollIntoView();
    this.elements.operationCostAnalysisCharts().should('be.visible');
  }

  verifySelectedAsset(assetIdTypeSite: string): void {
    this.elements.assetDropdownInput().should('have.attr', 'placeholder', assetIdTypeSite);
  }

  verifyExpandedAssetDropdown(): void {
    this.elements.expandedAssetDropdown().should('be.visible');
    this.elements.expandedAssetDropdown().find('ul').children().should('have.length.at.most', 100);
  }

  verifyFilteredAssetDropdown(filteredAssets: any): void {
    this.elements.expandedAssetDropdown().find('ul').children().each(($element, index) => {
      const assetIdAndType = filteredAssets[index].assetId + ' ' + filteredAssets[index].assetType;
      cy.wrap($element).find('div').first().should('have.text', assetIdAndType);
      cy.wrap($element).find('div').eq(1).should('have.text', filteredAssets[index].site);
    });
  }

  verifyAssetDropdownSorting(): void {
    let assets = [];
    let counter = 0;
    this.elements.expandedAssetDropdown().find('ul').children().each(($element, index, $list) => {
      cy.wrap($element).find('div').first().then(($div) => {
        assets.push($div.text());
        if (++counter === $list.length) {
          expect(assets).to.deep.eq(assets.slice().sort());
        }
      });
    });
  }

  verifyAssetSpecificationsSection(): void {
    const assetSummaryFieldsClass = this.locators.assetSummaryFields.replace('.', '');
    this.elements.assetSummary().should('be.visible');
    this.elements.assetSummaryPicture().should('be.visible');
    this.elements.assetSummaryFields().should('be.visible');
    this.elements.assetSummaryPicture().next().should('have.attr', 'class', assetSummaryFieldsClass);
  }

  verifyFuelAndFluidCostSummaryTable(): void {
    const headers = ['Item', 'Measure', 'MTD', 'YTD', 'Life'];
    this.elements.fuelAndFluidCostSummary().should('be.visible');
    this.elements.fuelAndFluidCostSummaryHeaders().children().each(($element, index) => {
      cy.wrap($element).should('have.text', headers[index]);
    });
  }
}
