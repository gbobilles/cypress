import { OrganizationalUnit } from "cypress/support/enums/admin/organizationalUnit";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { OrganizationalUnitDetailCard } from "cypress/support/pages/admin/organizationalUnitDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import organizationalUnit from "../../fixtures/admin/createOrganizationalUnit.json";
import tableOfAuthority from "../../fixtures/admin/createTableOfAuthority.json";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'organizationalUnits'], () => {
  describe('Organizational Units Card', () => {
    const listCardPage = new ListCard();
    const organizationalUnitDetailCardPage = new OrganizationalUnitDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = listCardPage.getCommonLocators();
    const detailCardLocators = organizationalUnitDetailCardPage.getLocators();
    const organizationalUnitName = organizationalUnit.name + MathUtils.generateRandomNumber(5);
    const organizationalUnitNameColumn = 'organizationalUnitName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(OrganizationalUnit.ORGANIZATIONAL_UNITS);
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      organizationalUnitDetailCardPage.createOrganizationalUnit(
        organizationalUnitName,
        organizationalUnit.glSegmentDelimiter,
        organizationalUnit.glCoreAccountSegmentLength
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(OrganizationalUnit.ORGANIZATIONAL_UNITS);
    });

    after(() => {
      cy.openCardByTitle(OrganizationalUnit.ORGANIZATIONAL_UNITS);
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
      organizationalUnitDetailCardPage.selectRecordStatus(OrganizationalUnit.GENERAL, Status.INACTIVE);
      organizationalUnitDetailCardPage.selectRecordDisposition(OrganizationalUnit.GENERAL, Disposition.INACTIVE);
      organizationalUnitDetailCardPage.clickElement(commonLocators.saveButton).wait(2000);
    });

    /**
     * Checks the General section of the Organizational Units Detail Card and creates a new Organizational Unit.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3249} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 7, 2023
     */
    it('checks the General section and creates a new Organizational Unit', { tags: 'organizational-units-add' }, () => {
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
    });

    /**
     * Checks the Settings section of the Organizational Units Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3249} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 7, 2023
     */
    it('checks the Settings section', { tags: 'organizational-units-settings' }, () => {
      const dayOfTheWeek = 'Sunday';
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
      organizationalUnitDetailCardPage.goToSection(OrganizationalUnit.SETTINGS);
      organizationalUnitDetailCardPage.createSetting(dayOfTheWeek);
      cy.closeCardByTitle(OrganizationalUnit.ORGANIZATIONAL_UNIT);
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
      organizationalUnitDetailCardPage.goToSection(OrganizationalUnit.SETTINGS);
      cy.get(detailCardLocators.firstDayOfTheWeekInputSwitch).contains(dayOfTheWeek).parent('label').should('have.class', 'is-active');
    });

    /**
     * Checks the GL Account/Spec Management section of the Organizational Units Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3249} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 7, 2023
     */
    it('checks the GL Account/Spec Management section', { tags: 'organizational-units-gl-account' }, () => {
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
      organizationalUnitDetailCardPage.goToSection(OrganizationalUnit.GL_ACCOUNT);
      organizationalUnitDetailCardPage.goToGlAccountTab(OrganizationalUnit.GL_SEGMENT_DEFINITION);
      organizationalUnitDetailCardPage.clickSectionButton(OrganizationalUnit.GL_ACCOUNT, commonLocators.addButton);
      organizationalUnitDetailCardPage.createGlSegmentDefinition('GL Segment 01', 'Test GL Segment', 2);
      organizationalUnitDetailCardPage.goToGlAccountTab(OrganizationalUnit.GL_CORE_ACCOUNTS);
      organizationalUnitDetailCardPage.clickSectionButton(OrganizationalUnit.GL_ACCOUNT, commonLocators.addButton);
      organizationalUnitDetailCardPage.createGlCoreAccount('AC', 'Account Name');
    });

    /**
     * Checks the Sites section of the Organizational Units Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3249} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 7, 2023
     */
    it('checks the Sites section', { tags: 'organizational-units-sites' }, () => {
      const siteName = 'Site_' + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
      organizationalUnitDetailCardPage.goToSection(OrganizationalUnit.SITES);
      organizationalUnitDetailCardPage.createSite(siteName);
      cy.closeCardByTitle(OrganizationalUnit.SITE);
      organizationalUnitDetailCardPage.getDetailCardElements().sectionContainerElements(OrganizationalUnit.SITES, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', siteName);
    });

    /**
     * Checks the Table of Authority section of the Organizational Units Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3249} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 7, 2023
     */
    it('checks the Table of Authority section', { tags: 'organizational-units-table-of-authority' }, () => {
      const accountingAuthorityGroupName = tableOfAuthority.accountingAuthorityGroupName + MathUtils.generateRandomNumber(5);
      listCardPage.searchRecord(organizationalUnitNameColumn, organizationalUnitName);
      organizationalUnitDetailCardPage.goToSection(OrganizationalUnit.TABLE_OF_AUTHORITY);
      organizationalUnitDetailCardPage.createTableOfAuthority(
        accountingAuthorityGroupName,
        tableOfAuthority.dailyLimit,
        tableOfAuthority.monthlyLimit,
        tableOfAuthority.purchaseOrderLimit,
        tableOfAuthority.internalWorkLimit,
        tableOfAuthority.blanketPurchaseOrderLimit
      );
      organizationalUnitDetailCardPage.goToSection(OrganizationalUnit.ACCOUNTING_AUTHORITY_MEMBERS);
      organizationalUnitDetailCardPage.createAccountingAuthorityMember();
      cy.closeCardByTitle(OrganizationalUnit.ACCOUNTING_AUTHORITY);
      organizationalUnitDetailCardPage.getDetailCardElements().sectionContainerElements(OrganizationalUnit.TABLE_OF_AUTHORITY, commonLocators.table)
        .find('tr')
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', accountingAuthorityGroupName);
    });
  });
});
