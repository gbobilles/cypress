export class FleetCostSummary {

  private constants: { [key: string]: string } = {
    allOrganizationalUnits: 'All Organizational Units',
    fleetCostSummary: 'Fleet Cost Summary',
    fleetSummary: 'Fleet Summary',
    fleetSummaryOu: 'Organizational Unit',
    fleetSummaryNumberOfAssets: 'Number of Assets:',
    fleetSummaryFuelTypesUsed: 'Fuel Types Used:',
    operatingCostAnalysis: 'Operating Cost Analysis',
    settings: 'Settings'
  }

  private locators: { [key: string]: string } = {
    expandedOuDropdown: '.el-select-dropdown[x-placement=bottom-start]',
    fleetCostDataSummary: '.fleet-cost-data-summary',
    fleetPage: '.fleet-cost-data-summary > .fleet-page',
    fleetSummaryOu: '.grid-container > .grid-title',
    fleetSummaryNumberOfAssets: '.grid-container > .asset-count-title',
    fleetSummaryFuelTypesUsed: '.grid-container > .grid-fuel-types-used',
    fuelAndFluidCostSummary: '.data-summary-table',
    fuelAndFluidCostSummaryHeaders: '.data-summary-table > .summary-header',
    fuelTypesTable: '.fuel-types-table',
    operatingCostAnalysisCharts: '.fleet-cost-data-summary > .fleet-page .charts-container',
    ouDropdown: '.fleet-cost-data-summary .commands > .ou-select',
    ouDropdownInput: '.ou-select input',
    sectionTitle: '.fleet-cost-data-summary > .fleet-page .fleet-specifications-title',
    settings: '.fleet-cost-data-summary .title'
  }

  private elements = {
    expandedOuDropdown: () => cy.get(this.locators.expandedOuDropdown),
    fleetCostSummaryWindow: (subtitle: string) => cy.get('span.k-window-title').contains(this.constants.fleetCostSummary + ' - ' + subtitle),
    fleetPage: () => cy.get(this.locators.fleetPage),
    fleetSummaryOu: () => cy.get(this.locators.fleetSummaryOu),
    fleetSummaryNumberOfAssets: () => cy.get(this.locators.fleetSummaryNumberOfAssets),
    fleetSummaryFuelTypesUsed: () => cy.get(this.locators.fleetSummaryFuelTypesUsed),
    fuelAndFluidCostSummary: () => cy.get(this.locators.fuelAndFluidCostSummary),
    fuelAndFluidCostSummaryHeaders: () => cy.get(this.locators.fuelAndFluidCostSummaryHeaders),
    fuelTypesTable: () => cy.get(this.locators.fuelTypesTable),
    operatingCostAnalysisCharts: () => cy.get(this.locators.operatingCostAnalysisCharts),
    ouDropdown: () => cy.get(this.locators.ouDropdown),
    ouDropdownInput: () => cy.get(this.locators.ouDropdownInput),
    sectionTitle: () => cy.get(this.locators.sectionTitle),
    settings: () => cy.get(this.locators.settings)
  }

  getAllOrganizationalUnitsText(): string {
    return this.constants.allOrganizationalUnits;
  }

  getFleetCostSummaryText(): string {
    return this.constants.fleetCostSummary;
  }

  clickOuDropdown(): void {
    this.elements.ouDropdown().click();
  }

  selectSpecificOu(index: number): void {
    this.elements.expandedOuDropdown().find('ul').children('li').eq(index).click();
  }

  typeWithinOuDropdown(searchString: string): void {
    this.elements.ouDropdown().type(searchString);
    cy.wait(1500);
  }

  verifyFleetCostSummaryWindowIsVisible(subtitle: string): void {
    this.elements.fleetCostSummaryWindow(subtitle).should('be.visible');
  }

  verifySettingsIsVisible(): void {
    this.elements.settings().should('contain.text', this.constants.settings);
    this.elements.ouDropdown().should('be.visible');
  }

  verifyFleetSummaryIsVisible(): void {
    this.elements.fleetPage().should('be.visible');
    this.elements.sectionTitle().should('contain.text', this.constants.fleetSummary);
  }

  verifyOperatingCostAnalysisIsVisible(): void {
    this.elements.sectionTitle().should('contain.text', this.constants.operatingCostAnalysis);
    this.elements.operatingCostAnalysisCharts().scrollIntoView();
    this.elements.operatingCostAnalysisCharts().should('be.visible');
  }

  verifyOuDropdownDefaultValue(): void {
    this.elements.ouDropdownInput().should('have.attr', 'placeholder', this.constants.allOrganizationalUnits);
  }

  verifyExpandedOuDropdown(): void {
    this.elements.expandedOuDropdown().should('be.visible');
    this.elements.expandedOuDropdown().find('ul').children().should('have.length.at.most', 100);
  }

  verifyFilteredOuDropdown(organizationalUnit: string): void {
    this.elements.expandedOuDropdown().find('ul').children().first().find('div').first().should('have.text', organizationalUnit);
  }

  verifyOuDropdownSorting(): void {
    let organizationalUnits = [];
    let counter = 0;
    this.elements.expandedOuDropdown().find('ul').children().each(($element, index, $list) => {
      cy.wrap($element).find('div').first().then(($div) => {
        organizationalUnits.push($div.text());
        if (++counter === $list.length) {
          expect(organizationalUnits).to.deep.eq(organizationalUnits.slice().sort());
        }
      });
    });
  }

  verifyFleetSummaryData(organizationalUnit: any): void {
    this.elements.fleetSummaryOu().should('have.text', this.constants.fleetSummaryOu);
    this.elements.fleetSummaryOu().next().should($element =>
      expect($element.text().trim()).to.equal(organizationalUnit.name)
    );
    this.elements.fleetSummaryNumberOfAssets().should('have.text', this.constants.fleetSummaryNumberOfAssets);
    this.elements.fleetSummaryNumberOfAssets().next().should('have.text', organizationalUnit.numberOfAssets);
    this.elements.fleetSummaryFuelTypesUsed().should('have.text', this.constants.fleetSummaryFuelTypesUsed);

    const fuelTypes = organizationalUnit.fuelTypesUsed;
    this.elements.fuelTypesTable().children().each(($element, index) => {
      cy.wrap($element).within(() => {
        cy.get('div').first().should('have.text', fuelTypes[index].type);
        cy.get('div').eq(1).should('have.text', fuelTypes[index].numberOfAssets);
      });
    });
  }

  verifyFuelAndFluidCostSummaryTable(): void {
    const headers = ['Item', 'Measure', 'MTD', 'YTD', 'Life'];
    this.elements.fuelAndFluidCostSummary().should('be.visible');
    this.elements.fuelAndFluidCostSummaryHeaders().children().each(($element, index) => {
      cy.wrap($element).should('have.text', headers[index]);
    });
  }
}
