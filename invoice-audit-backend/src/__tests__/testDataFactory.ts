import { ReferenceDrug, InvoiceDrug } from '../types';

const drugNames = [
  'Amoxicillin', 'Lisinopril', 'Albuterol Sulfate', 'Insulin Glargine',
  'Hydrocodone/APAP', 'Metformin', 'Atorvastatin', 'Omeprazole',
  'Loratadine', 'Prednisone', 'Azithromycin', 'Clonazepam', 'Erythropoietin'
];

const strengths = [
  '250 mg', '20 mg', '90 mcg/actuation', '100 units/mL',
  '10 mg / 325 mg', '1000 mg', '40 mg', '1 mg', '4000 IU/ 0.4 mL'
];

const formulations = [
  'Capsule', 'Tablet', 'Inhaler (MDI)', 'Solution (pen, 3mL)',
  'Tablet (C-II)', 'Tablet (ER)', 'Capsule (DR)', 'Tablet (Z-Pack)',
  'Tablet (C-IV)', 'Injection (vial)'
];

const payers = ['medicaid', 'medicare'];

const generateDrugName = (): string => {
  const drug = drugNames[Math.floor(Math.random() * drugNames.length)];
  const strength = strengths[Math.floor(Math.random() * strengths.length)];
  const formulation = formulations[Math.floor(Math.random() * formulations.length)];
  return `${drug} ${strength} ${formulation}`;
};

const generatePriceData = () => {
  const basePrice = Math.random() * 200 + 0.1;
  const overchargePercentage = Math.random() * 50 + 5;
  const recordedPrice = basePrice * (1 + overchargePercentage / 100);
  const overcharge = recordedPrice - basePrice;
  
  return {
    basePrice: Number(basePrice.toFixed(2)),
    recordedPrice: Number(recordedPrice.toFixed(2)),
    overcharge: Number(overcharge.toFixed(2)),
    percentage: Number(overchargePercentage.toFixed(1))
  };
};

const generatePayer = (): string => {
  return payers[Math.floor(Math.random() * payers.length)];
};

const generateFormulation = (): string => {
  return formulations[Math.floor(Math.random() * formulations.length)];
};

const generateStrength = (): string => {
  return strengths[Math.floor(Math.random() * strengths.length)];
};

export const createReferenceDrug = (overchargePercentage?: number): ReferenceDrug => {
  const priceData = generatePriceData();
  const basePrice = overchargePercentage ? 
    (priceData.recordedPrice / (1 + overchargePercentage / 100)) : 
    priceData.basePrice;
  
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    drugName: generateDrugName(),
    unitPrice: Number(basePrice.toFixed(2)),
    standardUnitPrice: Number(basePrice.toFixed(2)),
    formulation: generateFormulation(),
    strength: generateStrength(),
    payer: generatePayer(),
    pricingNotes: Math.random() > 0.5 ? 'Standard pricing applies' : undefined
  };
};

export const createInvoiceDrug = (overchargePercentage?: number): InvoiceDrug => {
  const priceData = generatePriceData();
  const unitPrice = overchargePercentage ? 
    (priceData.basePrice * (1 + overchargePercentage / 100)) : 
    priceData.recordedPrice;
  
  return {
    drugName: generateDrugName(),
    unitPrice: Number(unitPrice.toFixed(2)),
    formulation: generateFormulation(),
    strength: generateStrength(),
    payer: generatePayer()
  };
};

export const createMatchingDrugPair = (overchargePercentage: number = 22.22): { reference: ReferenceDrug; invoice: InvoiceDrug; } => {
  const drugName = generateDrugName();
  const formulation = generateFormulation();
  const strength = generateStrength();
  const payer = generatePayer();
  
  const basePrice = 1.00;
  const recordedPrice = basePrice * (1 + overchargePercentage / 100);
  
  return {
    reference: {
      id: Math.floor(Math.random() * 1000) + 1,
      drugName,
      unitPrice: basePrice,
      standardUnitPrice: basePrice,
      formulation,
      strength,
      payer
    },
    invoice: {
      drugName,
      unitPrice: recordedPrice, 
      formulation,
      strength,
      payer
    }
  };
};

export const createFormulationDiscrepancyPair = (): { reference: ReferenceDrug; invoice: InvoiceDrug; } => {
  const drugName = generateDrugName();
  const strength = generateStrength();
  const payer = generatePayer();
  const basePrice = Math.random() * 100 + 0.1;
  
  return {
    reference: {
      id: Math.floor(Math.random() * 1000) + 1,
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      standardUnitPrice: Number(basePrice.toFixed(2)),
      formulation: 'Tablet',
      strength,
      payer
    },
    invoice: {
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      formulation: 'Capsule',
      strength,
      payer
    }
  };
};

export const createStrengthDiscrepancyPair = (): { reference: ReferenceDrug; invoice: InvoiceDrug; } => {
  const drugName = generateDrugName();
  const formulation = generateFormulation();
  const payer = generatePayer();
  const basePrice = Math.random() * 100 + 0.1;
  
  return {
    reference: {
      id: Math.floor(Math.random() * 1000) + 1,
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      standardUnitPrice: Number(basePrice.toFixed(2)),
      formulation,
      strength: '20 mg',
      payer
    },
    invoice: {
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      formulation,
      strength: '40 mg',
      payer
    }
  };
};

