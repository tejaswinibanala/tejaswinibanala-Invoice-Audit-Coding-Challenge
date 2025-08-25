import { DiscrepancyData, DrugDiscrepancy } from './types';

const generateDrugName = (): string => {
  const drugNames = [
    'Acetaminophen', 'Ibuprofen', 'Aspirin', 'Lisinopril', 'Metformin',
    'Amlodipine', 'Omeprazole', 'Atorvastatin', 'Metoprolol', 'Losartan',
    'Hydrochlorothiazide', 'Furosemide', 'Warfarin', 'Clopidogrel', 'Simvastatin',
    'Pantoprazole', 'Sertraline', 'Escitalopram', 'Bupropion', 'Venlafaxine'
  ];
  const strengths = ['100mg', '200mg', '500mg', '10mg', '20mg', '40mg', '80mg'];
  const formulations = ['Tablet', 'Capsule', 'Liquid', 'Injection', 'Cream'];
  
  const drug = drugNames[Math.floor(Math.random() * drugNames.length)];
  const strength = strengths[Math.floor(Math.random() * strengths.length)];
  const formulation = formulations[Math.floor(Math.random() * formulations.length)];
  
  return `${drug} ${strength} ${formulation}`;
};

const generatePriceData = () => {
  const basePrice = Math.random() * 100 + 0.01; 
  const overchargePercentage = Math.random() * 50 + 10;
  const overcharge = basePrice * (overchargePercentage / 100);
  const recordedPrice = basePrice + overcharge;
  
  return {
    basePrice: Number(basePrice.toFixed(2)),
    recordedPrice: Number(recordedPrice.toFixed(2)),
    overcharge: Number(overcharge.toFixed(2)),
    percentage: Number(overchargePercentage.toFixed(1))
  };
};


const generatePayer = (): string => {
  const payers = [
    'Medicare', 'Medicaid', 'Blue Cross Blue Shield', 'Aetna', 'Cigna',
    'UnitedHealth', 'Humana', 'Kaiser Permanente', 'Anthem', 'Molina'
  ];
  return payers[Math.floor(Math.random() * payers.length)];
};


const generateFormulation = (): string => {
  const formulations = [
    'Tablet', 'Capsule', 'Liquid', 'Injection', 'Cream', 'Gel',
    'Inhaler', 'Patch', 'Suppository', 'Eye Drops', 'Ear Drops'
  ];
  return formulations[Math.floor(Math.random() * formulations.length)];
};


const generateStrength = (): string => {
  const strengths = [
    '100mg', '200mg', '500mg', '10mg', '20mg', '40mg', '80mg',
    '1g', '2.5mg', '5mg', '25mg', '50mg', '75mg', '100mcg',
    '250mcg', '500mcg', '1000 IU', '5000 IU', '10000 IU'
  ];
  return strengths[Math.floor(Math.random() * strengths.length)];
};

export const createPriceDiscrepancy = (overchargePercentage?: number): DrugDiscrepancy => {
  const priceData = generatePriceData();
  const actualOvercharge = overchargePercentage || priceData.overcharge;
  const actualPercentage = overchargePercentage || priceData.percentage;
  
  return {
    drugName: generateDrugName(),
    recordedValue: priceData.recordedPrice,
    expectedValue: priceData.basePrice,
    discrepancyType: 'price',
    overcharge: actualOvercharge,
    percentage: actualPercentage
  };
};


export const createFormulationDiscrepancy = (): DrugDiscrepancy => {
  const recordedFormulation = generateFormulation();
  let expectedFormulation: string;
  
  do {
    expectedFormulation = generateFormulation();
  } while (expectedFormulation === recordedFormulation);
  
  return {
    drugName: generateDrugName(),
    recordedValue: recordedFormulation,
    expectedValue: expectedFormulation,
    discrepancyType: 'formulation'
  };
};


export const createStrengthDiscrepancy = (): DrugDiscrepancy => {
  const recordedStrength = generateStrength();
  let expectedStrength: string;
  
  
  do {
    expectedStrength = generateStrength();
  } while (expectedStrength === recordedStrength);
  
  return {
    drugName: generateDrugName(),
    recordedValue: recordedStrength,
    expectedValue: expectedStrength,
    discrepancyType: 'strength'
  };
};


export const createPayerDiscrepancy = (): DrugDiscrepancy => {
  const recordedPayer = generatePayer();
  let expectedPayer: string;
  
  
  do {
    expectedPayer = generatePayer();
  } while (expectedPayer === recordedPayer);
  
  return {
    drugName: generateDrugName(),
    recordedValue: recordedPayer,
    expectedValue: expectedPayer,
    discrepancyType: 'payer'
  };
};


export const createDiscrepancyData = (options?: {
  priceCount?: number;
  formulationCount?: number;
  strengthCount?: number;
  payerCount?: number;
}): DiscrepancyData => {
  const {
    priceCount = Math.floor(Math.random() * 5) + 1,      
    formulationCount = Math.floor(Math.random() * 3) + 1, 
    strengthCount = Math.floor(Math.random() * 3) + 1,    
    payerCount = Math.floor(Math.random() * 3) + 1        
  } = options || {};

  const priceDiscrepancies = Array.from({ length: priceCount }, () => createPriceDiscrepancy());
  const formulationDiscrepancies = Array.from({ length: formulationCount }, () => createFormulationDiscrepancy());
  const strengthDiscrepancies = Array.from({ length: strengthCount }, () => createStrengthDiscrepancy());
  const payerDiscrepancies = Array.from({ length: payerCount }, () => createPayerDiscrepancy());

  
  const totalPriceDiscrepancies = priceDiscrepancies.length;
  const totalFormulationIssues = formulationDiscrepancies.length;
  const totalStrengthErrors = strengthDiscrepancies.length;
  const totalPayerMismatches = payerDiscrepancies.length;
  const totalIssues = totalPriceDiscrepancies + totalFormulationIssues + totalStrengthErrors + totalPayerMismatches;
  const totalOvercharge = priceDiscrepancies.reduce((sum, item) => sum + (item.overcharge || 0), 0);

  return {
    priceDiscrepancies,
    formulationDiscrepancies,
    strengthDiscrepancies,
    payerDiscrepancies,
    summary: {
      totalPriceDiscrepancies,
      totalFormulationIssues,
      totalStrengthErrors,
      totalPayerMismatches,
      totalIssues,
      totalOvercharge: Number(totalOvercharge.toFixed(2))
    }
  };
};


export const createEdgeCaseData = () => {
  return {
    
    largePrice: createPriceDiscrepancy(999.99),
    
    
    smallPrice: createPriceDiscrepancy(0.01),
    
    zeroPrice: {
      ...createPriceDiscrepancy(0),
      recordedValue: 0,
      expectedValue: 0,
      overcharge: 0,
      percentage: 0
    },
    
    
    specialCharName: {
      ...createPriceDiscrepancy(),
      drugName: 'Drug-500mg (Extended Release) [Special]'
    },
    
    
    longName: {
      ...createPriceDiscrepancy(),
      drugName: 'Very Long Drug Name With Multiple Words And Descriptions That Exceed Normal Lengths'
    }
  };
};


export const createEmptyDiscrepancyData = (): DiscrepancyData => ({
  priceDiscrepancies: [],
  formulationDiscrepancies: [],
  strengthDiscrepancies: [],
  payerDiscrepancies: [],
  summary: {
    totalPriceDiscrepancies: 0,
    totalFormulationIssues: 0,
    totalStrengthErrors: 0,
    totalPayerMismatches: 0,
    totalIssues: 0,
    totalOvercharge: 0
  }
});
