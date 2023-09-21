import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PurchaseOrderDetailCard } from "cypress/support/pages/operations/inv/purchaseOrderDetailCard.page";
import email from "../../../fixtures/common/email.json";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'purchaseOrder'], () => {
  describe('Purchase Order Detail Card', () => {
    const listCardPage = new ListCard();
    const purchaseOrderDetailCardPage = new PurchaseOrderDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = purchaseOrderDetailCardPage.getDetailCardLocators();
    const poIdColumn = 'purchaseOrderIdentifier';
    let poId = null;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openOperationsCardByTitle(PurchaseOrder.PURCHASE_ORDERS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementVisible(listCardLocators.continueButton).then($visible => {
        if ($visible) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      purchaseOrderDetailCardPage.createPurchaseOrder();
      purchaseOrderDetailCardPage.getPurchaseOrderID(PurchaseOrder.GENERAL).invoke('val').then($data => {
        poId = $data;
      });
    });

    beforeEach(() => {
      cy.openOperationsCardByTitle(PurchaseOrder.PURCHASE_ORDERS).wait(3000);
    });

    /**
     * Checks the General section of the Purchase Order Detail Card and creates a new Purchase order.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18685} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: June 28, 2023
     */
    it('checks the General section and creates a new Purchase Order', { tags: 'purchase-order-add' }, () => {
      listCardPage.searchRecord(poIdColumn, poId);
    });

    /**
     * Checks the Parts section of the Purchase Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18685} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: June 28, 2023
     */
    it('checks the Parts section', { tags: 'purchase-order-parts' }, () => {
      listCardPage.searchRecord(poIdColumn, poId);
      purchaseOrderDetailCardPage.goToSection(PurchaseOrder.PARTS);
      purchaseOrderDetailCardPage.createParts();
    });

    /**
     * Checks the Documents section of the Purchase Order Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18685} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: June 28, 2023
     */
    it('checks the Documents section', { tags: 'purchase-order-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(poIdColumn, poId);
      purchaseOrderDetailCardPage.goToSection(PurchaseOrder.DOCUMENTS);
      purchaseOrderDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      purchaseOrderDetailCardPage.validateUploadedFile(filenameRegex);
      purchaseOrderDetailCardPage.deleteUploadedFile();
      purchaseOrderDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
      purchaseOrderDetailCardPage.exportMainReportViaEmail(ReportFormat.PDF, email.email, email.subject, email.body);
    });
  });
});
