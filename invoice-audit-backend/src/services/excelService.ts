import * as XLSX from 'xlsx';
import { InvoiceDrug } from '../types';

export const parseExcelService = async (filePath: string): Promise<InvoiceDrug[]> => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (!data || data.length < 4) {
      throw new Error('Excel file must have at least 4 rows (header + 3 data rows)');
    }
    
    const rows = data.slice(3);
    
    return rows.map((row: any) => {
      const unitPriceRaw = row[7];
      let unitPrice = 0;
      
      if (unitPriceRaw !== undefined && unitPriceRaw !== null) {
        if (typeof unitPriceRaw === 'string') {
          const cleanedPrice = unitPriceRaw.replace(/[$,]/g, '').trim();
          unitPrice = parseFloat(cleanedPrice) || 0;
        } else if (typeof unitPriceRaw === 'number') {
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
    }).filter(drug => drug.drugName && drug.drugName !== '') as InvoiceDrug[];
    
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
