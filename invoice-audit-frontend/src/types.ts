export interface DrugDiscrepancy {
  drugName: string;
  recordedValue: string | number;
  expectedValue: string | number;
  discrepancyType: 'price' | 'formulation' | 'strength' | 'payer';
  overcharge?: number;
  percentage?: number;
}

export interface DiscrepancyData {
  priceDiscrepancies: DrugDiscrepancy[];
  formulationDiscrepancies: DrugDiscrepancy[];
  strengthDiscrepancies: DrugDiscrepancy[];
  payerDiscrepancies: DrugDiscrepancy[];
  summary: {
    totalPriceDiscrepancies: number;
    totalFormulationIssues: number;
    totalStrengthErrors: number;
    totalPayerMismatches: number;
    totalIssues: number;
    totalOvercharge: number;
  };
}

export interface ReferenceDrug {
  id: number;
  drugName: string;
  unitPrice: number;
  standardUnitPrice: number; 
  formulation: string;
  strength: string;
  payer: string;
  pricingNotes?: string; 
}

