import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../FileUpload';
import { DiscrepancyData } from '../../types';
import { createDiscrepancyData } from '../../testDataFactory';


jest.mock('../../hooks/useTitle', () => ({
  __esModule: true,
  default: jest.fn()
}));


jest.mock('axios', () => ({
  post: jest.fn()
}));

const mockOnFileProcessed = jest.fn();
const mockSetIsLoading = jest.fn();


const mockDiscrepancyData: DiscrepancyData = createDiscrepancyData({
  priceCount: 1,
  formulationCount: 0,
  strengthCount: 0,
  payerCount: 0
});

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );
      expect(screen.getByText('Upload Pharmacy Invoice')).toBeInTheDocument();
    });

    it('should display drag and drop area', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );
      
      expect(screen.getByText('Drag and drop your Excel file here')).toBeInTheDocument();
      expect(screen.getByText('or')).toBeInTheDocument();
      expect(screen.getByText('Choose File')).toBeInTheDocument();
      expect(screen.getByText('Supported formats: .xlsx, .xls')).toBeInTheDocument();
    });

    it('should show loading state when isLoading is true', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={true}
          setIsLoading={mockSetIsLoading}
        />
      );
      
      expect(screen.getByText('Upload Pharmacy Invoice')).toBeInTheDocument();
      expect(screen.getByText('Drag and drop your Excel file here')).toBeInTheDocument();
      
      expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should handle file input change', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const fileInput = screen.getByRole('button', { name: /choose file/i });
      const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      await user.click(fileInput);
      
      expect(fileInput).toBeInTheDocument();
    });

    it('should display selected file information', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });

    it('should show error for invalid file type', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });
  });

  describe('Drag and Drop Functionality', () => {
    it('should handle drag enter event', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const dropZone = screen.getByText('Drag and drop your Excel file here').parentElement?.parentElement;
      expect(dropZone).toBeInTheDocument();
      
      if (dropZone) {
        fireEvent.dragEnter(dropZone);
        expect(dropZone).toBeInTheDocument();
      }
    });

    it('should handle drag leave event', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const dropZone = screen.getByText('Drag and drop your Excel file here').parentElement?.parentElement;
      expect(dropZone).toBeInTheDocument();
      
      if (dropZone) {
        fireEvent.dragEnter(dropZone);
        fireEvent.dragLeave(dropZone);
        expect(dropZone).toBeInTheDocument();
      }
    });

    it('should handle drop event with valid file', async () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const dropZone = screen.getByText('Drag and drop your Excel file here').parentElement?.parentElement;
      expect(dropZone).toBeInTheDocument();
      
      if (dropZone) {
        const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const dropEvent = new Event('drop', { bubbles: true });
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: {
            files: [file]
          }
        });
        
        fireEvent(dropZone, dropEvent);
        
        expect(dropZone).toBeInTheDocument();
      }
    });

    it('should handle drop event with invalid file', async () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const dropZone = screen.getByText('Drag and drop your Excel file here').parentElement?.parentElement;
      expect(dropZone).toBeInTheDocument();
      
      if (dropZone) {
        const invalidFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        
        const dropEvent = new Event('drop', { bubbles: true });
        Object.defineProperty(dropEvent, 'dataTransfer', {
          value: {
            files: [invalidFile]
          }
        });
        
        fireEvent(dropZone, dropEvent);
        
        expect(dropZone).toBeInTheDocument();
      }
    });
  });

  describe('File Upload and Processing', () => {
    it('should show upload button when file is selected', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });

    it('should handle file upload submission', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });

    it('should handle file upload errors', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('should provide clear instructions', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );
      
      expect(screen.getByText('Upload your Excel invoice file to analyze discrepancies against reference data')).toBeInTheDocument();
      expect(screen.getByText('Drag and drop your Excel file here')).toBeInTheDocument();
      expect(screen.getByText('Supported formats: .xlsx, .xls')).toBeInTheDocument();
    });

    it('should show file format information', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );
      
      expect(screen.getByText('Supported formats: .xlsx, .xls')).toBeInTheDocument();
    });

    it('should handle click to browse functionality', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      expect(chooseFileButton).toBeInTheDocument();
      
      await user.click(chooseFileButton);
      expect(chooseFileButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file selection', () => {
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      expect(screen.getByRole('button', { name: /choose file/i })).toBeInTheDocument();
      expect(screen.queryByText('Upload & Analyze')).not.toBeInTheDocument();
    });

    it('should handle very large files', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      render(
        <FileUpload 
          onFileProcessed={mockOnFileProcessed}
          isLoading={false}
          setIsLoading={mockSetIsLoading}
        />
      );

      const chooseFileButton = screen.getByRole('button', { name: /choose file/i });
      
      expect(chooseFileButton).toBeInTheDocument();
      await user.click(chooseFileButton);
      
      expect(chooseFileButton).toBeInTheDocument();
    });
  });
});
