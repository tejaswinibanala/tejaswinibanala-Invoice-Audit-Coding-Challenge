"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiscrepanciesService = void 0;
const normalizeString = (str) => {
    return str.replace(/\s+/g, '').toLowerCase();
};
const normalizeStrength = (strength) => {
    return strength
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/mg|mcg|iu|units?/g, '')
        .replace(/[,]/g, '')
        .replace(/\/+/g, '/')
        .trim();
};
const normalizeFormulation = (formulation) => {
    return formulation
        .replace(/\(.*?\)/g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
};
const validateDiscrepanciesService = async (invoiceDrugs, referenceDrugs) => {
    const priceDiscrepancies = [];
    const formulationDiscrepancies = [];
    const strengthDiscrepancies = [];
    const payerDiscrepancies = [];
    invoiceDrugs.forEach(invoiceDrug => {
        const referenceDrug = referenceDrugs.find(ref => ref.drugName.toLowerCase() === invoiceDrug.drugName.toLowerCase());
        if (!referenceDrug)
            return;
        const priceDiff = invoiceDrug.unitPrice - referenceDrug.standardUnitPrice;
        const percentageDiff = (priceDiff / referenceDrug.standardUnitPrice) * 100;
        if (percentageDiff > 10) {
            priceDiscrepancies.push({
                drugName: invoiceDrug.drugName,
                recordedValue: invoiceDrug.unitPrice,
                expectedValue: referenceDrug.standardUnitPrice,
                discrepancyType: 'price',
                overcharge: priceDiff,
                percentage: percentageDiff
            });
        }
        if (normalizeFormulation(invoiceDrug.formulation) !== normalizeFormulation(referenceDrug.formulation)) {
            formulationDiscrepancies.push({
                drugName: invoiceDrug.drugName,
                recordedValue: invoiceDrug.formulation,
                expectedValue: referenceDrug.formulation,
                discrepancyType: 'formulation'
            });
        }
        if (normalizeStrength(invoiceDrug.strength) !== normalizeStrength(referenceDrug.strength)) {
            strengthDiscrepancies.push({
                drugName: invoiceDrug.drugName,
                recordedValue: invoiceDrug.strength,
                expectedValue: referenceDrug.strength,
                discrepancyType: 'strength'
            });
        }
        if (normalizeString(invoiceDrug.payer) !== normalizeString(referenceDrug.payer)) {
            payerDiscrepancies.push({
                drugName: invoiceDrug.drugName,
                recordedValue: invoiceDrug.payer,
                expectedValue: referenceDrug.payer,
                discrepancyType: 'payer'
            });
        }
    });
    const totalOvercharge = priceDiscrepancies.reduce((sum, item) => sum + (item.overcharge || 0), 0);
    return {
        priceDiscrepancies,
        formulationDiscrepancies,
        strengthDiscrepancies,
        payerDiscrepancies,
        summary: {
            totalPriceDiscrepancies: priceDiscrepancies.length,
            totalFormulationIssues: formulationDiscrepancies.length,
            totalStrengthErrors: strengthDiscrepancies.length,
            totalPayerMismatches: payerDiscrepancies.length,
            totalIssues: priceDiscrepancies.length +
                formulationDiscrepancies.length +
                strengthDiscrepancies.length +
                payerDiscrepancies.length,
            totalOvercharge
        }
    };
};
exports.validateDiscrepanciesService = validateDiscrepanciesService;
