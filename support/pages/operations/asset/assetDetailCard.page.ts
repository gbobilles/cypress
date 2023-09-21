import { faker } from '@faker-js/faker';
import { Asset } from "cypress/support/enums/asset/asset";
import { AssetStatusDisposition } from "cypress/support/enums/asset/assetStatusDisposition";
import { PmStatus } from 'cypress/support/enums/pm/pmStatus';
import MathUtils from "cypress/support/utils/mathUtils";
import { DetailCard } from "../../common/detailCard.page";

export class AssetDetailCard extends DetailCard {

  private constants: { [key: string]: string } = {
    workOrderDialogMessage: 'Take this Asset out of service?'
  }

  private locators: { [key: string]: string } = {
    assetIdInputField: 'div[field=primaryAssetIdentifier] input',
    assetIdDropdown: 'div[field=assetTypeId] input',
    siteDropdown: 'div[field=siteId] input',
    acquisitionCostInputField: 'div[field=acquisitionCost] input',
    acquisitionDate: 'input[placeholder="Acquisition Date mm/dd/yyyy"]',
    dateInService: 'input[placeholder="Date In Service mm/dd/yyyy"]',
    fuelTypeDropdown: 'div[field=partTypeId] input',
    licensePlateInputField: 'div[field=licensePlate] input',
    assetCountryDropdown: 'div[field=licensePlateRegionId] input[placeholder="Country"]',
    assetStateProvinceTerritoryDropdown: 'input[placeholder="State/Province/Territory"]',
    manufacturedYearInputField: 'div[field=manufacturedYear] input',
    modelYearInputField: 'div[field=modelYear] input',
    assetSerialNumberInputField: 'div[field=serialNumber] input',
    vinInputField: 'div[field=vehicleIdentificationNumber] input',
    countryDropdown: 'div[field=regionId] input[placeholder=Country]',
    stateProvinceTerritoryDropdown: 'div[field=regionId] input[placeholder="State/Province/Territory"]',
    issueDate: 'input[placeholder="Issue Date mm/dd/yyyy"]',
    dateToday: 'td.available.today',
    expirationDate: 'input[placeholder="Expiration Date mm/dd/yyyy"]',
    nextYear: 'button[aria-label="Next Year"]',
    availableDate: 'td.available',
    permitDropdown: 'div[field=permitTypeId] input',
    permitInputField: 'div[field=identifier] input',
    relatedAssetDropdown: 'div[field=associatedAssetId] input',
    meterDropdown: 'div[field=meterId] input',
    dailyMaximumInputField: 'div[field=dailyMaximum] input',
    tolerancePercentage: 'div[field=tolerancePercentage] input',
    serialNumberTypeDropdown: 'div[field=serialNumberTypeId] input',
    serialNumberInputField: 'div[field=serialNumber] input',
    workRequestName: 'div[field=workRequestName] input',
    requestReason: 'div[field=complaintId] input',
    estimatedHours: 'div[field=estimatedHours] input',
    estimatedCost: 'div[field=estimatedCost] input',
    initialMeterReadingDateTime: 'div[field=readingTime] input',
    meterName: '.meter-name',
    meterDetails: '.meter-details',
    meterReadingDetails: '.meter-reading-details',
    meterReadingInputField: '.add-meter-reading .input-number input',
    meterReadingDateTime: '.add-meter-reading .input-date-time input',
    meterReadingSaveButton: '.add-meter-reading .fa-save',
    meterReadingEditButton: '.meter-reading-details .fa-edit',
    meterReadingHistoryButton: '.fa-history',
    changePhysicalMeterDateTime: '.physical-meter-change .input-date-time input',
    changePhysicalMeterLabel: '.physical-meter-change label',
    changePhysicalMeterDescription: '.physical-meter-change [placeholder=Description]',
    suspectInputSwitch: '.input-boolean[field=suspect] [role=radio]',
    datePickerButton: '.el-picker-panel button',
    workRequestDescription: 'div[field=description] textarea',
    partStoreroomDropdown: 'div[field=partStoreId] input',
    transactionDate: 'div[field=transactionDate] input',
    notes: 'div[field=notes] textarea',
    partDropdown: 'div[field=partId] input',
    quantity: 'div[field=quantity] input',
    pmDropdown: 'div[field=pmId] input',
    dispositionDropdown: 'div[field=dispositionId] input',
    tableDeleteButton: '.k-grid-deleteItem',
    deleteCheckButton: '.fa-check-circle',
    pmStatusTable: 'table[role=presentation',
    plusSign: '.k-i-plus',
    minusSign: '.k-i-minus',
    pmLastCompletionDate: '[placeholder="Initial Completion Date mm/dd/yyyy"]',
    pmLastCompletionValue: 'div[field=initialLastCompletionValue] input',
    pmIntervalAssocationSaveButton: '.right-side .fa-save',
    recurringCostStandardTab: '#tab-recurringCosts',
    recurringCostStandardAddButton: '[schema-path="recurring-cost"] .fa-plus',
    recurringCostStandardIntervalDropdown: 'input[placeholder="Interval"]',
    recurringCostStandardSystemCodeDropdown: 'input[placeholder="System Code"]',
    recurringCostDepreciationsTab: '#tab-deprecations',
    recurringCostDepreciationAddButton: '[schema-path="depreciation"] .fa-plus',
    recurringCostDepreciationNameInputField: 'div[field="depreciationName"] input',
    recurringCostDepreciationBookValueInputField: 'div[field="startingBookValue"] input',
    recurringCostDepreciationIntervalDropdown: 'div[field="recurringCostIntervalId"] input',
    recurringCostDepreciationSalvageValueInputField: 'div[field="salvageValue"] input',
    assetDropdown: 'input[placeholder="Asset"]',
    workOrderDropdown: 'input[placeholder="Work Order"]',
    workOrderTypeDropdown: 'div[field="workOrderTypeId"] input',
    vendorStoreDropdown: 'div[field="vendorStoreId"] input',
    systemCodeDropdown: 'div[field=SystemCode] input',
    assemblyCodeDropdown: 'div[field=AssemblyCode] input',
    componentCodeDropdown: 'div[field=ComponentCode] input',
    warrantyDropdown: '[field="warrantyId"] input',
    glSpecDivisionDropdown: 'div[field="division"] input',
    glSpecEquipmentTypeDropdown: 'div[field="equipmentType"] input',
    glSpecCompanyDropdown: 'div[field="company"] input',
    glSpecDepartmentDropdown: 'div[field="department"] input',
    operationalHoursNameInputField: 'div[field="name"] input',
    operationalHoursDayOfTheWeekDropdown: 'div[field="dayOfTheWeek"] input',
    operationalHoursStartTimeDropdown: 'input[placeholder="Start Time"]',
    operationalHoursDurationInputField: 'div[field="duration"] input',
    driverAssignmentDropdown: 'input[placeholder="Person"]',
    historyLink: '.work-order-history',
    workOrderDialog: '.el-message-box p',
    glSpecificationItems: '.gl-spec-values-body .content-form input',
    standardRepairDropdown: 'div[field=standardRepairId] input'
  }

