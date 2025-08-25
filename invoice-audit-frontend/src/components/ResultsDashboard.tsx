import React from 'react';
import { DiscrepancyData } from '../types';
import useTitle from '../hooks/useTitle';

interface ResultsDashboardProps {
  discrepancies: DiscrepancyData;
  onReset: () => void;
}

const ResultsDashboard = ({ discrepancies, onReset }: ResultsDashboardProps) => {
  // Set page title for results page
  useTitle(`Analysis Results - ${discrepancies.summary.totalIssues} Issues Found`);
  
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (percentage: number) => `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
             Analysis Results
          </h2>
          <button
            onClick={onReset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
             Upload New File
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-4xl font-bold text-red-500 mb-2">
            {discrepancies.summary.totalPriceDiscrepancies}
          </div>
          <div className="text-sm text-red-600 font-medium">Price Discrepancies</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(discrepancies.summary.totalOvercharge)} Total Overcharge
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-4xl font-bold text-green-500 mb-2">
            {discrepancies.summary.totalFormulationIssues}
          </div>
          <div className="text-sm text-green-600 font-medium">Formulation Issues</div>
          <div className="text-xs text-gray-500 mt-1">Billing Error</div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-4xl font-bold text-yellow-500 mb-2">
            {discrepancies.summary.totalStrengthErrors}
          </div>
          <div className="text-sm text-yellow-600 font-medium">Strength Errors</div>
          <div className="text-xs text-gray-500 mt-1">Safety Concern</div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-4xl font-bold text-blue-500 mb-2">
            {discrepancies.summary.totalPayerMismatches}
          </div>
          <div className="text-sm text-blue-600 font-medium">Payer Mismatches</div>
          <div className="text-xs text-gray-500 mt-1">Claims Review Needed</div>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-md">
          <div className="text-4xl font-bold text-purple-500 mb-2">
            {discrepancies.summary.totalIssues}
          </div>
          <div className="text-sm text-purple-600 font-medium">Total Issues</div>
          <div className="text-xs text-gray-500 mt-1">Requires Action</div>
        </div>
      </div>

      {/* Price Discrepancy Analysis */}
      {discrepancies.priceDiscrepancies.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-red-700 flex items-center">
               $ Unit Price Discrepancy Analysis
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                    Drug Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                    Recorded Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                    Expected Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                    Est. Overcharge
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                    % Discrepancy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discrepancies.priceDiscrepancies.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.drugName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 text-xs font-medium text-gray-900">
                        {formatCurrency(typeof item.recordedValue === 'number' ? item.recordedValue : parseFloat(String(item.recordedValue)) || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 text-xs font-medium text-gray-900">
                        {formatCurrency(typeof item.expectedValue === 'number' ? item.expectedValue : parseFloat(String(item.expectedValue)) || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                       <div className="flex items-center justify-center space-x-1">
                                                   <svg fill="currentColor" 
                               width="16" height="16" 
                               viewBox="0 0 256 256" 
                               xmlns="http://www.w3.org/2000/svg"
                               className="text-red-600">
                            <path d="M244.00244,56.00513V120a12,12,0,0,1-24,0V84.9707l-75.51465,75.51465a11.99973,11.99973,0,0,1-16.9707,0L96.00244,128.9707,32.48779,192.48535a12.0001,12.0001,0,0,1-16.9707-16.9707l72-72a11.99973,11.99973,0,0,1,16.9707,0l31.51465,31.51465L203.03174,68h-35.0293a12,12,0,0,1,0-24h63.99512c.39746-.00024.79541.02075,1.1914.06006.167.01636.32911.04785.49366.071.22314.0315.44629.05786.66748.10181.19238.03809.37793.09131.56689.13843.19092.04761.3833.09009.57276.14721.18505.05616.36377.126.54492.19068.18847.06714.37793.12939.56347.2063.16846.06982.33008.1521.49415.22949.19091.08936.3833.17432.57031.27441.15527.0835.30273.17847.4541.26856.18506.10986.37207.21484.55225.33545.16455.11035.31884.2334.478.35156.15479.11523.31348.22314.46387.34692.28467.23365.55664.4812.81787.73951.019.01879.04.03418.05908.05322s.03467.04.05371.05908c.2583.262.50635.53418.73975.81885.12012.146.22461.2998.33691.45019.12159.16309.24805.32251.36133.49195.11865.177.22168.36084.33008.54272.0918.1543.189.30518.27393.46387.09863.18408.18213.37329.2705.56128.07862.16723.16211.33179.2334.50317.07569.18311.13721.37036.20362.55664.06591.18311.13623.36377.19287.551.05713.18823.09912.37964.14648.56982.04736.18946.10059.37622.13916.56909.04346.22071.07031.44361.10156.666.02344.16553.05518.32788.07129.49536Q244.00171,55.40808,244.00244,56.00513Z"/>
                          </svg>
                         <span className="text-red-600 font-medium">
                            {formatCurrency(item.overcharge || 0)}
                         </span>
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        (item.percentage || 0) > 33 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-800 text-white'
                      }`}>
                        {formatPercentage(item.percentage || 0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formulation Discrepancy Analysis */}
      {discrepancies.formulationDiscrepancies.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   width="24" height="24" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="2" 
                   strokeLinecap="round" 
                   strokeLinejoin="round"
                   className="w-6 h-6 mr-2">
                <path d="M20.5 3.5a4.5 4.5 0 0 0-6.36 0L3.5 14.14a4.5 4.5 0 0 0 6.36 6.36L20.5 9.86a4.5 4.5 0 0 0 0-6.36z"/>
                <line x1="10" y1="8" x2="16" y2="12"/>
              </svg>
              Formulation Discrepancy Analysis
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Drug Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                    Recorded Formulation
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                    Expected Formulation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discrepancies.formulationDiscrepancies.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.drugName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800">
                        {String(item.recordedValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                        {String(item.expectedValue)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strength Discrepancy Analysis */}
      {discrepancies.strengthDiscrepancies.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-yellow-50 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-yellow-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   width="24" height="24" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="2" 
                   strokeLinecap="round" 
                   strokeLinejoin="round"
                   className="w-6 h-6 mr-2">
                 <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                 <line x1="12" y1="9" x2="12" y2="13"/>
                 <line x1="12" y1="17" x2="12.01" y2="17"/>
               </svg>
               Strength Discrepancy Analysis
             </h3>
           </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">
                    Drug Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-yellow-700 uppercase tracking-wider">
                    Recorded Strength
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-yellow-700 uppercase tracking-wider">
                    Expected Strength
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discrepancies.strengthDiscrepancies.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.drugName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800">
                        {String(item.recordedValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                        {String(item.expectedValue)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payer Discrepancy Analysis */}
      {discrepancies.payerDiscrepancies.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-blue-700 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-6 h-6 mr-2">
                 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                 <circle cx="9" cy="7" r="4"/>
                 <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                 <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
               </svg>
               Payer Discrepancy Analysis
             </h3>
           </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Drug Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Recorded Payer
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Expected Payer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discrepancies.payerDiscrepancies.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.drugName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800">
                        {String(item.recordedValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                        {String(item.expectedValue)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;

