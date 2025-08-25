"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const parseExcelService = async (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!data || data.length < 4) {
            throw new Error('Excel file must have at least 4 rows (header + 3 data rows)');
        }
        const rows = data.slice(3);
        return rows.map((row) => {
            const unitPriceRaw = row[7];
            let unitPrice = 0;
            if (unitPriceRaw !== undefined && unitPriceRaw !== null) {
                if (typeof unitPriceRaw === 'string') {
                    const cleanedPrice = unitPriceRaw.replace(/[$,]/g, '').trim();
                    unitPrice = parseFloat(cleanedPrice) || 0;
                }
                else if (typeof unitPriceRaw === 'number') {
                    unitPrice = unitPriceRaw;
                }
            }
            return {
                drugName: String(row[1] || '').trim(),
                unitPrice: unitPrice,
                formulation: String(row[3] || '').trim(),
                strength: String(row[2] || '').trim(),
                payer: String(row[5] || '').trim()
            };
        }).filter(drug => drug.drugName && drug.drugName !== '');
    }
    catch (error) {
        console.error('Error parsing Excel file:', error);
        throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.parseExcelService = parseExcelService;
