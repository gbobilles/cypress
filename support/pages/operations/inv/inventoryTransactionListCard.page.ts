import { ListCard } from "../../common/listCard.page";

export class InventoryTransactionListCard extends ListCard {

  private constants: { [key: string]: string } = {
    type: 'Type',
    detailDate: 'Detail Date',
    partId: 'Part ID',
    partDescription: 'Part Description',
    site: 'Site',
    partStoreroom: 'Part Storeroom',
    quantity: 'Quantity',
  }

  private locators: { [key: string]: string } = {
    typeColumn: '[data-field="inventoryTransactionHeader_inventoryTransactionType_inventoryTransactionTypeName"]',
    detailDateColumn: '[data-field="detailDate"]',
    partIdColumn: '[data-field="part_manufacturerIdentifier"]',
    partDescriptionColumn: '[data-field="part_description"]',
    siteColumn: '[data-field="inventoryTransactionHeader_partStore_site_name"]',
    partStoreroomColumn: '[data-field="inventoryTransactionHeader_partStore_name"]',
    quantityColumn: '[data-field="quantity"]'
  }

  verifyColumnHeaders(): void {
    cy.get(this.locators.typeColumn).should('contain.text', this.constants.type);
    cy.get(this.locators.detailDateColumn).should('contain.text', this.constants.detailDate);
    cy.get(this.locators.partIdColumn).should('contain.text', this.constants.partId);
    cy.get(this.locators.partDescriptionColumn).should('contain.text', this.constants.partDescription);
    cy.get(this.locators.siteColumn).should('contain.text', this.constants.site);
    cy.get(this.locators.partStoreroomColumn).should('contain.text', this.constants.partStoreroom);
    cy.get(this.locators.quantityColumn).should('contain.text', this.constants.quantity);
  }
}