  private elements = {
    datePickerButton: (button: string) => cy.get(this.locators.datePickerButton).filter(':visible').contains(button),
    meterReadingHistoryButton: (meterName: string) => cy.get(this.locators.meterName).contains(meterName).siblings(this.locators.meterReadingDetails).find(this.locators.meterReadingHistoryButton),
    suspectInputSwitch: () => cy.get(this.locators.suspectInputSwitch).not('.is-active'),
    titleWindow: () => cy.xpath(this.commonLocators.windowTitle)
  }

  getLocators(): { [key: string]: string } {
    return this.locators;
  }

  getElements(): any {
    return this.elements;
  }

  createAsset(assetId: string, acquisitionCost: number, acquisitionDate: string, dateInService: string,
    licensePlate: string, serialNumber: string, vin: string, filename: string, siteIncluded: boolean = false): void {
    this.uploadFile(this.detailCardLocators.avatar, filename);
    this.typeWithinField(this.locators.assetIdInputField, assetId);
    this.clickElement(this.locators.assetIdDropdown);
    this.selectFromDropdown(0);
    if (!siteIncluded) {
      this.clickElement(this.locators.siteDropdown).wait(500);
      this.selectFromDropdown(0);
    }
    this.typeWithinField(this.locators.acquisitionCostInputField, acquisitionCost);
    this.typeWithinField(this.locators.acquisitionDate, acquisitionDate);
    this.typeWithinField(this.locators.dateInService, dateInService);
    this.clickElement(this.locators.fuelTypeDropdown);
    this.selectFromDropdown(0);
    this.typeWithinField(this.locators.licensePlateInputField, licensePlate);
    this.clickElement(this.locators.assetCountryDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.assetStateProvinceTerritoryDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.manufacturedYearInputField);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.modelYearInputField);
    this.selectFromDropdown(0);
    this.typeWithinField(this.locators.assetSerialNumberInputField, serialNumber);
    this.typeWithinField(this.locators.vinInputField, vin);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickElement(this.commonLocators.alertDialogCloseButton);
  }

  createAndUpdateComponentSerialNumber(serialNumber: string, serialNumberColumn: string): void {
    this.selectFromDropdownByRandomValue(this.locators.serialNumberTypeDropdown);
    this.typeWithinField(this.locators.serialNumberInputField, serialNumber);
    this.goToSection(Asset.COMPONENT_SERIAL_NUMBERS);
    this.clickSectionButton(Asset.COMPONENT_SERIAL_NUMBERS, this.commonLocators.saveButton).wait(1000);
    this.clickColumnEllipsis(Asset.COMPONENT_SERIAL_NUMBERS, serialNumberColumn);
    this.clickElement(this.commonLocators.columnFilterIcon);
    this.typeWithinField(this.commonLocators.columnFilterInputField, serialNumber);
    this.clickElement(this.commonLocators.columnFilterButton).wait(3000);
    this.detailCardElements.sectionContainerElements(Asset.COMPONENT_SERIAL_NUMBERS, this.commonLocators.table)
      .find('td')
      .contains(serialNumber)
      .should('be.visible');
  }

  createAndUpdatePermit(permitId: string): void {
    const permitIdColumn = 'identifier';
    this.selectFromDropdownByRandomValue(this.locators.permitDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.countryDropdown).wait(1000);
    this.selectFromDropdownByRandomValue(this.locators.stateProvinceTerritoryDropdown);
    this.typeWithinField(this.locators.permitInputField, permitId);
    this.clickElement(this.locators.issueDate);
    this.clickVisibleElement(this.locators.dateToday);
    this.clickElement(this.locators.expirationDate);
    this.clickVisibleElement(this.locators.nextYear);
    cy.get(this.locators.availableDate).filter(':visible').first().click({ force: true });
    this.clickSectionButton(Asset.PERMITS, this.commonLocators.saveButton);
    this.clickColumnEllipsis(Asset.PERMITS, permitIdColumn);
    this.clickElement(this.commonLocators.columnFilterIcon);
    this.typeWithinField(this.commonLocators.columnFilterInputField, permitId);
    this.clickElement(this.commonLocators.columnFilterButton).wait(3000);
    this.detailCardElements.sectionContainerElements(Asset.PERMITS, this.commonLocators.table)
      .find('td')
      .contains(permitId)
      .should('be.visible');
  }

  createMeter(meterName: string, dailyMaximum: number, dateTime: string): void {
    this.clickSectionButton(Asset.METERS, this.commonLocators.addButton);
    this.typeWithinField(this.locators.meterDropdown, meterName);
    this.selectFromDropdownByText(meterName);
    this.typeWithinField(this.locators.dailyMaximumInputField, dailyMaximum);
    this.typeWithinField(this.locators.initialMeterReadingDateTime, dateTime);
    this.getElements().datePickerButton('OK').click({ force: true }).wait(3000);
    this.clickVisibleElement(this.commonLocators.mainSaveButton);
  }

  createAndUpdateMeter(section: string, meterName: string, column: string, dailyMaximum: number, tolerancePercentage: number, action: string): void {
    this.inputMeterDetails(meterName, dailyMaximum, tolerancePercentage, action);
    this.clickColumnEllipsis(section, column);
    if (action === 'Create') {
      this.clickElement(this.commonLocators.columnFilterIcon);
    }
    this.typeWithinField(this.commonLocators.columnFilterInputField, meterName);
    this.clickElement(this.commonLocators.columnFilterButton).wait(3000);
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .find('td')
      .contains(meterName)
      .should('be.visible');
  }

  createPm(pmName: string, pmLastCompletionDate: string): void {
    this.clickSectionButton(Asset.PMS, this.commonLocators.addButton);
    this.clickElement(this.locators.pmDropdown);
    this.typeWithinField(this.locators.pmDropdown, pmName);
    this.selectFromDropdownByText(pmName);
    this.clickVisibleElement(this.commonLocators.saveButton).wait(3000);
    this.clickElement(this.locators.plusSign).wait(1000);
    this.clickElement(this.locators.minusSign).wait(1000);
    this.clickElement(this.locators.plusSign).wait(2000);
    this.typeWithinField(this.locators.pmLastCompletionDate, pmLastCompletionDate).wait(2000);
    this.clickElement(this.locators.pmLastCompletionValue).wait(1000);
    this.clickElement(this.locators.pmIntervalAssocationSaveButton);
  }

  createAndUpdateWorkRequest(section: string, workRequestNameColumn: string, workRequestName: string, workRequestDescription: string): void {
    this.typeWithinField(this.locators.workRequestName, workRequestName);
    this.clickElement(this.locators.requestReason);
    this.selectFromDropdown(0).wait(1000);
    this.typeWithinField(this.locators.estimatedHours, MathUtils.generateRandomNumber(2));
    this.typeWithinField(this.locators.estimatedCost, MathUtils.generateRandomNumber(3));
    this.typeWithinField(this.locators.workRequestDescription, workRequestDescription);
    this.goToSection(Asset.WORK_REQUESTS);
    this.clickSectionButton(section, this.commonLocators.saveButton);
    this.clickColumnEllipsis(section, workRequestNameColumn);
    this.clickElement(this.commonLocators.columnFilterIcon);
    this.typeWithinField(this.commonLocators.columnFilterInputField, workRequestName);
    this.clickElement(this.commonLocators.columnFilterButton).wait(3000);
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .find('td')
      .contains(workRequestName)
      .should('be.visible');
  }

  inputMeterDetails(meterName: string, dailyMaximum: number, tolerancePercentage: number, action: string): void {
    if (action === 'Create') {
      this.typeWithinField(this.locators.meterDropdown, meterName);
      this.selectFromDropdownByText(meterName);
      this.typeWithinField(this.locators.dailyMaximumInputField, dailyMaximum);
      this.typeWithinField(this.locators.tolerancePercentage, tolerancePercentage);
      this.clickVisibleElement(this.commonLocators.mainSaveButton);
      this.verifyAlertMessage(this.commonConstants.generalErrorMessage);
      this.clickVisibleElement(this.commonLocators.alertDialogCloseButton);
      dailyMaximum = 24;
      this.typeWithinField(this.locators.dailyMaximumInputField, dailyMaximum);
      this.clickVisibleElement(this.commonLocators.mainSaveButton);
      this.verifyAlertMessage(this.commonConstants.generalErrorMessage);
      this.clickVisibleElement(this.commonLocators.alertDialogCloseButton);
      dailyMaximum = 20;
      this.typeWithinField(this.locators.dailyMaximumInputField, dailyMaximum);
      this.typeWithinField(this.locators.tolerancePercentage, tolerancePercentage);
    } else {
      this.typeWithinField(this.locators.dailyMaximumInputField, dailyMaximum);
    }

    this.clickVisibleElement(this.commonLocators.mainSaveButton);
  }

  updateMeterReading(meterName: string, meterReading: any, date: string): void {
    cy.get(this.locators.meterName).contains(meterName).next(this.locators.meterDetails).find(this.locators.meterReadingInputField).type(meterReading, { force: true });
    cy.get(this.locators.meterName).contains(meterName).next(this.locators.meterDetails).find(this.locators.meterReadingDateTime).type(date, { force: true }).wait(2000);
    this.elements.datePickerButton('OK').click({ force: true }).wait(3000);
    cy.get(this.locators.meterName).contains(meterName).next(this.locators.meterDetails).find(this.locators.meterReadingSaveButton).click({ force: true }).wait(2000);
  }

  updateMeterReadingHistory(meterName: string, section: string, row: number): void {
    this.getElements().meterReadingHistoryButton(meterName).scrollIntoView().click({ force: true }).wait(3000);
    this.doubleClickRow(row, 1).wait(2000);
    this.goToSection(section).should('be.visible');
    this.getElements().suspectInputSwitch().find('span').invoke('text').as('value');
    this.getElements().suspectInputSwitch().click();
    this.clickVisibleElement(this.commonLocators.saveButton).wait(2000);
    cy.closeCardByTitle('Meter Reading:');
    cy.get('@value').then((value) => {
      this.commonElements.table()
        .filter(':visible')
        .find('tr')
        .eq(row)
        .find('td')
        .contains(value.toString().trim())
        .scrollIntoView()
        .should('be.visible');
    });
  }

  changePhysicalMeter(finalMeterReading: any, newMeterReading: any, description: string): void {
    cy.get(this.locators.meterReadingEditButton).first().click({ force: true }).wait(2000);
    this.clickElement(this.locators.changePhysicalMeterDateTime);
    this.elements.datePickerButton('Now').click({ force: true });
    cy.get(this.locators.changePhysicalMeterLabel).contains('Final Meter Reading').parent().next().find('input').clear().type(finalMeterReading);
    cy.get(this.locators.changePhysicalMeterLabel).contains('New Meter Reading').parent().next().find('input').clear().type(newMeterReading);
    cy.get(this.locators.changePhysicalMeterDescription).type(description);
    this.clickVisibleElement(this.commonLocators.mainSaveButton);
  }

  createAndUpdateFuelOrFluidUsage(partStoreroom: string, part: string, notes: string, quantity: number, meterReading: number, date: string, fuelOrFluidUsage: string, partColumn: string, meterName: string): void {
    this.typeWithinField(this.locators.partStoreroomDropdown, partStoreroom);
    this.selectFromDropdownByText(partStoreroom);
    this.clickElement(this.locators.transactionDate);
    this.elements.datePickerButton('Now').click({ force: true });
    this.typeWithinField(this.locators.notes, notes);
    this.clickElement(this.locators.partDropdown);
    this.typeWithinField(this.locators.partDropdown, part);
    this.selectFromDropdownByText(part);
    this.typeWithinField(this.locators.quantity, quantity);
    this.updateMeterReading(meterName, meterReading, date);
    this.clickSectionButton(fuelOrFluidUsage, this.commonLocators.saveButton);
    this.clickColumnEllipsis(fuelOrFluidUsage, partColumn);
    this.clickElement(this.commonLocators.columnFilterIcon);
    this.typeWithinField(this.commonLocators.columnFilterInputField, part);
    this.clickElement(this.commonLocators.columnFilterButton).wait(3000);
    this.detailCardElements.sectionContainerElements(fuelOrFluidUsage, this.commonLocators.table)
      .find('td')
      .contains(part)
      .should('be.visible');
  }

  createAndUpdatePm(section: string, pmColumn: string): void {
    const inactiveStatus = 'Inactive';
    this.clickElement(this.locators.pmDropdown);
    this.selectFromDropdown(0);
    this.clickElement(this.locators.pmDropdown);
    cy.get(this.locators.pmDropdown).invoke('attr', 'placeholder').as('value');
    this.clickVisibleElement(this.commonLocators.saveButton);
    cy.closeCardByTitle(Asset.ASSET_PM_ASSIGNMENT);
    this.clickColumnEllipsis(section, pmColumn);
    this.clickElement(this.commonLocators.columnFilterIcon).wait(1000);
    cy.get('@value').then((value) => {
      const pm = value.toString();
      this.typeWithinField(this.commonLocators.columnFilterInputField, pm);
      this.clickElement(this.commonLocators.columnFilterButton).wait(2000);
      this.doubleClickSectionRowByText(section, pm).wait(2000);
      cy.get(this.locators.dispositionDropdown).eq(0).click();
      this.selectFromDropdownByText(inactiveStatus);
      cy.get(this.locators.dispositionDropdown).eq(1).click();
      this.selectFromDropdownByText(inactiveStatus);
      this.clickVisibleElement(this.commonLocators.saveButton);
      cy.closeCardByTitle(Asset.ASSET_PM_ASSIGNMENT);
      this.deletePm(section, pm);
    });
  }

  deletePm(section: string, pm: string): void {
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .find('td')
      .contains(pm)
      .should('be.visible');
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .find('td')
      .contains(pm)
      .parent('tr')
      .find(this.locators.tableDeleteButton)
      .click();
    this.clickVisibleElement(this.locators.deleteCheckButton);
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .find('td')
      .contains(pm)
      .should('not.be.visible');
  }

  calculatePmMeterReadings(assetId: string, pmName: string, pmStatus: PmStatus): void {
    cy.getApiAccessToken().then((response) => {
      cy.request({
        method: 'POST',
        url: Cypress.env('baseUrl') + '/api/pmservice/pmcompliance/CalculateMeterReadingPms',
        form: true,
        headers: {
          'authorization': 'Bearer ' + response.body.access_token
        }
      }).then((response) => {
        cy.log(JSON.stringify(response));
      });
    });
    this.doubleClickRecordByText(assetId);
    this.goToSection(Asset.PM_STATUS).wait(2000);
    this.verifyPmStatus(pmName, pmStatus);
  }

  verifyPmStatus(pmName: string, pmStatus: PmStatus): void {
    cy.get(this.locators.pmStatusTable).find('td').contains(pmName).should('be.visible');
    cy.get(this.locators.pmStatusTable).find('td').contains(pmStatus).should('be.visible');
  }

  createWorkEstimate(section: string): void {
    this.clickSectionButton(Asset.WORK_ESTIMATES, this.commonLocators.addButton).wait(5000);
    this.clickElement(this.commonLocators.saveButton).wait(3000);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickVisibleElement(this.commonLocators.alertDialogCloseButton).wait(3000);
    cy.closeCardByTitle(Asset.WORK_ESTIMATE).wait(3000);
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .should('have.length.at.least', 1)
      .find('td')
      .contains('WE-')
      .should('be.visible');
  }

  createWorkOrder(type: string, section: string): void {
    this.clickElement(this.commonLocators.continueButton).wait(3000);
    this.typeAndSelectFromDropdownByText(this.locators.workOrderTypeDropdown, type);
    if (type === 'External') {
      this.clickElement(this.locators.vendorStoreDropdown);
      this.selectFromDropdownByRandomValue(this.locators.vendorStoreDropdown);
    }

    this.clickElement(this.commonLocators.saveButton);
    cy.get(this.locators.workOrderDialog).then(($message) => {
      if ($message.text().includes(this.constants.workOrderDialogMessage)) {
        cy.get('button').contains('No').click();
      }
    });
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickVisibleElement(this.commonLocators.alertDialogCloseButton).wait(3000);
    cy.closeCardByTitle(Asset.WORK_ORDER).wait(3000);
    this.detailCardElements.sectionContainerElements(section, this.commonLocators.table)
      .should('have.length.at.least', 1)
      .find('td')
      .contains('WO-')
      .should('be.visible');
  }

  createSystemAssemblyComponent(): void {
    this.clickSectionButton(Asset.SYSTEM_ASSEMBLY_COMPONENT, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.systemCodeDropdown);
    this.selectFromDropdownByRandomValue(this.locators.assemblyCodeDropdown);
    this.selectFromDropdownByRandomValue(this.locators.componentCodeDropdown);
    this.clickElement(this.locators.systemCodeDropdown).wait(1000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('systemCode');
    this.clickElement(this.locators.assemblyCodeDropdown).wait(1000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('assemblyCode');
    this.clickElement(this.locators.componentCodeDropdown).wait(1000);
    this.getSelectedItemFromDropdown().find('div').first().find('span').first().invoke('text').as('componentCode');
    this.clickSectionButton(Asset.SYSTEM_ASSEMBLY_COMPONENT, this.commonLocators.saveButton);
    cy.get('@systemCode').then((systemCode) => {
      this.detailCardElements.sectionContainerElements(Asset.SYSTEM_ASSEMBLY_COMPONENT, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', systemCode.toString());
    });
    cy.get('@assemblyCode').then((assemblyCode) => {
      this.detailCardElements.sectionContainerElements(Asset.SYSTEM_ASSEMBLY_COMPONENT, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', assemblyCode.toString());
    });
    cy.get('@componentCode').then((componentCode) => {
      this.detailCardElements.sectionContainerElements(Asset.SYSTEM_ASSEMBLY_COMPONENT, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', componentCode.toString());
    });
  }

  createStandardRepair(): void {
    this.clickSectionButton(Asset.STANDARD_REPAIRS, this.commonLocators.addButton).wait(2000);
    this.selectFromDropdownByRandomValue(this.locators.standardRepairDropdown);
    cy.get(this.locators.standardRepairDropdown).invoke('val').as('standardRepair');
    this.clickSectionButton(Asset.STANDARD_REPAIRS, this.commonLocators.saveButton);
    cy.get('@standardRepair').then((standardRepair) => {
      this.detailCardElements.sectionContainerElements(Asset.STANDARD_REPAIRS, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', standardRepair.toString());
    });
  }

  createPartsComponent(): void {
    this.clickSectionButton(Asset.PARTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.partDropdown);
    this.clickElement(this.locators.partDropdown).wait(1000);
    this.getSelectedItemFromDropdown().find('div').first().invoke('text').as('part');
    this.clickSectionButton(Asset.PARTS, this.commonLocators.saveButton);
    cy.get('@part').then((part) => {
      this.detailCardElements.sectionContainerElements(Asset.PARTS, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', part.toString());
    });
  }

  createWarranty(): void {
    this.clickSectionButton(Asset.WARRANTIES, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.warrantyDropdown);
    this.clickElement(this.locators.warrantyDropdown).wait(1000);
    this.getSelectedItemFromDropdown().invoke('text').as('warranty');
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickVisibleElement(this.commonLocators.alertDialogCloseButton);
    cy.closeCardByTitle(Asset.ASSET_WARRANTY);
    cy.get('@warranty').then((warranty) => {
      this.detailCardElements.sectionContainerElements(Asset.WARRANTIES, this.commonLocators.table)
        .should('have.length.at.least', 1)
        .find('td')
        .should('contain.text', warranty.toString());
    });
  }

  createGlSpecification(): void {
    const values = [];
    cy.get(this.locators.glSpecificationItems).each(($item) => {
      cy.wrap($item).wait(1000).click({ force: true }).wait(2000);
      this.selectFromDropdown(0).wait(2000);
      cy.wrap($item).click({ force: true }).invoke('attr', 'placeholder').as('value');
      cy.get('@value').then((value) => {
        values.push(value.toString());
      });
      cy.wrap($item).click({ force: true }).wait(2000);
    });
    this.clickSectionButton(Asset.GL_SPECIFICATIONS, this.commonLocators.saveButton).wait(5000);
    cy.get(this.locators.glSpecificationItems).each(($item, index) => {
      cy.wrap($item).click({ force: true }).invoke('attr', 'placeholder').as('value');
      cy.get('@value').then((value) => {
        expect(value.toString()).to.eq(values[index]);
      });
      cy.wrap($item).click({ force: true }).wait(1000);
    });
  }

  createOperationalHours(): void {
    this.clickSectionButton(Asset.OPERATIONAL_HOURS, this.commonLocators.addButton);
    this.typeWithinField(this.locators.operationalHoursNameInputField, faker.lorem.word() + faker.random.alphaNumeric());
    this.selectFromDropdownByRandomValue(this.locators.operationalHoursDayOfTheWeekDropdown);
    this.clickElement(this.locators.operationalHoursStartTimeDropdown);
    cy.get('button').contains('OK').click({ force: true });
    this.typeWithinField(this.locators.operationalHoursDurationInputField, MathUtils.randomIntFromInterval(1, 30));
    this.clickSectionButton(Asset.OPERATIONAL_HOURS, this.commonLocators.saveButton);
  }

  createDriverAssignment(): void {
    this.clickSectionButton(Asset.DRIVER_ASSIGNMENTS, this.commonLocators.addButton);
    this.selectFromDropdownByRandomValue(this.locators.driverAssignmentDropdown);
    this.clickElement(this.commonLocators.saveButton);
    this.verifyAlertMessage(this.commonConstants.successMessage);
    this.clickVisibleElement(this.commonLocators.alertDialogCloseButton);
  }

  createRecurringCost(tab: Asset = Asset.STANDARD_RECURRING_COST): void {
    if (tab === Asset.STANDARD_RECURRING_COST) {
      this.clickElement(this.locators.recurringCostStandardTab);
      this.clickElement(this.locators.recurringCostStandardAddButton);
      this.selectFromDropdownByRandomValue(this.locators.recurringCostStandardIntervalDropdown);
      this.selectFromDropdownByRandomValue(this.locators.recurringCostStandardSystemCodeDropdown);
      this.clickSectionButton(Asset.RECURRING_COSTS, this.commonLocators.saveButton).wait(4000);
    } else {
      this.clickElement(this.locators.recurringCostDepreciationsTab);
      this.clickElement(this.locators.recurringCostDepreciationAddButton);
      this.typeWithinField(this.locators.recurringCostDepreciationNameInputField, faker.name.firstName() + faker.random.alphaNumeric());
      this.typeWithinField(this.locators.recurringCostDepreciationBookValueInputField, MathUtils.generateRandomNumber(3));
      this.typeWithinField(this.locators.recurringCostDepreciationSalvageValueInputField, MathUtils.generateRandomNumber(3));
      this.selectFromDropdownByRandomValue(this.locators.recurringCostDepreciationIntervalDropdown);
      this.clickSectionButton(Asset.RECURRING_COSTS, this.commonLocators.saveButton).wait(4000);
    }
  }

  selectAssetStatus(status: AssetStatusDisposition): any {
    cy.get(this.locators.dispositionDropdown).wait(1000).click({ force: true });
    let index: number;
    switch (status) {
      case AssetStatusDisposition.ACTIVE_CONFIGURING:
        index = 0;
        break;
      case AssetStatusDisposition.ACTIVE_IN_SERVICE:
        index = 1;
        break;
      case AssetStatusDisposition.ACTIVE_OUT_OF_SERVICE:
        index = 2;
        break;
      case AssetStatusDisposition.INACTIVE_INACTIVE:
        index = 3;
        break;
      default:
        index = 0;
    }
    cy.get(this.commonLocators.expandedDropdown).find('ul').children('li').eq(index).click({ force: true });
  }
}
