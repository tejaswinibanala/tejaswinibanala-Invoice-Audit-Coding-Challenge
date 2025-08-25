"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationService_1 = require("../services/validationService");
const testDataFactory_1 = require("./testDataFactory");
describe('Validation Service', () => {
    const { referenceDrugs: mockReferenceDrugs, invoiceDrugs: mockInvoiceDrugs } = (0, testDataFactory_1.createTestDataArrays)({
        referenceCount: 3,
        invoiceCount: 3,
        discrepancyCount: 2
    });
    describe('Price Discrepancy Validation', () => {
        it('should flag price discrepancy when overcharge > 10%', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(25);
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.priceDiscrepancies).toHaveLength(1);
            const discrepancy = result.priceDiscrepancies[0];
            expect(discrepancy.overcharge).toBeGreaterThan(0);
            expect(discrepancy.percentage).toBeGreaterThan(10);
        });
        it('should not flag price discrepancy when overcharge <= 10%', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(5);
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.priceDiscrepancies).toHaveLength(0);
        });
        it('should calculate correct overcharge amount', async () => {
            // Create a specific drug pair with known values for testing
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(14.29); // 14.29% overcharge
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.priceDiscrepancies[0].overcharge).toBeCloseTo(0.14, 2);
            expect(result.priceDiscrepancies[0].percentage).toBeCloseTo(14.29, 1);
        });
    });
    describe('Formulation Discrepancy Validation', () => {
        it('should flag formulation mismatch ignoring packaging details', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(0); // No price discrepancy
            // Set same base formulation but add packaging details to invoice
            reference.formulation = 'Tablet';
            invoice.formulation = 'Tablet (10mL)'; // With packaging details
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.formulationDiscrepancies).toHaveLength(0); // Should match after normalization
        });
        it('should flag formulation mismatch for different formulations', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createFormulationDiscrepancyPair)();
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.formulationDiscrepancies).toHaveLength(1);
            expect(result.formulationDiscrepancies[0].recordedValue).toBe('Capsule');
            expect(result.formulationDiscrepancies[0].expectedValue).toBe('Tablet');
        });
    });
    describe('Strength Discrepancy Validation', () => {
        it('should normalize strength by removing units and spaces', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(0); // No price discrepancy
            // Set same base strength but add units and commas to invoice
            reference.strength = '20000iu';
            invoice.strength = '20,000 IU'; // With units and commas
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.strengthDiscrepancies).toHaveLength(0); // Should match after normalization
        });
        it('should flag strength mismatch for different strengths', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(0); // No price discrepancy
            // Set different strengths to test mismatch detection
            reference.strength = '20 mg';
            invoice.strength = '40 mg'; // Different strength
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.strengthDiscrepancies).toHaveLength(1);
            expect(result.strengthDiscrepancies[0].recordedValue).toBe('40 mg');
            expect(result.strengthDiscrepancies[0].expectedValue).toBe('20 mg');
        });
        it('should normalize slashes in strength values', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(0); // No price discrepancy
            // Modify strengths to test slash normalization
            reference.strength = '5/325mg';
            invoice.strength = '5mg/325mg'; // Different slash format
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.strengthDiscrepancies).toHaveLength(0); // Should match after normalization
        });
    });
    describe('Payer Discrepancy Validation', () => {
        it('should normalize payer by removing spaces and converting to lowercase', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(0); // No price discrepancy
            // Modify invoice to have space in payer that should be normalized
            invoice.payer = 'Medi Care'; // With space
            reference.payer = 'medicare'; // Without space
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.payerDiscrepancies).toHaveLength(0); // Should match after normalization
        });
        it('should flag payer mismatch for different payers', async () => {
            const { reference, invoice } = (0, testDataFactory_1.createPayerDiscrepancyPair)();
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.payerDiscrepancies).toHaveLength(1);
            expect(result.payerDiscrepancies[0].recordedValue).toBe('medicaid');
            expect(result.payerDiscrepancies[0].expectedValue).toBe('medicare');
        });
    });
    describe('Summary Calculations', () => {
        it('should calculate correct summary totals', async () => {
            // Create a drug with multiple discrepancies
            const { reference, invoice } = (0, testDataFactory_1.createMatchingDrugPair)(25); // Price discrepancy
            invoice.formulation = 'Capsule'; // Different from reference
            invoice.strength = '40 mg'; // Different from reference
            invoice.payer = 'medicaid'; // Different from reference
            reference.payer = 'medicare'; // Ensure reference has different payer
            const result = await (0, validationService_1.validateDiscrepanciesService)([invoice], [reference]);
            expect(result.summary.totalPriceDiscrepancies).toBe(1);
            expect(result.summary.totalFormulationIssues).toBe(1);
            expect(result.summary.totalStrengthErrors).toBe(1);
            expect(result.summary.totalPayerMismatches).toBe(1);
            expect(result.summary.totalIssues).toBe(4);
            expect(result.summary.totalOvercharge).toBeGreaterThan(0);
        });
        it('should handle drugs not found in reference data', async () => {
            const invoiceDrugs = [
                {
                    drugName: 'Unknown Drug',
                    unitPrice: 1.00,
                    formulation: 'Tablet',
                    strength: '50mg',
                    payer: 'Medicare'
                }
            ];
            const result = await (0, validationService_1.validateDiscrepanciesService)(invoiceDrugs, mockReferenceDrugs);
            expect(result.summary.totalIssues).toBe(0);
            expect(result.summary.totalOvercharge).toBe(0);
        });
    });
    describe('Dynamic Data Testing', () => {
        it('should handle various drug data formats', async () => {
            // Test with different data combinations
            const { referenceDrugs, invoiceDrugs } = (0, testDataFactory_1.createTestDataArrays)({
                referenceCount: 5,
                invoiceCount: 5,
                discrepancyCount: 3
            });
            const result = await (0, validationService_1.validateDiscrepanciesService)(invoiceDrugs, referenceDrugs);
            // Should process all drugs and find discrepancies
            expect(result.summary.totalIssues).toBeGreaterThan(0);
            expect(result.summary.totalIssues).toBeLessThanOrEqual(10); // Allow for more discrepancies
        });
        it('should handle edge case data', async () => {
            const edgeCases = (0, testDataFactory_1.createEdgeCaseData)();
            // Test with very large numbers
            const result1 = await (0, validationService_1.validateDiscrepanciesService)([edgeCases.largePrice.invoice], [edgeCases.largePrice.reference]);
            expect(result1.summary.totalIssues).toBeGreaterThan(0);
            // Test with very small numbers
            const result2 = await (0, validationService_1.validateDiscrepanciesService)([edgeCases.smallPrice.invoice], [edgeCases.smallPrice.reference]);
            expect(result2.summary.totalIssues).toBeGreaterThan(0);
            // Test with zero values
            const result3 = await (0, validationService_1.validateDiscrepanciesService)([edgeCases.zeroPrice.invoice], [edgeCases.zeroPrice.reference]);
            expect(result3.summary.totalIssues).toBe(0); // No discrepancy when both are 0
        });
    });
});
