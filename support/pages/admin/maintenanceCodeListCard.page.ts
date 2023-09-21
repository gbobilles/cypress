import { MaintenanceCode } from "cypress/support/enums/admin/maintenanceCode";
import { ListCard } from "../common/listCard.page";

export class MaintenanceCodeListCard extends ListCard {

  private locators: { [key: string]: string } = {
    maintenanceCodeTab: 'div[role=tab]'
  }

  goToTab(tabName: MaintenanceCode): void {
    cy.get(this.locators.maintenanceCodeTab).contains(tabName).click({ force: true });
  }
}
