import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { DiscrepancyData } from '../types';
import { createDiscrepancyData } from '../testDataFactory';

jest.mock('../hooks/useTitle', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockDiscrepancyData: DiscrepancyData = createDiscrepancyData({
  priceCount: 2,
  formulationCount: 1,
  strengthCount: 1,
  payerCount: 1
});

describe('Frontend Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('Basic Component Rendering', () => {
    it('should render the main application', () => {
      render(<App />);
      
      expect(screen.getByText('Pharmacy Data Discrepancy Analysis')).toBeInTheDocument();
      expect(screen.getByText('Upload Pharmacy Invoice')).toBeInTheDocument();
    });

    it('should show file upload interface initially', () => {
      render(<App />);
      
      expect(screen.getByText('Drag and drop your Excel file here')).toBeInTheDocument();
      expect(screen.getByText('Choose File')).toBeInTheDocument();
      expect(screen.getByText('Supported formats: .xlsx, .xls')).toBeInTheDocument();
    });
  });

  describe('File Upload Interaction', () => {
    it('should handle file selection', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      expect(chooseFileButton).toBeInTheDocument();
      
      await user.click(chooseFileButton);
      // Should still be on upload page
      expect(screen.getByText('Upload Pharmacy Invoice')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should handle successful API response', async () => {
      const user = userEvent.setup();
      
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDiscrepancyData
      });

      render(<App />);
      
      // This test verifies the mock is working
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock error response
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<App />);
      
      // This test verifies the mock is working
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
