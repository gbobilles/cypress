import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PartsInStoreroom } from "cypress/support/enums/inv/partsInStoreroom";
import { PurchaseOrder } from "cypress/support/enums/inv/purchaseOrder";
import { PurchaseReceipt } from "cypress/support/enums/inv/purchaseReceipt";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PurchaseOrderDetailCard } from "cypress/support/pages/operations/inv/purchaseOrderDetailCard.page";
import { PurchaseReceiptDetailCard } from "cypress/support/pages/operations/inv/purchaseReceiptDetailCard.page";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'purchaseReceipt'], () => {
  describe('Purchase Receipt Detail Card', () => {
    const listCardPage = new ListCard();
    const purchaseReceiptDetailCardPage = new PurchaseReceiptDetailCard();
    const purchaseOrderDetailCardPage = new PurchaseOrderDetailCard();
    const commonElements = purchaseReceiptDetailCardPage.getCommonElements();
    const commonLocators = purchaseOrderDetailCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = purchaseReceiptDetailCardPage.getDetailCardLocators();
    const purchaseReceiptIdColumn = 'purchaseReceiptIdentifier';
    let purchaseReceiptId = '';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openOperationsCardByTitle(PurchaseReceipt.PURCHASE_RECEIPTS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      purchaseReceiptDetailCardPage.createPurchaseReceipt('New purchase receipt').then(value => {
        purchaseReceiptId = value.toString();
      });
      cy.closeCardByTitle(PurchaseReceipt.PURCHASE_RECEIPT);
    });

    beforeEach(() => {
      cy.openOperationsCardByTitle(PurchaseReceipt.PURCHASE_RECEIPTS).wait(3000);
    });

    /**
     * Checks the General section of the Purchase Receipt Detail Card and creates a new Purchase Receipt.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18686} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 30, 2023
     */
    it('checks the General section and creates a new Purchase Receipt', { tags: 'purchase-receipt-add' }, () => {
      listCardPage.searchRecord(purchaseReceiptIdColumn, purchaseReceiptId);
    });

    /**
     * Checks the Parts section of the Purchase Receipt Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18686} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 30, 2023
     */
    it('checks the Parts section', { tags: 'purchase-receipt-parts' }, () => {
      listCardPage.searchRecord(purchaseReceiptIdColumn, purchaseReceiptId);
      purchaseReceiptDetailCardPage.goToSection(PurchaseReceipt.PARTS);
      purchaseReceiptDetailCardPage.createPart(5, 150);
    });

    /**
     * Checks the Documents section of the Purchase Receipt Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18686} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 30, 2023
     */
    it('checks the Documents section', { tags: 'purchase-receipt-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(purchaseReceiptIdColumn, purchaseReceiptId);
      purchaseReceiptDetailCardPage.goToSection(PurchaseReceipt.DOCUMENTS);
      purchaseReceiptDetailCardPage.getDetailCardElements().sectionContainer(PurchaseReceipt.DOCUMENTS).should('be.visible');
      purchaseReceiptDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      purchaseReceiptDetailCardPage.validateUploadedFile(filenameRegex);
      purchaseReceiptDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Export Reports functionality of the Purchase Receipt Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18686} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: June 30, 2023
     */
    it('checks the Export Reports functionality', { tags: 'purchase-receipt-export' }, () => {
      listCardPage.searchRecord(purchaseReceiptIdColumn, purchaseReceiptId);
      purchaseReceiptDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF, 10000);
    });

    /**
     * Checks the Purchase Receipt generated from a Purchase Order functionality.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/12761} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 4, 2023
     */
    it('checks the Purchase Receipt generated from a Purchase Order functionality', { tags: 'purchase-receipt-from-purchase-order' }, () => {
      const quantityColumn = 'quantity';
      const partColumn = 'partNumber';
      const partStoreroomColumn = 'partStoreroom';
      const columnsToFilter = [partColumn, partStoreroomColumn];
      cy.openOperationsCardByTitle(PartsInStoreroom.PARTS_IN_STOREROOMS).wait(3000);
      commonElements.table().each(($row: any) => {
        return listCardPage.getTableColumnIndex(quantityColumn).then(quantityIndex => {
          return cy.wrap($row).find('td').eq(Number(quantityIndex)).invoke('text').as('quantity').then($quantity => {
            if ($quantity !== '0.00') {
              listCardPage.getTableColumnIndex(partColumn).then(partIndex => {
                cy.wrap($row).find('td').eq(Number(partIndex)).invoke('text').as('part');
              });
              listCardPage.getTableColumnIndex(partStoreroomColumn).then(partStoreroomIndex => {
                cy.wrap($row).find('td').eq(Number(partStoreroomIndex)).invoke('text').as('partStoreroom');
              });
              return false;
            }
          });
        });
      });
      cy.openOperationsCardByTitle(PurchaseOrder.PURCHASE_ORDERS).wait(3000);
      listCardPage.clickElement(listCardLocators.addButton).wait(3000);
      listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
        }
      });
      cy.get('@partStoreroom').then(partStoreroom => {
        purchaseOrderDetailCardPage.createPurchaseOrderWithPartStoreroom(partStoreroom.toString());
      });
      cy.get('@part').then(part => {
        purchaseOrderDetailCardPage.goToSection(PurchaseOrder.PARTS);
        purchaseOrderDetailCardPage.createSpecificPart(part.toString(), 1, 50);
      });
      purchaseOrderDetailCardPage.receiveParts();
      purchaseReceiptDetailCardPage.verifyCardByTitle(PurchaseReceipt.PURCHASE_RECEIPT);
      purchaseReceiptDetailCardPage.changePurchaseReceiptStatusAndDisposition(Status.CLOSED, Disposition.COMPLETED).wait(3000);
      cy.closeCardByTitle(PurchaseReceipt.PURCHASE_RECEIPT);
      purchaseOrderDetailCardPage.getTextRecordStatus(PurchaseOrder.GENERAL).should('eq', Status.CLOSED);
      purchaseOrderDetailCardPage.getTextRecordDisposition(PurchaseOrder.GENERAL).should('eq', Disposition.FULFILLED);
      cy.openOperationsCardByTitle(PartsInStoreroom.PARTS_IN_STOREROOMS).wait(3000);
      columnsToFilter.forEach((column: string) => {
        listCardPage.clickColumnEllipsis(column);
        listCardPage.clickVisibleElement(commonLocators.columnFilterIcon);
        if (column === partColumn) {
          cy.get('@part').then(part => {
            listCardPage.typeWithinVisibleField(commonLocators.columnFilterInputField, part.toString());
          });
        } else {
          cy.get('@partStoreroom').then(partStoreroom => {
            listCardPage.typeWithinVisibleField(commonLocators.columnFilterInputField, partStoreroom.toString());
          });
        }
        listCardPage.clickVisibleElement(commonLocators.columnFilterButton).wait(2000);
      });
      commonElements.table().each(($row: any) => {
        return listCardPage.getTableColumnIndex(quantityColumn).then(quantityIndex => {
          cy.wrap($row).find('td').eq(Number(quantityIndex)).invoke('text').then($newQuantity => {
            cy.get('@quantity').then($oldQuantity => {
              const oldQuantity = Number($oldQuantity);
              const newQuantity = Number($newQuantity);
              const difference = newQuantity - oldQuantity;
              expect(newQuantity).to.be.greaterThan(oldQuantity);
              expect(difference).to.eq(1);
            });
          });
        });
      });
    });
  });
});
