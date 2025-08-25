import request from 'supertest';
import express from 'express';
import { uploadController } from '../controllers/uploadController';
import { parseExcelService } from '../services/excelService';
import { fetchReferenceDrugsService } from '../services/referenceService';
import { validateDiscrepanciesService } from '../services/validationService';

jest.mock('../services/excelService');
jest.mock('../services/referenceService');
jest.mock('../services/validationService');

const mockParseExcelService = parseExcelService as jest.MockedFunction<typeof parseExcelService>;
const mockFetchReferenceDrugsService = fetchReferenceDrugsService as jest.MockedFunction<typeof fetchReferenceDrugsService>;
const mockValidateDiscrepanciesService = validateDiscrepanciesService as jest.MockedFunction<typeof validateDiscrepanciesService>;

describe('Backend Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.post('/api/upload', (req, res) => {
      req.file = {
        path: '/tmp/test-file.xlsx',
        filename: 'test-file.xlsx',
        originalname: 'test-file.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1024,
        destination: '/tmp',
        fieldname: 'invoice'
      } as any;
      
      uploadController(req as any, res);
    });

    app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Pharmacy Audit Backend Running' });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check Endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Pharmacy Audit Backend Running'
      });
    });
  });

  describe('File Upload Endpoint', () => {
    it('should process Excel file and return discrepancies', async () => {
      const mockInvoiceDrugs = [
        {
          drugName: 'Aspirin',
          unitPrice: 0.55,
          formulation: 'Tablet',
          strength: '100mg',
          payer: 'Medicare'
        }
      ];

      const mockReferenceDrugs = [
        {
          id: 1,
          drugName: 'Aspirin',
          unitPrice: 0.50,
          standardUnitPrice: 0.45,
          formulation: 'Tablet',
          strength: '100mg',
          payer: 'Medicare'
        }
      ];

      const mockDiscrepancies = {
        priceDiscrepancies: [
          {
            drugName: 'Aspirin',
            recordedValue: 0.55,
            expectedValue: 0.45,
            discrepancyType: 'price' as const,
            overcharge: 0.10,
            percentage: 22.22
          }
        ],
        formulationDiscrepancies: [],
        strengthDiscrepancies: [],
        payerDiscrepancies: [],
        summary: {
          totalPriceDiscrepancies: 1,
          totalFormulationIssues: 0,
          totalStrengthErrors: 0,
          totalPayerMismatches: 0,
          totalIssues: 1,
          totalOvercharge: 0.10
        }
      };

      mockParseExcelService.mockResolvedValue(mockInvoiceDrugs);
      mockFetchReferenceDrugsService.mockResolvedValue(mockReferenceDrugs);
      mockValidateDiscrepanciesService.mockResolvedValue(mockDiscrepancies);

      const response = await request(app)
        .post('/api/upload')
        .attach('invoice', Buffer.from('test'), 'test-file.xlsx')
        .expect(200);

      expect(response.body).toEqual(mockDiscrepancies);
      expect(mockParseExcelService).toHaveBeenCalledWith('/tmp/test-file.xlsx');
      expect(mockFetchReferenceDrugsService).toHaveBeenCalled();
      expect(mockValidateDiscrepanciesService).toHaveBeenCalledWith(mockInvoiceDrugs, mockReferenceDrugs);
    });

    it('should handle missing file upload', async () => {
      const testApp = express();
      testApp.use(express.json());
      
      testApp.post('/api/upload', (req, res) => {
        uploadController(req as any, res);
      });

      const response = await request(testApp)
        .post('/api/upload')
        .expect(400);

      expect(response.body).toEqual({ error: 'No file uploaded' });
    });

    it('should handle Excel parsing errors', async () => {
      mockParseExcelService.mockRejectedValue(new Error('Invalid Excel file'));

      const response = await request(app)
        .post('/api/upload')
        .attach('invoice', Buffer.from('test'), 'test-file.xlsx')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to process file' });
    });

    it('should handle reference data fetch errors', async () => {
      mockParseExcelService.mockResolvedValue([]);
      mockFetchReferenceDrugsService.mockRejectedValue(new Error('API unavailable'));

      const response = await request(app)
        .post('/api/upload')
        .attach('invoice', Buffer.from('test'), 'test-file.xlsx')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to process file' });
    });

    it('should handle validation service errors', async () => {
      mockParseExcelService.mockResolvedValue([]);
      mockFetchReferenceDrugsService.mockResolvedValue([]);
      mockValidateDiscrepanciesService.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/api/upload')
        .attach('invoice', Buffer.from('test'), 'test-file.xlsx')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to process file' });
    });
  });

  describe('End-to-End Workflow', () => {
    it('should process complete workflow from Excel to discrepancies', async () => {
      const mockInvoiceDrugs = [
        {
          drugName: 'Ibuprofen',
          unitPrice: 0.80,
          formulation: 'Capsule',
          strength: '200mg',
          payer: 'Blue Cross'
        }
      ];

      const mockReferenceDrugs = [
        {
          id: 2,
          drugName: 'Ibuprofen',
          unitPrice: 0.75,
          standardUnitPrice: 0.70,
          formulation: 'Capsule',
          strength: '200mg',
          payer: 'Blue Cross'
        }
      ];

      const mockDiscrepancies = {
        priceDiscrepancies: [
          {
            drugName: 'Ibuprofen',
            recordedValue: 0.80,
            expectedValue: 0.70,
            discrepancyType: 'price' as const,
            overcharge: 0.10,
            percentage: 14.29
          }
        ],
        formulationDiscrepancies: [],
        strengthDiscrepancies: [],
        payerDiscrepancies: [],
        summary: {
          totalPriceDiscrepancies: 1,
          totalFormulationIssues: 0,
          totalStrengthErrors: 0,
          totalPayerMismatches: 0,
          totalIssues: 1,
          totalOvercharge: 0.10
        }
      };

      mockParseExcelService.mockResolvedValue(mockInvoiceDrugs);
      mockFetchReferenceDrugsService.mockResolvedValue(mockReferenceDrugs);
      mockValidateDiscrepanciesService.mockResolvedValue(mockDiscrepancies);

      const response = await request(app)
        .post('/api/upload')
        .attach('invoice', Buffer.from('test'), 'test-file.xlsx')
        .expect(200);

      expect(response.body.summary.totalPriceDiscrepancies).toBe(1);
      expect(response.body.summary.totalOvercharge).toBe(0.10);
      expect(response.body.priceDiscrepancies[0].percentage).toBeCloseTo(14.29, 1);
      
      expect(mockParseExcelService).toHaveBeenCalledTimes(1);
      expect(mockFetchReferenceDrugsService).toHaveBeenCalledTimes(1);
      expect(mockValidateDiscrepanciesService).toHaveBeenCalledTimes(1);
    });
  });
});
