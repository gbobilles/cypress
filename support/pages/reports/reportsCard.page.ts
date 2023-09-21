import { Reports } from "cypress/support/enums/reports/reports";
import { ListCard } from "../common/listCard.page";

export class ReportsCard extends ListCard {

  private locators: { [key: string]: string } = {
    sectionHeader: '.details-header > ul > li'
  }

  checkReportData(detailCardTitle?: Reports): void {
    this.isElementExisting(this.commonLocators.table + ' > tr').then($tableExists => {
      if ($tableExists) {
        cy.get(this.listCardLocators.pageInfo).should('be.visible').and('not.have.text', this.listCardConstants.noItemsToDisplay);
        this.isElementExisting(this.commonLocators.table + ' > tr ' + this.commonLocators.gearIcon).then($gearExists => {
          if ($gearExists) {
            this.doubleClickRecord(0, 1).wait(2000);
            this.verifyCardByTitle(detailCardTitle);
            this.isElementVisible(this.commonLocators.alertDialog).then($visible => {
              if ($visible) {
                cy.get(this.commonLocators.alertDialog).should('not.contain.text', this.commonConstants.generalErrorMessage);
              }
            });
          }
        });

        return;
      }

      cy.get(this.listCardLocators.pageInfo).should('be.visible').and('have.text', this.listCardConstants.noItemsToDisplay).wait(2000);
    });
  }

  checkPmComplianceReport(sectionTitle: string): void {
    cy.get(this.locators.sectionHeader).contains(sectionTitle).wait(2000).should('be.visible').click({ force: true });
  }
}
