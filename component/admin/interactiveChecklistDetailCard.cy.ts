import { InteractiveChecklist } from "cypress/support/enums/admin/interactiveChecklist";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { InteractiveChecklistDetailCard } from "cypress/support/pages/admin/interactiveChecklistDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import MathUtils from "cypress/support/utils/mathUtils";
import email from "../../fixtures/common/email.json";
import TestFilters from "../../support/utils/filterTest";

TestFilters(['regression', 'checklists'], () => {
  describe('Checklists (Interactive Lists) Detail Card', () => {
    const listCardPage = new ListCard();
    const interactiveChecklistDetailCardPage = new InteractiveChecklistDetailCard();
    const commonLocators = interactiveChecklistDetailCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const name = 'Checklist_' + MathUtils.generateRandomNumber(5);
    const emailRecipient = email.email;
    const emailSubject = email.subject;
    const emailBody = email.body;
    const nameColumn = 'interactiveListName';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(InteractiveChecklist.CHECKLISTS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      interactiveChecklistDetailCardPage.createChecklist(name, 'Work');
    });

    beforeEach(() => {
      cy.openCardByTitle(InteractiveChecklist.CHECKLISTS).wait(3000);
    });

    /**
     * Checks the Checklists (Interactive Lists) Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12809} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: September 1, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: September 14, 2023
     */
    it('checks the General section and creates a new Checklist', { tags: 'interactive-checklist-add' }, () => {
      listCardPage.searchRecord(nameColumn, name);
    });

    it('checks the Steps section', { tags: 'interactive-checklist-steps' }, () => {
      const stepsTypeColumn = 'step_stepName'
      listCardPage.searchRecord(nameColumn, name);
      interactiveChecklistDetailCardPage.goToSection(InteractiveChecklist.STEPS);
      interactiveChecklistDetailCardPage.clickSectionButton(InteractiveChecklist.STEPS, commonLocators.addButton).wait(2000);
      interactiveChecklistDetailCardPage.createStep(0);
      interactiveChecklistDetailCardPage.getStepValue().invoke('val').then($data => {
        const stepName = $data.toString();
        cy.wrap(stepName).as('stepName');
      });
      interactiveChecklistDetailCardPage.clickSectionButton(InteractiveChecklist.STEPS, commonLocators.saveButton);
      cy.get('@stepName').then(stepName => {
        interactiveChecklistDetailCardPage.getDetailCardElements().sectionContainerElements(InteractiveChecklist.STEPS, commonLocators.table)
          .find('tr')
          .should('have.length.at.least', 1)
          .find('td')
          .should('contain.text', stepName);
      });
      interactiveChecklistDetailCardPage.doubleClickSectionRow(InteractiveChecklist.STEPS, 0, 0);
      interactiveChecklistDetailCardPage.createStep(1);
      interactiveChecklistDetailCardPage.clickSectionButton(InteractiveChecklist.STEPS, commonLocators.saveButton);
      interactiveChecklistDetailCardPage.sortColumn(InteractiveChecklist.STEPS, stepsTypeColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      interactiveChecklistDetailCardPage.sortColumn(InteractiveChecklist.STEPS, stepsTypeColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      interactiveChecklistDetailCardPage.exportSectionReportViaPrint(InteractiveChecklist.STEPS, ReportFormat.XML);
      interactiveChecklistDetailCardPage.exportSectionReportViaEmail(InteractiveChecklist.STEPS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });
  });
});
