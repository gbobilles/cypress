import { Meter } from "cypress/support/enums/admin/meter";
import { Asset } from "cypress/support/enums/asset/asset";
import { AssetStatusDisposition } from "cypress/support/enums/asset/assetStatusDisposition";
import { SortOrder } from "cypress/support/enums/common/columnFilters/sortOrder";
import { ReportFormat } from "cypress/support/enums/common/exportReports/reportFormat";
import { Disposition } from "cypress/support/enums/common/statusDisposition/disposition";
import { Status } from "cypress/support/enums/common/statusDisposition/status";
import { Part } from "cypress/support/enums/inv/part";
import { Pm } from "cypress/support/enums/pm/pm";
import { PmStatus } from "cypress/support/enums/pm/pmStatus";
import { WorkOrder } from "cypress/support/enums/shop/workOrder";
import { MeterDetailCard } from "cypress/support/pages/admin/asset/meterDetailCard.page";
import { ListCard } from "cypress/support/pages/common/listCard.page";
import { AssetDetailCard } from "cypress/support/pages/operations/asset/assetDetailCard.page";
import { AssetListCard } from "cypress/support/pages/operations/asset/assetListCard.page";
import { PartDetailCard } from "cypress/support/pages/operations/inv/partDetailCard.page";
import { PmDetailCard } from "cypress/support/pages/operations/pm/pmDetailCard.page";
import { WorkOrderDetailCard } from "cypress/support/pages/operations/shop/workOrderDetailCard.page";
import DateUtils from "cypress/support/utils/dateUtils";
import asset from "../../../fixtures/asset/createAsset.json";
import email from "../../../fixtures/common/email.json";
import part from "../../../fixtures/inv/createPart.json";
import TestFilters from "../../../support/utils/filterTest";
import MathUtils from "../../../support/utils/mathUtils";

