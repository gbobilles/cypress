import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { PurchaseRequisition } from "cypress/support/enums/inv/purchaseRequisition";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PurchaseRequisitionDetailCard } from "cypress/support/pages/operations/inv/purchaseRequisitionDetailCard.page";
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'PurchaseRequisition'], () => {
  describe('Purchase Requisition Detail Card', () => {
    const listCardPage = new ListCard();
    const purchaseRequisitionDetailCardPage = new PurchaseRequisitionDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = purchaseRequisitionDetailCardPage.getDetailCardLocators();
    const commonLocators = purchaseRequisitionDetailCardPage.getCommonLocators();
    const reqIdColumn = 'purchaseRequisitionIdentifier';
    let reqId = null;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(PurchaseRequisition.PURCHASE_REQUISITIONS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementVisible(listCardLocators.continueButton).then($visible => {
        if ($visible) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      purchaseRequisitionDetailCardPage.createPurchaseRequisition();
      cy.wait(5000);
      purchaseRequisitionDetailCardPage.getRequisitionID(PurchaseRequisition.GENERAL).invoke('val').then($data => {
        reqId = $data;
      });
    });

    beforeEach(() => {
      cy.openCardByTitle(PurchaseRequisition.PURCHASE_REQUISITIONS).wait(3000);
    });

    /**
     * Checks the General section of the Purchase Requisition Detail Card and creates a new Purchase Requisition.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/632} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: June 27, 2023
     */
    it('checks the General section and creates a new Purchase Requisition', { tags: 'purchase-requisition-add' }, () => {
      listCardPage.searchRecord(reqIdColumn, reqId);
    });

    it('checks the Parts section', { tags: 'purchase-requisition-parts' }, () => {
      listCardPage.searchRecord(reqIdColumn, reqId);
      purchaseRequisitionDetailCardPage.goToSection(PurchaseRequisition.PARTS);
      purchaseRequisitionDetailCardPage.createParts();
    });

    it('checks the Documents section', { tags: 'purchase-requisition-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(reqIdColumn, reqId);
      purchaseRequisitionDetailCardPage.goToSection(PurchaseRequisition.DOCUMENTS);
      purchaseRequisitionDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      purchaseRequisitionDetailCardPage.validateUploadedFile(filenameRegex);
      purchaseRequisitionDetailCardPage.deleteUploadedFile();
      purchaseRequisitionDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
      purchaseRequisitionDetailCardPage.exportMainReportViaEmail(ReportFormat.PDF, email.email, email.subject, email.body);
    });

    it('checks Create Purchase Order functionality thru Purchase requisition', { tags: 'purchase-requisition-po' }, () => {
      listCardPage.searchRecord(reqIdColumn, reqId);
      purchaseRequisitionDetailCardPage.createPurchaseOrder();
      purchaseRequisitionDetailCardPage.clickElement(commonLocators.saveButton);
      cy.get(commonLocators.successMessage).contains(purchaseRequisitionDetailCardPage.getCommonConstants().successMessage).should('be.visible');
      purchaseRequisitionDetailCardPage.clickElement(commonLocators.successMessageCloseButton);
    });
  });
});