export const createPayerDiscrepancyPair = (): { reference: ReferenceDrug; invoice: InvoiceDrug; } => {
  const drugName = generateDrugName();
  const formulation = generateFormulation();
  const strength = generateStrength();
  const basePrice = Math.random() * 100 + 0.1;
  
  return {
    reference: {
      id: Math.floor(Math.random() * 1000) + 1,
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      standardUnitPrice: Number(basePrice.toFixed(2)),
      formulation,
      strength,
      payer: 'medicare'
    },
    invoice: {
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      formulation,
      strength,
      payer: 'medicaid'
    }
  };
};

export const createTestDataArrays = (options?: { referenceCount?: number; invoiceCount?: number; discrepancyCount?: number; }) => {
  const referenceCount = options?.referenceCount || 5;
  const invoiceCount = options?.invoiceCount || 5;
  const discrepancyCount = options?.discrepancyCount || 3;
  
  const referenceDrugs: ReferenceDrug[] = [];
  const invoiceDrugs: InvoiceDrug[] = [];
  
  for (let i = 0; i < Math.min(referenceCount, invoiceCount); i++) {
    const drugName = generateDrugName();
    const formulation = generateFormulation();
    const strength = generateStrength();
    const payer = generatePayer();
    const basePrice = Math.random() * 100 + 0.1;
    
    referenceDrugs.push({
      id: Math.floor(Math.random() * 1000) + 1,
      drugName,
      unitPrice: Number(basePrice.toFixed(2)),
      standardUnitPrice: Number(basePrice.toFixed(2)),
      formulation,
      strength,
      payer,
      pricingNotes: Math.random() > 0.5 ? 'Standard pricing applies' : undefined
    });
    
    const hasPriceDiscrepancy = Math.random() > 0.5;
    const hasFormulationDiscrepancy = Math.random() > 0.7;
    const hasStrengthDiscrepancy = Math.random() > 0.8;
    const hasPayerDiscrepancy = Math.random() > 0.9;
    
    invoiceDrugs.push({
      drugName, 
      unitPrice: hasPriceDiscrepancy ? 
        Number((basePrice * (1 + (Math.random() * 50 + 15) / 100)).toFixed(2)) : 
        Number(basePrice.toFixed(2)),
      formulation: hasFormulationDiscrepancy ? 
        (formulation === 'Tablet' ? 'Capsule' : 'Tablet') : 
        formulation,
      strength: hasStrengthDiscrepancy ? 
        (strength === '20 mg' ? '40 mg' : '20 mg') : 
        strength,
      payer: hasPayerDiscrepancy ? 
        (payer === 'medicare' ? 'medicaid' : 'medicare') : 
        payer
    });
  }
  
  
  while (referenceDrugs.length < referenceCount) {
    referenceDrugs.push(createReferenceDrug());
  }
  
  
  while (invoiceDrugs.length < invoiceCount) {
    invoiceDrugs.push(createInvoiceDrug());
  }
  
  return { referenceDrugs, invoiceDrugs };
};

export const createEdgeCaseData = () => {
  const baseDrug = createReferenceDrug();
  
  return {
    emptyString: createReferenceDrug(),
    specialCharacters: {
      ...createReferenceDrug(),
      drugName: 'Drug-Name (Special) & More',
      strength: '100 mg/mL + 50 mcg',
      formulation: 'Tablet (ER) [Extended]'
    },
    veryLongName: {
      ...createReferenceDrug(),
      drugName: 'Very Long Drug Name That Exceeds Normal Length Limits And Should Be Handled Properly By The System',
      pricingNotes: 'This is a very long pricing note that should also be handled properly by the system without causing any issues'
    },
    extremePrices: {
      ...createReferenceDrug(),
      standardUnitPrice: 0.001,
      pricingNotes: 'Very low price drug'
    },
    largePrice: {
      reference: {
        ...baseDrug,
        drugName: 'Large Price Drug',
        standardUnitPrice: 1000.00,
        unitPrice: 1000.00
      },
      invoice: {
        drugName: 'Large Price Drug', 
        unitPrice: 1500.00,
        formulation: baseDrug.formulation,
        strength: baseDrug.strength,
        payer: baseDrug.payer
      }
    },
    smallPrice: {
      reference: {
        ...baseDrug,
        drugName: 'Small Price Drug',
        standardUnitPrice: 0.01,
        unitPrice: 0.01
      },
      invoice: {
        drugName: 'Small Price Drug', 
        unitPrice: 0.02,
        formulation: baseDrug.formulation,
        strength: baseDrug.strength,
        payer: baseDrug.payer
      }
    },
    zeroPrice: {
      reference: {
        ...baseDrug,
        drugName: 'Zero Price Drug',
        standardUnitPrice: 0,
        unitPrice: 0
      },
      invoice: {
        drugName: 'Zero Price Drug', 
        unitPrice: 0,
        formulation: baseDrug.formulation,
        strength: baseDrug.strength,
        payer: baseDrug.payer
      }
    }
  };
};