TestFilters(['regression', 'assets'], () => {
  describe('Asset Detail Card', () => {
    const listCardPage = new ListCard();
    const assetDetailCardPage = new AssetDetailCard();
    const assetListCardPage = new AssetListCard();
    const meterDetailCardPage = new MeterDetailCard();
    const pmDetailCardPage = new PmDetailCard();
    const workOrderDetailCardPage = new WorkOrderDetailCard();
    const partDetailCardPage = new PartDetailCard();
    const commonLocators = assetDetailCardPage.getCommonLocators();
    const listCardLocators = assetListCardPage.getListCardLocators();
    const detailCardLocators = assetDetailCardPage.getDetailCardLocators();
    const assetDetailCardLocators = assetDetailCardPage.getLocators();
    const workOrderDetailCardLocators = workOrderDetailCardPage.getLocators();
    const assetId = asset.id + MathUtils.generateRandomNumber(5);
    const assetIdColumn = 'asset_primaryAssetIdentifier';
    const emailRecipient = email.email;
    const emailSubject = email.subject;
    const emailBody = email.body;

    before(() => {
      cy.visitDossier();
      cy.loginToDossier();
      cy.openCardByTitle(Asset.ASSETS);
      assetListCardPage.clickElement(listCardLocators.addButton).wait(3000);
      assetListCardPage.isElementExisting(listCardLocators.continueButton).then($exists => {
        if ($exists) {
          assetListCardPage.clickElement(listCardLocators.continueButton).wait(2000);
        }
      });
      assetDetailCardPage.createAsset(
        assetId,
        Number(asset.acquisitionCost),
        asset.acquisitionDate,
        asset.dateInService,
        asset.licensePlate,
        asset.serialNumber,
        asset.vin,
        asset.avatarFilename
      );
    });

    beforeEach(() => {
      cy.openCardByTitle(Asset.ASSETS);
    });

    after(() => {
      cy.openCardByTitle(Asset.ASSETS);
      listCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.selectAssetStatus(AssetStatusDisposition.INACTIVE_INACTIVE);
      assetDetailCardPage.clickElement(commonLocators.saveButton).wait(2000);
    });

    /**
     * Checks the General section of the Asset Detail Card and creates a new Asset.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3145} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 3, 2023
     */
    it('checks the General section and creates a new Asset', { tags: 'asset-add' }, () => {
      assetListCardPage.searchRecord(assetIdColumn, assetId);
    });

    /**
     * Checks the Component Serial Numbers section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3162} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 6, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Component Serial Numbers section', { tags: 'asset-component-serial-numbers' }, () => {
      const serialNumberColumn = 'serialNumber';
      let serialNumber: string = 'CSN_' + MathUtils.generateRandomNumber(5);
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.goToSection(Asset.COMPONENT_SERIAL_NUMBERS);
      assetDetailCardPage.clickSectionButton(Asset.COMPONENT_SERIAL_NUMBERS, commonLocators.addButton);
      assetDetailCardPage.createAndUpdateComponentSerialNumber(serialNumber, serialNumberColumn);
      assetDetailCardPage.doubleClickSectionRow(Asset.COMPONENT_SERIAL_NUMBERS, 0, 0);
      serialNumber = 'CSN_' + MathUtils.generateRandomNumber(5);
      assetDetailCardPage.createAndUpdateComponentSerialNumber(serialNumber, serialNumberColumn);
      assetDetailCardPage.clickColumnEllipsis(Asset.COMPONENT_SERIAL_NUMBERS, serialNumberColumn).wait(2000);
      assetDetailCardPage.clickElement(commonLocators.columnClearButton);
      assetDetailCardPage.sortColumn(Asset.COMPONENT_SERIAL_NUMBERS, serialNumberColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.COMPONENT_SERIAL_NUMBERS, serialNumberColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.COMPONENT_SERIAL_NUMBERS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.COMPONENT_SERIAL_NUMBERS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Related Assets section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3164} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 7, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Related Assets section', { tags: 'asset-related-assets' }, () => {
      const assetTypeColumn = 'asset_primaryAssetIdentifier';
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.goToSection(Asset.RELATED_ASSETS);
      assetDetailCardPage.clickSectionButton(Asset.RELATED_ASSETS, commonLocators.addButton);
      assetDetailCardPage.selectFromDropdownByRandomValue(assetDetailCardLocators.relatedAssetDropdown);
      assetDetailCardPage.clickSectionButton(Asset.RELATED_ASSETS, commonLocators.saveButton);
      assetDetailCardPage.doubleClickSectionRow(Asset.RELATED_ASSETS, 0, 0);
      assetDetailCardPage.selectFromDropdownByRandomValue(assetDetailCardLocators.relatedAssetDropdown);
      assetDetailCardPage.clickSectionButton(Asset.RELATED_ASSETS, commonLocators.saveButton);
      assetDetailCardPage.clickColumnEllipsis(Asset.RELATED_ASSETS, assetTypeColumn);
      assetDetailCardPage.sortColumn(Asset.RELATED_ASSETS, assetTypeColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.RELATED_ASSETS, assetTypeColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.RELATED_ASSETS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.RELATED_ASSETS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Documents section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12627} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: January 30, 2023
     */
    it('checks the Documents section', { tags: 'asset-documents' }, () => {
      const filename = 'dog';
      const fileExtension = 'jpg';
      const filenameRegexAsString = '^' + filename + '.*\\.' + fileExtension + '$';
      const filenameRegex = new RegExp(filenameRegexAsString);
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.goToSection(Asset.DOCUMENTS);
      assetDetailCardPage.getDetailCardElements().sectionContainer(Asset.DOCUMENTS).should('be.visible');
      assetDetailCardPage.uploadFile(detailCardLocators.documentInput, '/common/' + filename + '.' + fileExtension).wait(3000);
      assetDetailCardPage.validateUploadedFile(filenameRegex);
      assetDetailCardPage.deleteUploadedFile();
    });

    /**
     * Checks the Permits section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3168} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 7, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Permits section', { tags: 'asset-permits' }, () => {
      const permitIdColumn = 'identifier';
      let permitId: string = 'Permit_' + MathUtils.generateRandomNumber(5);
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.goToSection(Asset.PERMITS);
      assetDetailCardPage.clickSectionButton(Asset.PERMITS, commonLocators.addButton);
      assetDetailCardPage.createAndUpdatePermit(permitId);
      assetDetailCardPage.doubleClickSectionRow(Asset.PERMITS, 0, 0);
      permitId = 'Permit_' + MathUtils.generateRandomNumber(5);
      assetDetailCardPage.createAndUpdatePermit(permitId);
      assetDetailCardPage.clickColumnEllipsis(Asset.PERMITS, permitIdColumn).wait(2000);
      assetDetailCardPage.clickElement(commonLocators.columnClearButton);
      assetDetailCardPage.sortColumn(Asset.PERMITS, permitIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.PERMITS, permitIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.PERMITS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.PERMITS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Meters section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3166} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 8, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Meters section', { tags: 'asset-meters' }, () => {
      const meterName = 'Hours - Regression_' + MathUtils.generateRandomNumber(5);
      const meterColumn = 'meter_meterName';
      cy.tapAllCardsMenu();
      cy.searchCardAndOpen(Meter.METERS).wait(3000);
      listCardPage.clickVisibleElement(listCardPage.getListCardLocators().addButton);
      meterDetailCardPage.createMeter(meterName, 'Hour', 'Actual');
      cy.closeCardByTitle('Meter: ' + meterName);
      cy.closeCardByTitle(Meter.METERS);
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.goToSection(Asset.METERS);
      assetDetailCardPage.clickSectionButton(Asset.METERS, commonLocators.addButton);
      assetDetailCardPage.createAndUpdateMeter(Asset.METERS, meterName, meterColumn, 30, 0, 'Create');
      assetDetailCardPage.doubleClickSectionRow(Asset.METERS, 0, 0);
      assetDetailCardPage.createAndUpdateMeter(Asset.METERS, meterName, meterColumn, 15, 0, 'Update');
      assetDetailCardPage.clickColumnEllipsis(Asset.METERS, meterColumn).wait(2000);
      assetDetailCardPage.clickElement(commonLocators.columnClearButton);
      assetDetailCardPage.sortColumn(Asset.METERS, meterColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.METERS, meterColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.METERS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.METERS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Meter Readings section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12628} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 13, 2023
     */
    it('checks the Meter Readings section', { tags: 'asset-meter-readings' }, () => {
      const location = 'Location';
      const rowIndex = 0;
      const meterName = 'Hours - Regression_' + MathUtils.generateRandomNumber(5);
      const meterColumn = 'meter_meterName';
      cy.tapAllCardsMenu();
      cy.searchCardAndOpen(Meter.METERS).wait(3000);
      listCardPage.clickVisibleElement(listCardPage.getListCardLocators().addButton);
      meterDetailCardPage.createMeter(meterName, 'Hour', 'Actual');
      cy.closeCardByTitle('Meter: ' + meterName);
      cy.closeCardByTitle(Meter.METERS);
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.goToSection(Asset.METERS);
      assetDetailCardPage.clickSectionButton(Asset.METERS, commonLocators.addButton);
      assetDetailCardPage.createAndUpdateMeter(Asset.METERS, meterName, meterColumn, 30, 0, 'Create');
      assetDetailCardPage.goToSection(Asset.METER_READINGS);
      assetDetailCardPage.updateMeterReading(meterName, 10, DateUtils.getDateTodayAsString());
      assetDetailCardPage.updateMeterReadingHistory(meterName, location, rowIndex);
      cy.closeCardByTitle(Asset.METER_READINGS);
      assetDetailCardPage.changePhysicalMeter(50, 50, 'Changed physical meter');
    });

    /**
     * Checks the Fuel Usage section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3165} for the actual test case.
     * @see {@link https://dossiersystems.visualstudio.com/Support/_workitems/edit/18302} for a known issue.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Fuel Usage section', { tags: 'asset-fuel-usage' }, () => {
      const partId = 'Part_' + MathUtils.generateRandomNumber(5);
      const partColumn = 'part_manufacturerIdentifier';
      const partQuantity = 5;
      let notes = 'New fuel usage_' + MathUtils.generateRandomNumber(5);
      cy.openCardByTitle(Part.PARTS, false).wait(5000);
      listCardPage.clickVisibleElement(listCardLocators.addButton).wait(1000);
      partDetailCardPage.createPart(part.avatarFilename,
        partId,
        'Fuel/Biodiesel',
        part.description,
        part.notes
      );
      partDetailCardPage.goToSection(Part.PART_IN_STOREROOMS);
      partDetailCardPage.createPartInStoreroom(partQuantity, 0).then((value) => {
        cy.closeCardByTitle(Part.PART);
        cy.closeCardByTitle(Part.PARTS);
        assetListCardPage.doubleClickRecord(0, 1);
        assetDetailCardPage.goToSection(Asset.FUEL_USAGE);
        assetDetailCardPage.clickSectionButton(Asset.FUEL_USAGE, commonLocators.addButton);
        assetDetailCardPage.createAndUpdateFuelOrFluidUsage(
          value,
          partId,
          notes,
          partQuantity,
          10,
          DateUtils.getDateTodayAsString(),
          Asset.FUEL_USAGE,
          partColumn,
          'Odometer'
        );
        assetDetailCardPage.doubleClickSectionRow(Asset.FUEL_USAGE, 0, 0);
        notes = 'New fuel usage_' + MathUtils.generateRandomNumber(5);
        assetDetailCardPage.createAndUpdateFuelOrFluidUsage(
          value,
          partId,
          notes,
          partQuantity,
          10,
          DateUtils.getDateTodayAsString(),
          Asset.FUEL_USAGE,
          partColumn,
          'Odometer'
        );
        assetDetailCardPage.clickColumnEllipsis(Asset.FUEL_USAGE, partColumn).wait(2000);
        assetDetailCardPage.clickElement(commonLocators.columnClearButton);
        assetDetailCardPage.sortColumn(Asset.FUEL_USAGE, partColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
        assetDetailCardPage.sortColumn(Asset.FUEL_USAGE, partColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
        assetDetailCardPage.exportSectionReportViaPrint(Asset.FUEL_USAGE, ReportFormat.XML);
        assetDetailCardPage.exportSectionReportViaEmail(Asset.FUEL_USAGE, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      });
    });

    /**
     * Checks the Fluid Usage section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12629} for the actual test case.
     * @see {@link hhttps://dossiersystems.visualstudio.com/Support/_workitems/edit/18302} for a known issue.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 17, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Fluid Usage section', { tags: 'asset-fluid-usage' }, () => {
      const partId = 'Part_' + MathUtils.generateRandomNumber(5);
      const partColumn = 'part_manufacturerIdentifier';
      const partQuantity = 5;
      let notes = 'New fluid usage_' + MathUtils.generateRandomNumber(5);
      cy.openCardByTitle(Part.PARTS, false).wait(5000);
      listCardPage.clickVisibleElement(listCardLocators.addButton).wait(1000);
      partDetailCardPage.createPart(part.avatarFilename,
        partId,
        'Fluid',
        part.description,
        part.notes
      );
      partDetailCardPage.goToSection(Part.PART_IN_STOREROOMS);
      partDetailCardPage.createPartInStoreroom(partQuantity, 0).then((value) => {
        cy.closeCardByTitle(Part.PART);
        cy.closeCardByTitle(Part.PARTS);
        assetListCardPage.doubleClickRecord(0, 1);
        assetDetailCardPage.goToSection(Asset.FLUID_USAGE);
        assetDetailCardPage.clickSectionButton(Asset.FLUID_USAGE, commonLocators.addButton);
        assetDetailCardPage.createAndUpdateFuelOrFluidUsage(
          value,
          partId,
          notes,
          partQuantity,
          10,
          DateUtils.getDateTodayAsString(),
          Asset.FLUID_USAGE, partColumn,
          'Odometer'
        );
        assetDetailCardPage.doubleClickSectionRow(Asset.FLUID_USAGE, 0, 0);
        notes = 'New fluid usage_' + MathUtils.generateRandomNumber(5);
        assetDetailCardPage.createAndUpdateFuelOrFluidUsage(
          value,
          partId,
          notes,
          partQuantity,
          10,
          DateUtils.getDateTodayAsString(),
          Asset.FLUID_USAGE, partColumn,
          'Odometer'
        );
        assetDetailCardPage.clickColumnEllipsis(Asset.FLUID_USAGE, partColumn).wait(2000);
        assetDetailCardPage.clickElement(commonLocators.columnClearButton);
        assetDetailCardPage.sortColumn(Asset.FLUID_USAGE, partColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
        assetDetailCardPage.sortColumn(Asset.FLUID_USAGE, partColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
        assetDetailCardPage.exportSectionReportViaPrint(Asset.FLUID_USAGE, ReportFormat.XML);
        assetDetailCardPage.exportSectionReportViaEmail(Asset.FLUID_USAGE, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      });
    });

    /**
     * Checks the PMs section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3169} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 20, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the PMs section', { tags: 'asset-pms' }, () => {
      const pmColumn = 'pm_name';
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.goToSection(Asset.PMS);
      assetDetailCardPage.clickSectionButton(Asset.PMS, commonLocators.addButton);
      assetDetailCardPage.createAndUpdatePm(Asset.PMS, pmColumn);
      assetDetailCardPage.clickColumnEllipsis(Asset.PMS, pmColumn).wait(1000);
      assetDetailCardPage.clickElement(commonLocators.columnClearButton);
      assetDetailCardPage.sortColumn(Asset.PMS, pmColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.PMS, pmColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.PMS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.PMS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the PM status section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12630} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 22, 2023
     */
    it('checks the PM status section', { tags: 'asset-pm-status' }, () => {
      const pmName = '1600 Miles - Regression_' + MathUtils.generateRandomNumber(5);
      const odometer = 'Odometer';
      const pmDate = DateUtils.getDateTodayMinusMonths(1).toLocaleDateString();
      cy.closeCardByTitle(Asset.ASSETS);
      cy.tapAllCardsMenu();
      cy.searchCardAndOpen(Pm.PMS).wait(2000);
      listCardPage.clickElement(listCardLocators.addButton);
      pmDetailCardPage.createPmWithIntervalAndMetric(pmName, pmName, 'Miles', 1600, 200, 100, 25);
      cy.openCardByTitle(Asset.ASSETS);
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.goToSection(Asset.METERS);
      assetDetailCardPage.clickSectionButton(Asset.METERS, commonLocators.addButton);
      assetDetailCardPage.clickElement(assetDetailCardLocators.meterDropdown);
      assetDetailCardPage.typeWithinField(assetDetailCardLocators.meterDropdown, odometer);
      assetDetailCardPage.selectFromDropdownByText(odometer);
      assetDetailCardPage.typeWithinField(assetDetailCardLocators.dailyMaximumInputField, 500);
      assetDetailCardPage.typeWithinField(assetDetailCardLocators.initialMeterReadingDateTime, pmDate + ' 12:00 AM');
      assetDetailCardPage.getElements().datePickerButton('OK').click({ force: true }).wait(3000);
      assetDetailCardPage.clickVisibleElement(commonLocators.mainSaveButton);
      assetDetailCardPage.goToSection(Asset.PMS);
      assetDetailCardPage.createPm(pmName, pmDate);
      cy.closeCardByTitle(Asset.ASSET_PM_ASSIGNMENT);
      cy.closeCardByTitle('Asset: ' + assetId);
      assetListCardPage.clickColumnEllipsis(assetIdColumn);
      assetDetailCardPage.clickElement(commonLocators.columnFilterIcon);
      assetDetailCardPage.typeWithinField(commonLocators.columnFilterInputField, assetId);
      assetDetailCardPage.clickElement(commonLocators.columnFilterButton).wait(2000);
      assetDetailCardPage.calculatePmMeterReadings(assetId, pmName, PmStatus.NOT_DUE);
      assetDetailCardPage.goToSection(Asset.METER_READINGS);
      assetDetailCardPage.updateMeterReading(odometer, 1550, DateUtils.getDateTodayMinusDays(10).toLocaleDateString() + ' 12:00 AM');
      cy.closeCardByTitle('Asset: ' + assetId);
      assetDetailCardPage.calculatePmMeterReadings(assetId, pmName, PmStatus.DUE);
      assetDetailCardPage.goToSection(Asset.METER_READINGS);
      assetDetailCardPage.updateMeterReading(odometer, 1601, DateUtils.getDateTodayMinusDays(6).toLocaleDateString() + ' 12:00 AM');
      cy.closeCardByTitle('Asset: ' + assetId);
      assetDetailCardPage.calculatePmMeterReadings(assetId, pmName, PmStatus.OVERDUE);
      assetDetailCardPage.goToSection(Asset.METER_READINGS);
      assetDetailCardPage.updateMeterReading(odometer, 1626, DateUtils.getDateTodayMinusDays(0).toLocaleDateString() + ' 12:00 AM');
      cy.closeCardByTitle('Asset: ' + assetId);
      assetDetailCardPage.calculatePmMeterReadings(assetId, pmName, PmStatus.CRITICAL);
    });

    /**
     * Checks the Work Requests section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3159} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: February 9, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Work Requests section', { tags: 'asset-work-requests' }, () => {
      const workRequestName = 'WR-' + MathUtils.generateRandomNumber(5);
      const workRequestNameColumn = 'workRequestName';
      let workRequestDescription = 'New work request_' + MathUtils.generateRandomNumber(5);
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.goToSection(Asset.WORK_REQUESTS).wait(5000);
      assetDetailCardPage.clickSectionButton(Asset.WORK_REQUESTS, commonLocators.addButton).wait(3000);
      assetDetailCardPage.createAndUpdateWorkRequest(Asset.WORK_REQUESTS, workRequestNameColumn, workRequestName, workRequestDescription);
      assetDetailCardPage.clickColumnEllipsis(Asset.WORK_REQUESTS, workRequestNameColumn).wait(2000);
      assetDetailCardPage.clickElement(commonLocators.columnClearButton);
      assetDetailCardPage.sortColumn(Asset.WORK_REQUESTS, workRequestNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.WORK_REQUESTS, workRequestNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.WORK_REQUESTS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.WORK_REQUESTS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Work Estimates section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3160} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 2, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 30, 2023
     */
    it('checks the Work Estimates section', { tags: 'asset-work-estimates' }, () => {
      const workEstimateIdentifierColumn = 'workEstimateIdentifier';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.goToSection(Asset.WORK_ESTIMATES).wait(3000);
      assetDetailCardPage.createWorkEstimate(Asset.WORK_ESTIMATES);
      assetDetailCardPage.sortColumn(Asset.WORK_ESTIMATES, workEstimateIdentifierColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.WORK_ESTIMATES, workEstimateIdentifierColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.WORK_ESTIMATES, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.WORK_ESTIMATES, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Work Orders section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3161} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 2, 2023
     *
     * Update by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Work Orders section', { tags: 'asset-work-orders' }, () => {
      const workOrderIdColumn = 'workOrderIdentifier';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.WORK_ORDERS).wait(1000);
      assetDetailCardPage.clickSectionButton(Asset.WORK_ORDERS, commonLocators.addButton).wait(4000);
      assetDetailCardPage.createWorkOrder('Internal', Asset.WORK_ORDERS);
      assetDetailCardPage.sortColumn(Asset.WORK_ORDERS, workOrderIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.WORK_ORDERS, workOrderIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.WORK_ORDERS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.WORK_ORDERS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      assetDetailCardPage.doubleClickRow(0, 0);
      workOrderDetailCardPage.selectRecordStatus(WorkOrder.GENERAL, Status.CLOSED);
      workOrderDetailCardPage.selectRecordDisposition(WorkOrder.GENERAL, Disposition.NOT_NEEDED);
      workOrderDetailCardPage.clickElement(commonLocators.saveButton).wait(1000);
    });

    /**
     * Checks the System / Assembly / Component section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3172} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 6, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the System / Assembly / Component section', { tags: 'asset-system-assembly-component-codes' }, () => {
      const systemCodeDescriptionColumn = 'componentCode_assemblyCode_systemCode_description';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.SYSTEM_ASSEMBLY_COMPONENT);
      assetDetailCardPage.createSystemAssemblyComponent();
      assetDetailCardPage.sortColumn(Asset.SYSTEM_ASSEMBLY_COMPONENT, systemCodeDescriptionColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.SYSTEM_ASSEMBLY_COMPONENT, systemCodeDescriptionColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.SYSTEM_ASSEMBLY_COMPONENT, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.SYSTEM_ASSEMBLY_COMPONENT, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Standard Repairs section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3940} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 7, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Standard Repairs section', { tags: 'asset-standard-repairs' }, () => {
      const standardRepairColumn = 'standardRepair_standardRepairIdentifier';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.STANDARD_REPAIRS);
      assetDetailCardPage.createStandardRepair();
      assetDetailCardPage.sortColumn(Asset.STANDARD_REPAIRS, standardRepairColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.STANDARD_REPAIRS, standardRepairColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.STANDARD_REPAIRS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.STANDARD_REPAIRS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Parts section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3173} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 7, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Parts section', { tags: 'asset-parts' }, () => {
      const partIdColumn = 'part_manufacturerIdentifier';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.PARTS);
      assetDetailCardPage.createPartsComponent();
      assetDetailCardPage.sortColumn(Asset.PARTS, partIdColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.PARTS, partIdColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.PARTS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.PARTS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Warranties section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12631} for the actual test case.
     * @see {@link https://dossiersystems.visualstudio.com/Support/_workitems/edit/18263} for a known issue.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 20, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 30, 2023
     */
    it('checks the Warranties section', { tags: 'asset-warranties' }, () => {
      const warrantyNameColumn = 'warranty_name';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.WARRANTIES);
      assetDetailCardPage.createWarranty();
      assetDetailCardPage.sortColumn(Asset.WARRANTIES, warrantyNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.WARRANTIES, warrantyNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.WARRANTIES, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.WARRANTIES, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the GL Specifications section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12632} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 7, 2023
     * Date updated: May 17, 2023
     */
    it('checks the GL Specifications section', { tags: 'asset-gl-specs' }, () => {
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.GL_SPECIFICATIONS);
      cy.wait(4000);
      assetDetailCardPage.createGlSpecification();
    });

    /**
     * Checks the Operational Hours section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3167} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 8, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Operational Hours section', { tags: 'asset-operational-hours' }, () => {
      const dayOfTheWeekColumn = 'dayOfTheWeek';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.OPERATIONAL_HOURS);
      assetDetailCardPage.createOperationalHours();
      assetDetailCardPage.sortColumn(Asset.OPERATIONAL_HOURS, dayOfTheWeekColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.OPERATIONAL_HOURS, dayOfTheWeekColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.OPERATIONAL_HOURS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.OPERATIONAL_HOURS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Driver Assignments section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3163} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 8, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Driver Assignments section', { tags: 'asset-driver-assignments' }, () => {
      const firstNameColumn = 'person_firstName';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.DRIVER_ASSIGNMENTS);
      assetDetailCardPage.createDriverAssignment();
      cy.closeCardByTitle(Asset.DRIVER_ASSIGNMENT);
      assetDetailCardPage.sortColumn(Asset.DRIVER_ASSIGNMENTS, firstNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.DRIVER_ASSIGNMENTS, firstNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.DRIVER_ASSIGNMENTS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.DRIVER_ASSIGNMENTS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Recurring Costs section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12634} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 13, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 23, 2023
     */
    it('checks the Recurring Costs section', { tags: 'asset-recurring-costs' }, () => {
      const systemCodeDescriptionColumn = 'systemCode_description';
      const depreciationNameColumn = 'depreciationName';
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.RECURRING_COSTS);
      assetDetailCardPage.createRecurringCost();
      assetDetailCardPage.sortColumn(Asset.RECURRING_COSTS, systemCodeDescriptionColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.RECURRING_COSTS, systemCodeDescriptionColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.RECURRING_COSTS, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.RECURRING_COSTS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
      assetDetailCardPage.createRecurringCost(Asset.DEPRECIATION_RECURRING_COST);
      assetDetailCardPage.sortColumn(Asset.RECURRING_COSTS, depreciationNameColumn, commonLocators.sortAscending, SortOrder.SORT_ASCENDING);
      assetDetailCardPage.sortColumn(Asset.RECURRING_COSTS, depreciationNameColumn, commonLocators.sortDescending, SortOrder.SORT_DESCENDING);
      assetDetailCardPage.exportSectionReportViaPrint(Asset.RECURRING_COSTS, ReportFormat.XML, 1);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.RECURRING_COSTS, ReportFormat.JSON, emailRecipient, emailSubject, emailBody, 1);
    });

    /**
     * Checks the Work History section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12636} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 21, 2023
     */
    it('checks the Work History section', { tags: 'asset-work-history' }, () => {
      assetListCardPage.doubleClickRecord(0, 1);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
      assetDetailCardPage.goToSection(Asset.WORK_HISTORY);
      assetDetailCardPage.clickElementBySelectorAndText(commonLocators.tableColumn, 'WO');
      assetDetailCardPage.verifyCardByTitle(Asset.WORK_ORDER);
      cy.closeCardByTitle(Asset.WORK_ORDER);
      assetDetailCardPage.clickVisibleElement(assetDetailCardLocators.historyLink);
      assetDetailCardPage.verifyCardByTitle(Asset.WORK_ORDER_HISTORY);
      cy.closeCardByTitle(Asset.WORK_ORDER_HISTORY);
      assetDetailCardPage.verifyCardByTitle(Asset.ASSET);
    });

    /**
     * Checks the Status - Active/Inactive section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/3221} for the actual test case.
     * Exporting to PDF is out-of-scope at the moment as it generates a blank report.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 23, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: May 30, 2023
     */
    it('checks the Status - Active/Inactive section', { tags: 'asset-status' }, () => {
      const assetId = asset.id + MathUtils.generateRandomNumber(5);
      const statusColumn = 'asset_disposition_status_name';
      assetListCardPage.clickElement(listCardLocators.addButton).wait(2000);
      assetListCardPage.clickElement(listCardLocators.continueButton);
      assetDetailCardPage.createAsset(
        assetId,
        Number(asset.acquisitionCost),
        asset.acquisitionDate,
        asset.dateInService,
        asset.licensePlate,
        asset.serialNumber,
        asset.vin,
        asset.avatarFilename
      );
      assetDetailCardPage.selectAssetStatus(AssetStatusDisposition.INACTIVE_INACTIVE);
      assetDetailCardPage.clickElement(commonLocators.saveButton);
      cy.closeCardByTitle(Asset.ASSET);
      assetListCardPage.searchRecord(assetIdColumn, assetId, false);
      assetListCardPage.clickColumnEllipsis(statusColumn);
      assetListCardPage.clickElement(commonLocators.columnFilterIcon, -1);
      assetListCardPage.clickElement(commonLocators.columnClearButton, -1);
      assetListCardPage.clickColumnEllipsis(assetIdColumn);
      assetListCardPage.clickElement(commonLocators.columnFilterIcon, -1);
      assetListCardPage.clickElement(commonLocators.columnFilterDropdown).wait(1000);
      cy.get(commonLocators.listScroller).find('ul').children('li').contains('Contains').click({ force: true }).wait(1000);
      assetListCardPage.clickElement(commonLocators.columnFilterButton).wait(2000);
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      cy.openCardByTitle(WorkOrder.WORK_ORDERS, false).wait(2000);
      listCardPage.clickVisibleElement(listCardLocators.addButton).wait(1000);
      listCardPage.clickVisibleElement(commonLocators.continueButton).wait(1000);
      workOrderDetailCardPage.clickVisibleElement(workOrderDetailCardLocators.assetDropdown).wait(1000);
      workOrderDetailCardPage.typeWithinVisibleField(workOrderDetailCardLocators.assetDropdown, assetId);
      cy.get(commonLocators.expandedDropdown).find('ul').children('li').should('not.have.text', assetId);
      cy.closeCardByTitle(WorkOrder.WORK_ORDER);
      cy.closeCardByTitle(WorkOrder.WORK_ORDERS);
      assetDetailCardPage.selectAssetStatus(AssetStatusDisposition.ACTIVE_IN_SERVICE);
      assetDetailCardPage.clickVisibleElement(commonLocators.saveButton).wait(2000);
      assetDetailCardPage.clickElement(commonLocators.successMessageCloseButton);
      assetDetailCardPage.goToSection(Asset.STATE_CHANGE_HISTORY);
      cy.contains('td', 'Inactive').should('be.visible');
      cy.contains('td', 'In Service').should('be.visible');
      assetDetailCardPage.exportSectionReportViaPrint(Asset.STATE_CHANGE_HISTORY, ReportFormat.XML);
      assetDetailCardPage.exportSectionReportViaEmail(Asset.STATE_CHANGE_HISTORY, ReportFormat.JSON, emailRecipient, emailSubject, emailBody);
    });

    /**
     * Checks the Barcodes section of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/12633} for the actual test case.
     *
     * Author: Gabriel Bobilles
     * Date completed: February 26, 2023
     *
     * Updated by: Elise Margaret Sumanga
     * Date updated: July 11, 2023
     */
    it('checks the Barcodes section', { tags: 'asset-barcodes' }, () => {
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.createBarcode('Dossier Barcode 1', 'ASSET000000000049');
    });

    /**
     * Checks the Export Reports functionality of the Asset Detail Card.
     *
     * @remarks
     * @see {@link https://dev.azure.com/dossiersystems/Dossier7/_workitems/edit/18280} for the actual test case.
     *
     * Author: Elise Margaret Sumanga
     * Date completed: May 23, 2023
     */
    it('checks the Export Reports functionality', { tags: 'asset-export' }, () => {
      assetListCardPage.searchRecord(assetIdColumn, assetId);
      assetDetailCardPage.exportMainReportViaPrint(ReportFormat.PDF);
    });
  });
});
