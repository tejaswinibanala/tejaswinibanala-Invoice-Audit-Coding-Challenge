"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
const excelService_1 = require("../services/excelService");
const referenceService_1 = require("../services/referenceService");
const validationService_1 = require("../services/validationService");
const uploadController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const invoiceDrugs = await (0, excelService_1.parseExcelService)(req.file.path);
        const referenceDrugs = await (0, referenceService_1.fetchReferenceDrugsService)();
        const discrepancies = await (0, validationService_1.validateDiscrepanciesService)(invoiceDrugs, referenceDrugs);
        res.json(discrepancies);
    }
    catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
};
exports.uploadController = uploadController;
