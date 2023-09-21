export { };

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to visit the application
       */
      visitDossier(): Chainable<Element>

      /**
       * Custom command to login to the application
       */
      loginToDossier(): Chainable<Element>

      /**
       * Custom command to logout from the application
       */
      logoutFromDossier(): Chainable<Element>

      /**
       * Custom command to search a specific card given the search item
       */
      searchCard(searchItem: string): Chainable<Element>

      /**
       * Custom command to search and open a specific card given the search item
       */
      searchCardAndOpen(searchItem: string): Chainable<Element>

      /**
       * Custom command to close all cards given a boolean flag, search and open a specific card given the search item
       */
      openCardByTitle(searchItem: string, closeAllCards?: boolean): Chainable<Element>

      /**
       * Custom command to close all cards given a boolean flag, search and open a specific operations card given the search item
       */
      openOperationsCardByTitle(searchItem: string, closeAllCards?: boolean): Chainable<Element>

      /**
       * Custom command to close all cards given a boolean flag, search and open a specific reports and analytics card given the search item
       */
      openReportsAndAnalyticsCardByTitle(searchItem: string, closeAllCards?: boolean): Chainable<Element>

      /**
       * Custom command to close all dashboard cards given a boolean flag, search and open a specific dashboard card given the search item
       */
      openDashboardCardByTitle(searchItem: string, closeAllDashboardCards?: boolean): Chainable<Element>

      /**
       * Custom command to close all administration cards given a boolean flag, search and open a specific dashboard card given the search item
       */
      openAdminCardByTitle(searchItem: string, closeAllDashboardCards?: boolean): Chainable<Element>

      /**
       * Custom command to search a specific card given the search item and verify if it exists or not
       */
      searchCardAndVerifyIfExisting(searchItem: string, exists: boolean): Chainable<Element>

      /**
       * Custom command to tap the All Cards menu
       */
      tapAllCardsMenu(): Chainable<Element>

      /**
       * Custom command to close a specific card given the card title
       */
      closeCardByTitle(cardTitle: string): Chainable<Element>

      /**
       * Custom command to close all open cards
       */
      closeAllCards(): Chainable<Element>

      /**
       * Custom command to close all open dashboard cards
       */
      closeAllDashboardCards(): Chainable<Element>

      /**
       * Custom command to maximize currently open card
       */
      maximizeCard(): Chainable<Element>

      /**
       * Custom command to open a card in another window given its title
       */
      openCardInWindow(cardTitle: string): Chainable<Element>

      /**
       * Custom command to get the access token from the API
       */
      getApiAccessToken(): Chainable<Response<any>>
    }
  }
}
