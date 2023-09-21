import { MaintenanceCode } from "cypress/support/enums/admin/maintenanceCode";
import { MaintenanceCodeDetailCard } from "cypress/support/pages/admin/maintenanceCodeDetailCard.page";
import { MaintenanceCodeListCard } from "cypress/support/pages/admin/maintenanceCodeListCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import maintenanceCode from "../../fixtures/admin/createMaintenanceCode.json";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'maintenanceCodes'], () => {
  describe('Maintenance Codes Card', () => {
    const maintenanceCodeListCardPage = new MaintenanceCodeListCard();
    const maintenanceCodeDetailCardPage = new MaintenanceCodeDetailCard();
    const listCardLocators = maintenanceCodeListCardPage.getListCardLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(MaintenanceCode.MAINTENANCE_CODES);
    });

    /**
     * Checks the Maintenance Codes - Work Request Reason Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12793} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Work Request Reason Codes tab', { tags: 'work-request-reason-codes' }, () => {
      const codeColumn = 'complaint_code';
      const code = maintenanceCode.workRequestReasonCode.code + MathUtils.generateRandomNumber(2);
      const description = maintenanceCode.workRequestReasonCode.description;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.WORK_REQUEST_REASON_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createWorkRequestReasonCode(code, description);
      cy.closeCardByTitle(MaintenanceCode.WORK_REQUEST_REASON_CODE);
      maintenanceCodeListCardPage.searchRecord(codeColumn, code);
    });

    /**
     * Checks the Maintenance Codes - Failure Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12794} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Failure Codes tab', { tags: 'failure-codes' }, () => {
      const codeColumn = 'failureCode_code';
      const code = MathUtils.generateRandomString(2);
      const name = maintenanceCode.failureCode.name;
      const example = maintenanceCode.failureCode.example;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.FAILURE_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createFailureCode(code, name, example);
      cy.closeCardByTitle(MaintenanceCode.FAILURE_CODE);
      maintenanceCodeListCardPage.searchRecord(codeColumn, code);
    });

    /**
     * Checks the Maintenance Codes - Position Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12795} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Position Codes tab', { tags: 'position-codes' }, () => {
      const code2dColumn = 'assetPositionCode_code2D';
      const code2d = MathUtils.generateRandomString(2);
      const code4d = MathUtils.generateRandomString(4);
      const description = maintenanceCode.positionCode.description;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.POSITION_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createPositionCode(code2d, code4d, description);
      cy.closeCardByTitle(MaintenanceCode.POSITION_CODE);
      maintenanceCodeListCardPage.searchRecord(code2dColumn, code2d);
    });

    /**
     * Checks the Maintenance Codes - System Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/579} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the System Codes tab', { tags: 'system-codes' }, () => {
      const systemCodeColumn = 'systemCode_code';
      const systemCode = MathUtils.generateRandomString(3);
      const description = maintenanceCode.systemCode.description;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.SYSTEM_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createSystemCode(systemCode, description);
      cy.closeCardByTitle(MaintenanceCode.SYSTEM_CODE);
      maintenanceCodeListCardPage.searchRecord(systemCodeColumn, systemCode);
    });

    /**
     * Checks the Maintenance Codes - Assembly Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3178} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Assembly Codes tab', { tags: 'assembly-codes' }, () => {
      const assemblyCodeColumn = 'assemblyCode_code';
      const assemblyCode = MathUtils.generateRandomString(3);
      const description = maintenanceCode.assemblyCode.description;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.ASSEMBLY_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createAssemblyCode(assemblyCode, description);
      cy.closeCardByTitle(MaintenanceCode.ASSEMBLY_CODE);
      maintenanceCodeListCardPage.searchRecord(assemblyCodeColumn, assemblyCode);
    });

    /**
     * Checks the Maintenance Codes - Component Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12792} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Component Codes tab', { tags: 'component-codes' }, () => {
      const componentCodeColumn = 'componentCode_code';
      const componentCode = MathUtils.generateRandomString(3);
      const description = maintenanceCode.componentCode.description;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.COMPONENT_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createComponentCode(componentCode, description);
      cy.closeCardByTitle(MaintenanceCode.COMPONENT_CODE);
      maintenanceCodeListCardPage.searchRecord(componentCodeColumn, componentCode);
    });

    /**
     * Checks the Maintenance Codes - Work Accomplished Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3179} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Work Accomplished Codes tab', { tags: 'work-accomplished-codes' }, () => {
      const codeColumn = 'workAccomplishedCode_code';
      const code = MathUtils.generateRandomString(2);
      const name = maintenanceCode.workAccomplishedCode.name;
      const definition = maintenanceCode.workAccomplishedCode.definition;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.WORK_ACCOMPLISHED_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createWorkAccomplishedCode(code, name, definition);
      cy.closeCardByTitle(MaintenanceCode.WORK_ACCOMPLISHED_CODE);
      maintenanceCodeListCardPage.searchRecord(codeColumn, code);
    });

    /**
     * Checks the Maintenance Codes - Work Reason Codes tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12796} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Work Reason Codes tab', { tags: 'work-reason-codes' }, () => {
      const codeColumn = 'workReason_code';
      const code = MathUtils.generateRandomString(3);
      const name = maintenanceCode.workReasonCode.name;
      const workType = maintenanceCode.workReasonCode.workType;
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.WORK_REASON_CODES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createWorkReasonCode(code, name, workType);
      cy.closeCardByTitle(MaintenanceCode.WORK_REASON_CODE);
      maintenanceCodeListCardPage.searchRecord(codeColumn, code);
    });

    /**
     * Checks the Maintenance Codes - Priorities tab.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12797} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: September 6, 2023
     */
    it('checks the Priorities tab', { tags: 'priorities' }, () => {
      const nameColumn = 'priority_priorityName';
      const priorityName = maintenanceCode.priorities.priorityName + MathUtils.generateRandomNumber(5);
      maintenanceCodeListCardPage.goToTab(MaintenanceCode.PRIORITIES);
      maintenanceCodeListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      maintenanceCodeDetailCardPage.createPriority(priorityName);
      cy.closeCardByTitle(MaintenanceCode.PRIORITIES);
      maintenanceCodeListCardPage.searchRecord(nameColumn, priorityName);
    });
  });
});
