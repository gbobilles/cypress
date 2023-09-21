import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { BlanketPurchaseOrder } from "cypress/support/enums/inv/blanketPurchaseOrder";
import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { BlanketPurchaseOrderDetailCard } from "cypress/support/pages/operations/inv/blanketPurchaseOrderDetailCard.page";
import { PurchaseOrderDetailCard } from "cypress/support/pages/operations/inv/purchaseOrderDetailCard.page";
import email from "../../../fixtures/common/email.json";
import blankPO from "../../../fixtures/inv/createBlankPO.json";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['regression', 'blanketPurchaseOrder'], () => {
  describe('Blanket Purchase Order Detail Card', () => {
    const listCardPage = new ListCard();
    const blanketPurchaseOrderDetailCardPage = new BlanketPurchaseOrderDetailCard();
    const purchaseOrderDetailCardPage = new PurchaseOrderDetailCard();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailBlankPurchaseCardLocators = blanketPurchaseOrderDetailCardPage.getLocator();
    const commonLocators = blanketPurchaseOrderDetailCardPage.getCommonLocators();
    const detailCardLocators = blanketPurchaseOrderDetailCardPage.getDetailCardLocators();
    const blankPoColumnName = 'blanketPurchaseOrderName';
    const blankPoName = blankPO.name + MathUtils.generateRandomNumber(5);
    const purchase_order_qty = MathUtils.generateRandomNumber(1);
    const purchase_order_price = MathUtils.generateRandomNumber(2);
    const budgetedAmount = MathUtils.generateRandomNumber(5);
    let budgetPrice: any;
    let totalAmount: any;
    let compute: any;
    let amountTotal: any;
    let remainBalance: any;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(BlanketPurchaseOrder.BLANKET_PURCHASE_ORDERS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementVisible(listCardLocators.continueButton).then($visible => {
        if ($visible) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      blanketPurchaseOrderDetailCardPage.createBlanketPurchaseOrder(blankPoName, `${budgetedAmount}`);
    });

    beforeEach(() => {
      cy.openCardByTitle(BlanketPurchaseOrder.BLANKET_PURCHASE_ORDERS).wait(3000);
    });

    /**
     * Checks the General section of the Blanket Purchase Order Detail Card and creates a new Purchase order.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12799} for the actual test case.
     *
     * Author: Gabriel Lito Bobilles
     * Date completed: June 29, 2023
    */
    it('checks the Purchase Order Creation functionality', { tags: 'blanket-purchase-order-create' }, () => {
      listCardPage.searchRecord(blankPoColumnName, blankPoName);
      blanketPurchaseOrderDetailCardPage.goToSection(BlanketPurchaseOrder.PURCHASE_ORDERS);
      blanketPurchaseOrderDetailCardPage.clickSectionButton(BlanketPurchaseOrder.PURCHASE_ORDERS, commonLocators.addButton).wait(5000);
      blanketPurchaseOrderDetailCardPage.isElementVisible(listCardLocators.continueButton).then($visible => {
        if ($visible) {
          blanketPurchaseOrderDetailCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      purchaseOrderDetailCardPage.createPurchaseOrder();
      cy.wait(5000);
      purchaseOrderDetailCardPage.goToSection(PurchaseOrder.PARTS);
      purchaseOrderDetailCardPage.createParts(`${purchase_order_qty}`, `${purchase_order_price}`);
      cy.wait(5000);
      purchaseOrderDetailCardPage.doubleClickRow(0, 0).wait(5000);
      cy.closeCardByTitle(PurchaseOrder.PURCHASE_ORDER);
      blanketPurchaseOrderDetailCardPage.clickElement(commonLocators.saveButton);
      cy.get(blanketPurchaseOrderDetailCardPage.getCommonLocators().successMessage).contains(blanketPurchaseOrderDetailCardPage.getCommonConstants().successMessage).should('be.visible');
      blanketPurchaseOrderDetailCardPage.clickElement(blanketPurchaseOrderDetailCardPage.getCommonLocators().successMessageCloseButton);
      blanketPurchaseOrderDetailCardPage.goToSection(BlanketPurchaseOrder.GENERAL);
      cy.wait(3000);
      blanketPurchaseOrderDetailCardPage.getCardTextField(PurchaseOrder.GENERAL, detailBlankPurchaseCardLocators.budgetedAmount).invoke('val').then($data => {
        budgetPrice = $data;
        cy.wrap(budgetPrice).as('budgetPrice')
      });
      cy.get('@budgetPrice').then(budgetPrice => {
        expect(budgetPrice.toString().replace(/\,/g, '')).to.eq(`$${budgetedAmount}.00`);
      })
      amountTotal = parseInt(`${purchase_order_qty}`) * parseInt(`${purchase_order_price}`)
      blanketPurchaseOrderDetailCardPage.getCardTextField(PurchaseOrder.GENERAL, detailBlankPurchaseCardLocators.totalAmount).invoke('val').then($data => {
        totalAmount = $data;
        cy.wrap(totalAmount).as('totalAmount')
      });
      cy.get('@totalAmount').then(totalAmount => {
        expect(totalAmount.toString().replace(/\,/g, '')).to.eq(`$${amountTotal}.00`);
      })
      compute = parseInt(budgetedAmount.toString().replace(/\,/g, '')) - amountTotal;
      blanketPurchaseOrderDetailCardPage.getCardTextField(PurchaseOrder.GENERAL, detailBlankPurchaseCardLocators.remainingAmount).invoke('val').then($data => {
        remainBalance = $data;
        cy.wrap(remainBalance).as('remainBalance')
      })
      cy.get('@remainBalance').then(remainBalance => {
        expect(remainBalance.toString().replace(/\,/g, '')).to.eq(`$${compute.toString()}.00`);
      })
    });

    it('checks the Documents section', { tags: 'blanket-purchase-order-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(blankPoColumnName, blankPoName);
      blanketPurchaseOrderDetailCardPage.goToSection(BlanketPurchaseOrder.DOCUMENTS);
      blanketPurchaseOrderDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      blanketPurchaseOrderDetailCardPage.validateUploadedFile(filenameRegex);
      blanketPurchaseOrderDetailCardPage.deleteUploadedFile();
      blanketPurchaseOrderDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
      blanketPurchaseOrderDetailCardPage.exportMainReportViaEmail(ReportFormat.PDF, email.email, email.subject, email.body);
    });
  });
});
