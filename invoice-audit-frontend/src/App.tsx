import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultsDashboard from './components/ResultsDashboard';
import { DiscrepancyData } from './types';
import useTitle from './hooks/useTitle';

function App() {
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useTitle(discrepancies ? `Analysis Results - Pharmacy Audit` 
    : `Pharmacy Data Discrepancy Analysis`
  );

  const handleFileProcessed = (data: DiscrepancyData) => {
    setDiscrepancies(data);
  };

  const handleReset = () => {
    setDiscrepancies(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
           Pharmacy Data Discrepancy Analysis
        </h1>
        
        {!discrepancies ? (
          <FileUpload 
            onFileProcessed={handleFileProcessed}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <ResultsDashboard 
            discrepancies={discrepancies}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
