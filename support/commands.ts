import * as util from 'util';
import credentials from '../fixtures/auth/credentials.json';
import { MenuSection } from './enums/common/navigationMenu/menuSection';

Cypress.Commands.add('visitDossier', () => {
  const baseUrl = Cypress.env('baseUrl');
  cy.visit(baseUrl);
});

Cypress.Commands.add('loginToDossier', () => {
  cy.get('[id=txtEmail]').type(Cypress.env('email'));
  cy.get('[id=Input_Password]').type(Cypress.env('password'));
  cy.contains('button', 'Sign In').click();
});

Cypress.Commands.add('logoutFromDossier', () => {
  cy.get('span.user-name').click();
  cy.contains('li', 'Sign Out').click();
});

Cypress.Commands.add('searchCard', (searchItem: string) => {
  cy.get('input[placeholder=Search]').click({ force: true }).clear().type(searchItem);
});

Cypress.Commands.add('searchCardAndOpen', (searchItem: string) => {
  const exactSearchItem = new RegExp('^' + searchItem + '$' + '|^' + searchItem + ' \\([^)]+\\)$');
  cy.searchCard(searchItem);
  cy.contains('.card-menu-nav-title', exactSearchItem).click().wait(1000);
  cy.contains('span.k-window-title', exactSearchItem).next('div.k-window-actions').children('a[aria-label=window-Maximize]').click({ force: true });
});

Cypress.Commands.add('openCardByTitle', (searchItem: string, closeAllCards: boolean = true) => {
  if (closeAllCards) {
    cy.closeAllCards();
  }

  cy.tapAllCardsMenu();
  cy.searchCardAndOpen(searchItem);
});

Cypress.Commands.add('openOperationsCardByTitle', (searchItem: string, closeAllCards: boolean = true) => {
  const exactSearchItem = new RegExp('^' + searchItem + '$');
  if (closeAllCards) {
    cy.closeAllCards();
  }

  cy.tapAllCardsMenu();
  cy.searchCard(searchItem);
  cy.contains('.card-menu-section-title', MenuSection.OPERATIONS).parent().next('ul').find('.card-menu-nav-title').contains(exactSearchItem).click({ force: true }).wait(1000);
  cy.contains('span.k-window-title', exactSearchItem).next('div.k-window-actions').children('a[aria-label=window-Maximize]').click({ force: true });
});

Cypress.Commands.add('openReportsAndAnalyticsCardByTitle', (searchItem: string, closeAllCards: boolean = true) => {
  const exactSearchItem = new RegExp('^' + searchItem);
  if (closeAllCards) {
    cy.closeAllCards();
  }

  cy.tapAllCardsMenu();
  cy.searchCard(searchItem);
  cy.contains('.card-menu-section-title', MenuSection.REPORTS_AND_ANALYTICS).parent().next('ul').find('.card-menu-nav-title').contains(exactSearchItem).click({ force: true }).wait(1000);
  cy.contains('span.k-window-title', exactSearchItem).next('div.k-window-actions').children('a[aria-label=window-Maximize]').click({ force: true });
});

Cypress.Commands.add('openDashboardCardByTitle', (searchItem: string, closeAllDashboardCards: boolean = true) => {
  const exactSearchItem = new RegExp('^' + searchItem + '$');
  if (closeAllDashboardCards) {
    cy.closeAllDashboardCards();
  }

  cy.tapAllCardsMenu();
  cy.searchCard(searchItem);
  cy.contains('.card-menu-section-title', MenuSection.DASHBOARD).parent().next('ul').find('.card-menu-nav-title').contains(exactSearchItem).click({ force: true }).wait(1000);
});

Cypress.Commands.add('openAdminCardByTitle', (searchItem: string, closeAllCards: boolean = true) => {
  const exactSearchItem = new RegExp('^' + searchItem + '$');
  if (closeAllCards) {
    cy.closeAllCards();
  }

  cy.tapAllCardsMenu();
  cy.searchCard(searchItem);
  cy.contains('.card-menu-section-title', MenuSection.ADMIN).parent().next('ul').find('.card-menu-nav-title').contains(exactSearchItem).click({ force: true }).wait(1000);
});

Cypress.Commands.add('searchCardAndVerifyIfExisting', (searchItem: string, exists: boolean) => {
  cy.searchCard(searchItem);
  cy.get('.card-menu-section-title').find('.card-menu-nav-title').should(exists ? 'exist' : 'not.exist');
});

Cypress.Commands.add('tapAllCardsMenu', () => {
  cy.get('[data-role=tooltip] > .nav-toggle').should('be.visible').click();
});

Cypress.Commands.add('closeCardByTitle', (cardTitle: string) => {
  cy.get('span.k-window-title').contains(cardTitle).next('div.k-window-actions').children('a[aria-label=Close]').click({ force: true });
});

Cypress.Commands.add('closeAllCards', () => {
  cy.get('.main-body').then($body => {
    if ($body.find('a[aria-label=Close]').length > 0) {
      cy.get('a[aria-label=Close]').each(($element) => {
        cy.wrap($element).click({ force: true });
      });
    }
  });
});

Cypress.Commands.add('closeAllDashboardCards', () => {
  cy.get('i[id=dashboard_edit]').invoke('attr', 'class').then($attr => {
    if ($attr.toString().includes('fa-lock')) {
      cy.get('i[id=dashboard_edit]').click({ force: true });
    }
  });

  cy.get('.main-body').then($body => {
    if ($body.find('.card-header').length > 0) {
      cy.get('.card-header').each($element => {
        cy.wrap($element).trigger('mouseover', { force: true });
        cy.get('.card-controls .fa-times').click({ force: true });
      });
    }
  });
});

Cypress.Commands.add('maximizeCard', () => {
  cy.get('.k-i-window-maximize').filter(':visible').click();
});

Cypress.Commands.add('openCardInWindow', (cardTitle: string) => {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
      window.open(url, 'newWindow', 'resizable');
    });
  });
  cy.get('span.k-window-title').contains(cardTitle).next('div.k-window-actions').children('a[aria-label=Popup]').click();
  cy.get('@windowOpen').should('be.called');
});

Cypress.Commands.add('getApiAccessToken', () => {
  const bodyFormat = 'grant_type=%s&username=%s&password=%s&scope=%s';
  return cy.request({
    method: 'POST',
    url: 'https://authtest.d7.dossierondemand.com/connect/token',
    form: true,
    body: util.format(bodyFormat, 'password', credentials.email, credentials.password, 'DossierApi'),
    headers: {
      'authorization': 'Basic ZGV2UGFzc3dvcmRDbGllbnQ6RG9zc2llciQ='
    }
  }).then((response) => {
    return response;
  });
});
