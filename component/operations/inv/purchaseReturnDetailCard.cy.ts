import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { PartsInStoreroom } from "cypress/support/enums/inv/partsInStoreroom";
import { PurchaseReturn } from "cypress/support/enums/inv/purchaseReturn";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { PurchaseReturnDetailCard } from "cypress/support/pages/operations/inv/purchaseReturnDetailCard.page";
import TestFilters from "../../../support/utils/filterTest";

TestFilters(['regression', 'purchaseReturn'], () => {
  describe('Purchase Return Detail Card', () => {
    const listCardPage = new ListCard();
    const purchaseReturnDetailCardPage = new PurchaseReturnDetailCard();
    const commonElements = purchaseReturnDetailCardPage.getCommonElements();
    const commonLocators = purchaseReturnDetailCardPage.getCommonLocators();
    const listCardLocators = listCardPage.getListCardLocators();
    const detailCardLocators = purchaseReturnDetailCardPage.getDetailCardLocators();
    const purchaseReturnIdColumn = 'purchaseReturnIdentifier';
    const quantityColumn = 'quantity';
    const partColumn = 'partNumber';
    const siteColumn = 'siteName';
    const partStoreroomColumn = 'partStoreroom';
    let purchaseReturnId = '';
    let quantity = '';
    let part = '';
    let site = '';
    let partStoreroom = '';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openOperationsCardByTitle(PartsInStoreroom.PARTS_IN_STOREROOMS).wait(3000);
      commonElements.table().each(($row: any) => {
        return listCardPage.getTableColumnIndex(quantityColumn).then(quantityIndex => {
          return cy.wrap($row).find('td').eq(Number(quantityIndex)).invoke('text').then($quantity => {
            if ($quantity !== '0.00') {
              quantity = $quantity.toString();
              listCardPage.getTableColumnIndex(partColumn).then(partIndex => {
                cy.wrap($row).find('td').eq(Number(partIndex)).invoke('text').then(result => {
                  part = result.toString();
                });
              });
              listCardPage.getTableColumnIndex(siteColumn).then(siteIndex => {
                cy.wrap($row).find('td').eq(Number(siteIndex)).invoke('text').as('site').then(result => {
                  site = result.toString();
                });
              });
              listCardPage.getTableColumnIndex(partStoreroomColumn).then(partStoreroomIndex => {
                cy.wrap($row).find('td').eq(Number(partStoreroomIndex)).invoke('text').as('partStoreroom').then(result => {
                  partStoreroom = result.toString();
                });
              });
              return false;
            }
          });
        });
      });
      cy.get('@site').then(site => {
        cy.get('@partStoreroom').then(partStoreroom => {
          cy.openOperationsCardByTitle(PurchaseReturn.PURCHASE_RETURNS).wait(3000);
          listCardPage.clickElement(listCardLocators.addButton).wait(3000);
          listCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
            if ($exists) {
              listCardPage.clickElement(listCardLocators.continueButton).wait(1000);
            }
          });
          purchaseReturnDetailCardPage.createPurchaseReturn(site.toString(), partStoreroom.toString(), 'Parts', 'New purchase return').then(value => {
            purchaseReturnId = value.toString();
          });
        });
      });
    });

    beforeEach(() => {
      cy.wrap(quantity).as('quantity');
      cy.wrap(part).as('part');
      cy.wrap(site).as('site');
      cy.wrap(partStoreroom).as('partStoreroom');
      cy.openOperationsCardByTitle(PurchaseReturn.PURCHASE_RETURNS).wait(3000);
    });

    /**
     * Checks the General section of the Purchase Return Detail Card and creates a new Purchase Return.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18688} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 3, 2023
     */
    it('checks the General section and creates a new Purchase Return', { tags: 'purchase-return-add' }, () => {
      listCardPage.searchRecord(purchaseReturnIdColumn, purchaseReturnId);
    });

    /**
     * Checks the Parts section of the Purchase Return Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18688} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 3, 2023
     */
    it('checks the Parts section', { tags: 'purchase-return-parts' }, () => {
      listCardPage.searchRecord(purchaseReturnIdColumn, purchaseReturnId);
      purchaseReturnDetailCardPage.goToSection(PurchaseReturn.PARTS);
      cy.get('@part').then(part => {
        purchaseReturnDetailCardPage.createPart(part.toString(), 1);
      });
    });

    /**
     * Checks the Documents section of the Purchase Return Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18688} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 3, 2023
     */
    it('checks the Documents section', { tags: 'purchase-return-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      listCardPage.searchRecord(purchaseReturnIdColumn, purchaseReturnId);
      purchaseReturnDetailCardPage.goToSection(PurchaseReturn.DOCUMENTS);
      purchaseReturnDetailCardPage.getDetailCardElements().sectionContainer(PurchaseReturn.DOCUMENTS).should('be.visible');
      purchaseReturnDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      purchaseReturnDetailCardPage.validateUploadedFile(filenameRegex);
      purchaseReturnDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Export Reports functionality of the Purchase Return Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18688} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 3, 2023
     */
    it('checks the Export Reports functionality', { tags: 'purchase-return-export' }, () => {
      listCardPage.searchRecord(purchaseReturnIdColumn, purchaseReturnId);
      purchaseReturnDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });

    /**
     * Checks the Returned Part functionality of the Purchase Return Detail Card.
     *
     * @remarks
     * @see {@link https://dossiersystems.visualstudio.com/Dossier7/_workitems/edit/18688} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: July 3, 2023
     */
    it('checks the Returned Part functionality', { tags: 'purchase-return-returned-part' }, () => {
      const columnsToFilter = [partColumn, siteColumn, partStoreroomColumn];
      listCardPage.searchRecord(purchaseReturnIdColumn, purchaseReturnId);
      purchaseReturnDetailCardPage.changeStatusAndDisposition(Status.CLOSED, Disposition.FULFILLED);
      cy.openOperationsCardByTitle(PartsInStoreroom.PARTS_IN_STOREROOMS).wait(3000);
      columnsToFilter.forEach((column: string) => {
        listCardPage.clickColumnEllipsis(column);
        listCardPage.clickVisibleElement(commonLocators.columnFilterIcon);
        if (column === partColumn) {
          cy.get('@part').then(part => {
            listCardPage.typeWithinVisibleField(commonLocators.columnFilterInputField, part.toString());
          });
        } else if (column === siteColumn) {
          cy.get('@site').then(site => {
            listCardPage.typeWithinVisibleField(commonLocators.columnFilterInputField, site.toString());
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
              const difference = oldQuantity - newQuantity;
              expect(difference).to.eq(1);
            });
          });
        });
      });
    });
  });
});
