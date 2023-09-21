import MathUtils from "cypress/support/utils/mathUtils";
import { Card } from "../common/card.page";

export class DashboardCard extends Card {

  private constants: { [key: string]: string } = {
    noDataInCard: 'No data in card'
  }

  private locators: { [key: string]: string } = {
    canvas: 'canvas',
    closeDashboardCardIcon: '.card-controls .fa-times',
    dashboardCard: '.dashboard-card',
    dashboardCardTitle: '.dashboard-card .card-title',
    dataWithSubtitles: '.data-with-subtitles',
    expandDashboardCardIcon: '.card-controls .fa-external-link',
    listCardTotalItems: '.k-pager-info.k-label'
  }

  getLocators(): any {
    return this.locators;
  }

  checkDashboardCardWithNumber(dashboardCardTitle: string): Cypress.Chainable<string> {
    cy.get(this.locators.dashboardCardTitle).contains(dashboardCardTitle).should('be.visible').wait(2000);
    cy.get(this.locators.dashboardCardTitle).contains(dashboardCardTitle).parentsUntil(this.locators.dashboardCard).find(this.locators.dataWithSubtitles).invoke('text').as('value');
    cy.get('@value').as('value').then((value) => {
      const number = value.toString();
      cy.get(this.locators.dashboardCardTitle).contains(dashboardCardTitle).parentsUntil(this.locators.dashboardCard).find(this.locators.dataWithSubtitles).click({ force: true }).wait(7000);
      cy.get(this.locators.listCardTotalItems).invoke('text').as('total');
      cy.get('@total').then((total) => {
        const items = total.toString().split(' ');
        const totalItems = items[items.length - 2];
        expect(number.replace(/\s+/g, '')).to.eq(totalItems);
      });
    });
    cy.closeAllCards().wait(2000);
    return cy.get('@value').then(value => {
      if (value === undefined || value === null) {
        return this.constants.noDataInCard;
      }

      return value.toString().trim();
    });
  }

  checkDashboardCardWithPieChart(filteredColumn: string): Cypress.Chainable<string> {
    cy.get(this.locators.dashboardCard).find(this.locators.canvas).should('be.visible').wait(1000);
    cy.get(this.locators.canvas).parent().then(($element: any) => {
      const chartContainer = $element.get(0)._kendoExportVisual();
      const pieChart = chartContainer.children[0].chartElement.children[1].children[1];
      const pieChartLength = pieChart.children.length;
      if (pieChartLength > 0) {
        const randomPiePiece = MathUtils.randomIntFromInterval(0, pieChartLength - 1);
        const piePiece = pieChart.children[randomPiePiece];
        const pieCategory = piePiece.category;
        piePiece.click(chartContainer.children[0].chartElement.chart);
        cy.wait(3000);
        this.isElementVisible(this.commonLocators.alertDialog).then($visible => {
          if ($visible) {
            throw new Error(this.commonConstants.generalErrorMessage);
          }
        });
        cy.get('th[data-title="' + filteredColumn + '"]').find(this.commonLocators.columnEllipsis).click({ force: true });
        this.clickVisibleElement(this.commonLocators.columnFilterIcon);
        cy.get(this.commonLocators.columnFilterInputField).invoke('val').as('pie').then(($value: string) => {
          expect(pieCategory).to.eq($value);
        }).wait(2000);
      }
    });
    return cy.get('@pie').then(pie => {
      if (pie === undefined || pie === null) {
        return this.constants.noDataInCard;
      }

      return pie.toString();
    });
  }

  checkDashboardCardWithLineChart(): Cypress.Chainable<string> {
    cy.get(this.locators.dashboardCard).find(this.locators.canvas).should('be.visible').wait(1000);
    return cy.get(this.locators.canvas).parent().then(($element: any) => {
      const chartContainer = $element.get(0)._kendoExportVisual();
      const lineChart = chartContainer.children[0].chartElement.children[0].children[0].children[0];
      const lineChartLength = lineChart.children.length;
      if (lineChartLength > 0) {
        const randomLine = MathUtils.randomIntFromInterval(0, lineChartLength - 1);
        const line = this.getLineByIndex($element, randomLine);
        const lineData = line.children[0].children[1].content;
        line.click(chartContainer.children[0].chartElement.chart);
        cy.wait(2000).then(() => {
          expect(this.getLineByIndex($element, randomLine).options.active).to.eq(false);
          return lineData;
        });
      } else {
        return this.constants.noDataInCard;
      }
    });
  }

  expandDashboardCard(dashboardCardTitle: string): void {
    cy.get(this.locators.dashboardCardTitle).contains(dashboardCardTitle).trigger('mouseover');
    this.clickElement(this.locators.expandDashboardCardIcon).wait(3000);
    this.verifyCardByTitle(dashboardCardTitle);
    cy.closeCardByTitle(dashboardCardTitle);
  }

  closeDashboardCard(dashboardCardTitle: string): void {
    cy.get(this.locators.dashboardCardTitle).contains(dashboardCardTitle).trigger('mouseover');
    this.clickElement(this.locators.closeDashboardCardIcon);
  }

  getLineByIndex(element: any, index: number): any {
    return element.get(0)._kendoExportVisual().children[0].chartElement.children[0].children[0].children[0].children[index];
  }
}
