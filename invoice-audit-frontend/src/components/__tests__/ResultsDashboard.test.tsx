import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultsDashboard from '../ResultsDashboard';
import { DiscrepancyData } from '../../types';
import { 
  createDiscrepancyData, 
  createEmptyDiscrepancyData, 
  createEdgeCaseData 
} from '../../testDataFactory';

jest.mock('../../hooks/useTitle', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockDiscrepancies: DiscrepancyData = createDiscrepancyData({
  priceCount: 2,
  formulationCount: 1,
  strengthCount: 1,
  payerCount: 1
});

const mockOnReset = jest.fn();

describe('ResultsDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    });

    it('should display correct summary information', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      expect(screen.getByText(mockDiscrepancies.summary.totalPriceDiscrepancies.toString())).toBeInTheDocument();
      
      const totalIssues = screen.getByText(mockDiscrepancies.summary.totalIssues.toString());
      expect(totalIssues).toBeInTheDocument();
      
      const totalOverchargeText = `$${mockDiscrepancies.summary.totalOvercharge.toFixed(2)} Total Overcharge`;
      expect(screen.getByText(totalOverchargeText)).toBeInTheDocument();
    });

    it('should display reset button', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      expect(screen.getByText('Upload New File')).toBeInTheDocument();
    });
  });

  describe('Price Discrepancy Table', () => {
    it('should render price discrepancy table with correct data', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      expect(screen.getByText('$ Unit Price Discrepancy Analysis')).toBeInTheDocument();
      
      mockDiscrepancies.priceDiscrepancies.forEach(discrepancy => {
        expect(screen.getByText(discrepancy.drugName)).toBeInTheDocument();
        if (typeof discrepancy.recordedValue === 'number') {
          expect(screen.getByText(`$${discrepancy.recordedValue.toFixed(2)}`)).toBeInTheDocument();
        }
        if (typeof discrepancy.expectedValue === 'number') {
          expect(screen.getByText(`$${discrepancy.expectedValue.toFixed(2)}`)).toBeInTheDocument();
        }
      });
      
      const drugNameHeaders = screen.getAllByText('Drug Name');
      expect(drugNameHeaders.length).toBeGreaterThan(0);
      
      const recordedPriceHeaders = screen.getAllByText('Recorded Price');
      expect(recordedPriceHeaders.length).toBeGreaterThan(0);
      
      const expectedPriceHeaders = screen.getAllByText('Expected Price');
      expect(expectedPriceHeaders.length).toBeGreaterThan(0);
      
      const overchargeHeaders = screen.getAllByText('Est. Overcharge');
      expect(overchargeHeaders.length).toBeGreaterThan(0);
      
      const discrepancyHeaders = screen.getAllByText('% Discrepancy');
      expect(discrepancyHeaders.length).toBeGreaterThan(0);
    });

    it('should display correct table headers', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      const headers = screen.getAllByText('Drug Name');
      expect(headers[0]).toBeInTheDocument();
      
      expect(screen.getByText('Recorded Price')).toBeInTheDocument();
      expect(screen.getByText('Expected Price')).toBeInTheDocument();
      expect(screen.getByText('Est. Overcharge')).toBeInTheDocument();
      expect(screen.getByText('% Discrepancy')).toBeInTheDocument();
    });

    it('should handle percentage display correctly', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      mockDiscrepancies.priceDiscrepancies.forEach(discrepancy => {
        if (discrepancy.percentage !== undefined) {
          const percentageText = `${discrepancy.percentage > 0 ? '+' : ''}${discrepancy.percentage.toFixed(1)}%`;
          expect(screen.getByText(percentageText)).toBeInTheDocument();
        }
      });
    });
  });

  describe('Formulation Discrepancy Table', () => {
    it('should render formulation discrepancy table', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      expect(screen.getByText('Formulation Discrepancy Analysis')).toBeInTheDocument();
      
      mockDiscrepancies.formulationDiscrepancies.forEach(discrepancy => {
        expect(screen.getByText(discrepancy.drugName)).toBeInTheDocument();
        expect(screen.getByText(String(discrepancy.recordedValue))).toBeInTheDocument();
        expect(screen.getByText(String(discrepancy.expectedValue))).toBeInTheDocument();
      });
    });

    it('should display pill icon in header', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      const formulationHeader = screen.getByText('Formulation Discrepancy Analysis');
      expect(formulationHeader).toBeInTheDocument();
      expect(formulationHeader.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Strength Discrepancy Table', () => {
    it('should render strength discrepancy table', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      expect(screen.getByText('Strength Discrepancy Analysis')).toBeInTheDocument();
      
      mockDiscrepancies.strengthDiscrepancies.forEach(discrepancy => {
        expect(screen.getByText(discrepancy.drugName)).toBeInTheDocument();
        expect(screen.getByText(String(discrepancy.recordedValue))).toBeInTheDocument();
        expect(screen.getByText(String(discrepancy.expectedValue))).toBeInTheDocument();
      });
    });

    it('should display warning triangle icon in header', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      const strengthHeader = screen.getByText('Strength Discrepancy Analysis');
      expect(strengthHeader).toBeInTheDocument();
      expect(strengthHeader.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Payer Discrepancy Table', () => {
    it('should render payer discrepancy table', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      expect(screen.getByText('Payer Discrepancy Analysis')).toBeInTheDocument();
      
      mockDiscrepancies.payerDiscrepancies.forEach(discrepancy => {
        expect(screen.getByText(discrepancy.drugName)).toBeInTheDocument();
        expect(screen.getByText(String(discrepancy.recordedValue))).toBeInTheDocument();
        expect(screen.getByText(String(discrepancy.expectedValue))).toBeInTheDocument();
      });
    });

    it('should display group of people icon in header', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      const payerHeader = screen.getByText('Payer Discrepancy Analysis');
      expect(payerHeader).toBeInTheDocument();
      expect(payerHeader.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onReset when reset button is clicked', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      const resetButton = screen.getByText('Upload New File');
      fireEvent.click(resetButton);
      
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('should handle hover effects on table rows', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      const firstDrugName = mockDiscrepancies.priceDiscrepancies[0].drugName;
      const firstDrugEntry = screen.getByText(firstDrugName);
      const drugRow = firstDrugEntry.closest('tr');
      expect(drugRow).toBeInTheDocument();
      
      if (drugRow) {
        fireEvent.mouseEnter(drugRow);
        expect(drugRow).toBeInTheDocument();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty discrepancy arrays', () => {
      const emptyDiscrepancies = createEmptyDiscrepancyData();

      render(<ResultsDashboard discrepancies={emptyDiscrepancies} onReset={mockOnReset} />);
      
      const zeroValues = screen.getAllByText('0');
      expect(zeroValues.length).toBe(5);
      
      expect(screen.getByText('$0.00 Total Overcharge')).toBeInTheDocument();
      
      expect(screen.queryByText('$ Unit Price Discrepancy Analysis')).not.toBeInTheDocument();
      expect(screen.queryByText('Formulation Discrepancy Analysis')).not.toBeInTheDocument();
      expect(screen.queryByText('Strength Discrepancy Analysis')).not.toBeInTheDocument();
      expect(screen.queryByText('Payer Discrepancy Analysis')).not.toBeInTheDocument();
    });

    it('should handle mixed data types in recordedValue and expectedValue', () => {
      const mixedDiscrepancies = createDiscrepancyData({ priceCount: 1 });
      mixedDiscrepancies.priceDiscrepancies[0].recordedValue = '0.55' as any;
      mixedDiscrepancies.priceDiscrepancies[0].drugName = 'Test Drug';

      render(<ResultsDashboard discrepancies={mixedDiscrepancies} onReset={mockOnReset} />);
      
      expect(screen.getByText('Test Drug')).toBeInTheDocument();
    });
  });

  describe('Utility Functions', () => {
    it('should format currency correctly', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      mockDiscrepancies.priceDiscrepancies.forEach(discrepancy => {
        if (typeof discrepancy.recordedValue === 'number') {
          expect(screen.getByText(`$${discrepancy.recordedValue.toFixed(2)}`)).toBeInTheDocument();
        }
        if (typeof discrepancy.expectedValue === 'number') {
          expect(screen.getByText(`$${discrepancy.expectedValue.toFixed(2)}`)).toBeInTheDocument();
        }
      });
      
      mockDiscrepancies.priceDiscrepancies.forEach(discrepancy => {
        if (discrepancy.overcharge !== undefined) {
          const overchargeText = `$${discrepancy.overcharge.toFixed(2)}`;
          expect(screen.getByText(overchargeText)).toBeInTheDocument();
        }
      });
    });

    it('should format percentages correctly', () => {
      render(<ResultsDashboard discrepancies={mockDiscrepancies} onReset={mockOnReset} />);
      
      mockDiscrepancies.priceDiscrepancies.forEach(discrepancy => {
        if (discrepancy.percentage !== undefined) {
          const percentageText = `${discrepancy.percentage > 0 ? '+' : ''}${discrepancy.percentage.toFixed(1)}%`;
          expect(screen.getByText(percentageText)).toBeInTheDocument();
        }
      });
    });
  });
});
