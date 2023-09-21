import { AssetDetailCard } from "cypress/support/pages/asset/operations/assetDetailCard.page";
import { AssetListCard } from "cypress/support/pages/asset/operations/assetListCard.page"
import { AssetWorkEstimateCard } from "cypress/support/pages/asset/operations/assetWorkEstimate.page";
import TestFilters from '../../../support/utils/filterTest'

Cypress.on('uncaught:exception', () => {
  return false;
});

let windowTitle;

TestFilters(['regression'], () => {
  describe('Asset Details Card', () => {
    const assetDetailCardPage = new AssetDetailCard();
    const assetListCardPage = new AssetListCard();
    const assetWorkEstimatePage = new AssetWorkEstimateCard();
    const assets = 'Assets';

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
    });

    beforeEach(() => {
      cy.closeAllCards();
      cy.tapAllCardsMenu();
      cy.searchCardAndOpen(assets);
    });

    // it('checks the Documents section', () => {
    //   const filename = 'dog';
    //   const fileExtension = '.jpg';
    //   assetListCardPage.doubleClickSpecificAsset(1, 1);
    //   assetDetailCardPage.goToSection('Documents');
    //   assetDetailCardPage.uploadDocument('/asset/' + filename + fileExtension);
    // });

    it('checks the Work Estimates section', () => {
      assetListCardPage.doubleClickSpecificAsset(0, 1);
      assetListCardPage.verifyAssetDetailsCardOpen();
      assetDetailCardPage.goToSection('Work Estimates')
      // assetDetailCardPage.tapAddSign()
      // assetWorkEstimatePage.isloaded()
      assetWorkEstimatePage.createWorkEstimate()
      assetWorkEstimatePage.messageSuccess().invoke('text').then((elementText) => {
        expect(elementText).to.contain('Saved successfully')
      })
      assetWorkEstimatePage.tapPrintExport()
      assetWorkEstimatePage.tapExportButton()
      assetWorkEstimatePage.getTitleWindow().invoke('text').then((elementText) => {
        windowTitle = elementText.substring(15);
      })
      assetWorkEstimatePage.exportMessage().invoke('text').then((elementText) => {
        expect(elementText).to.contain(windowTitle)
      })
    });

    it('checks the Work Orders section', () => {
      assetListCardPage.doubleClickSpecificAsset(0, 1);
      assetListCardPage.verifyAssetDetailsCardOpen();
      assetDetailCardPage.goToSection('Work Orders')
      assetWorkEstimatePage.createWorkOrder()
      assetWorkEstimatePage.messageSuccess().invoke('text').then((elementText) => {
        expect(elementText).to.contain('Saved successfully')
      })
      assetWorkEstimatePage.tapPrintExport()
      assetWorkEstimatePage.tapExportButton()
      assetWorkEstimatePage.getTitleWindow().invoke('text').then((elementText) => {
        windowTitle = elementText.substring(15);
      })
      assetWorkEstimatePage.exportMessage().invoke('text').then((elementText) => {
        expect(elementText).to.contain(windowTitle)
      })
    });

    it('checks the System / Assembly / Component section', () => {
      assetListCardPage.doubleClickSpecificAsset(0, 1);
      assetListCardPage.verifyAssetDetailsCardOpen();
      assetDetailCardPage.goToSection('System / Assembly / Component')
      assetWorkEstimatePage.createSysmAssemblyComponent()
    });
  });
});
