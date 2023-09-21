import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";
import { PurchaseReceipt } from "cypress/support/enums/inv/purchaseReceipt";
import { PurchaseRequisition } from "cypress/support/enums/inv/purchaseRequisition";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PurchaseRequisitionDetailCard } from "cypress/support/pages/operations/inv/purchaseRequisitionDetailCard.page";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['e2e', 'purchaseRequisitions'], () => {
  describe('E2E workfow - Purchase Request / Purchase Order / Purchase Receipt', () => {
    const listCardPage = new ListCard();
    const purchaseRequisitionDetailCardPage = new PurchaseRequisitionDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const commonLocators = purchaseRequisitionDetailCardPage.getCommonLocators();

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
    });

    beforeEach(() => {
      cy.openCardByTitle(PurchaseRequisition.PURCHASE_REQUISITIONS).wait(3000);
    });

    it('checks the E2E workfow - Purchase Request / Purchase Order / Purchase Receipt', { tags: 'e2e-purchase-requisition' }, () => {
      listCardPage.clickElement(listCardLocators.addButton).wait(2000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      purchaseRequisitionDetailCardPage.createPurchaseRequisition();
      cy.wait(5000);
      purchaseRequisitionDetailCardPage.createParts();
      purchaseRequisitionDetailCardPage.createPurchaseOrder();
      purchaseRequisitionDetailCardPage.clickElement(commonLocators.saveButton);
      cy.get(commonLocators.successMessage).contains(purchaseRequisitionDetailCardPage.getCommonConstants().successMessage).should('be.visible');
      purchaseRequisitionDetailCardPage.clickElement(commonLocators.successMessageCloseButton);
      purchaseRequisitionDetailCardPage.receivedPartsAndChangeDispositionStatus();
      purchaseRequisitionDetailCardPage.clickElement(commonLocators.saveButton);
      cy.get(commonLocators.successMessage).contains(purchaseRequisitionDetailCardPage.getCommonConstants().successMessage).should('be.visible');
      purchaseRequisitionDetailCardPage.clickElement(commonLocators.successMessageCloseButton);
      cy.closeCardByTitle(PurchaseReceipt.PURCHASE_RECEIPT);
      purchaseRequisitionDetailCardPage.getTextRecordStatus(PurchaseRequisition.GENERAL).should('eq', Status.CLOSED);
      purchaseRequisitionDetailCardPage.getTextRecordDisposition(PurchaseRequisition.GENERAL).should('eq', Disposition.FULFILLED);
      cy.closeCardByTitle(PurchaseOrder.PURCHASE_ORDER);
      purchaseRequisitionDetailCardPage.getTextRecordStatus(PurchaseRequisition.GENERAL).should('eq', Status.CLOSED);
      purchaseRequisitionDetailCardPage.getTextRecordDisposition(PurchaseRequisition.GENERAL).should('eq', Disposition.APPROVED);
      cy.closeCardByTitle(PurchaseRequisition.PURCHASE_REQUISITION);
    });
  });
});
