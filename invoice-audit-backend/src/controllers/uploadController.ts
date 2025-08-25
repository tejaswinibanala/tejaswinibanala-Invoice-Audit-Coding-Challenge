import { Request, Response } from 'express';
import { parseExcelService } from '../services/excelService';
import { fetchReferenceDrugsService } from '../services/referenceService';
import { validateDiscrepanciesService } from '../services/validationService';
import { DiscrepancyData } from '../types';

export const uploadController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const invoiceDrugs = await parseExcelService(req.file.path);
    
    const referenceDrugs = await fetchReferenceDrugsService();
    
    
    const discrepancies: DiscrepancyData = await validateDiscrepanciesService(
      invoiceDrugs, 
      referenceDrugs
    );

    res.json(discrepancies);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
};
