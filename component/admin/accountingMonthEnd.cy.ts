import { AccountingMonthEnd } from "cypress/support/enums/admin/accountingMonthEnd";
import { AccountingMonthEndDetailCard } from "cypress/support/pages/admin/accountingMonthEndDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'accountingMonthEnd'], () => {
  describe('Accounting Month End Card', () => {
    const listCardPage = new ListCard();
    const accountingMonthEndDetailCardPage = new AccountingMonthEndDetailCard();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(AccountingMonthEnd.ACCOUNTING_MONTH_END);
    });

    /**
     * Checks the Accounting Month End Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12804} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 12, 2023
     */
    it('checks the Accounting Month End Card', { tags: 'accounting-month-end' }, () => {
      listCardPage.doubleClickRecord(0, 0);
      accountingMonthEndDetailCardPage.updateAccountingMonth();
    });
  });
});
