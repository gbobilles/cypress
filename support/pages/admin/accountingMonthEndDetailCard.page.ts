import { DetailCard } from "../common/detailCard.page";

export class AccountingMonthEndDetailCard extends DetailCard {

  private locators: { [key: string]: string } = {
    periodStartDatePicker: 'input[placeholder="Period Start Date mm/dd/yyyy"]',
    periodEndDatePicker: 'input[placeholder="Period End Date mm/dd/yyyy"]'
  }

  updateAccountingMonth(): void {
    cy.get(this.locators.periodStartDatePicker).invoke('val').as('periodStartDate');
    cy.get('@periodStartDate').then($value => {
      const periodStartDate = new Date($value.toString());
      const periodLastDay = new Date(periodStartDate.getFullYear(), periodStartDate.getMonth() + 1, 0);
      const currentDate = new Date();
      if (currentDate > periodLastDay && !this.checkIfDateIsBetween(currentDate, periodLastDay)) {
        this.typeWithinField(this.locators.periodEndDatePicker, periodLastDay.toLocaleDateString());
        this.clickElement(this.locators.periodStartDatePicker);
      }
    });
  }

  checkIfDateIsBetween(currentDate: Date, periodEndDate: Date): boolean {
    const currentDateFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentDateLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return periodEndDate >= currentDateFirstDay && periodEndDate <= currentDateLastDay;
  }
}
