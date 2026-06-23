export interface PatientRecord {
  id: string; // e.g., "PT-00482"
  name: string;
  age: number;
  gender: string;
  marker: 'Glucose' | 'HbA1c' | 'Creatinine' | 'Potassium';
  value: number;
  unit: string;
  status: 'Normal' | 'High' | 'Pre-diabetic' | 'Low';
  referenceRange: string;
  date: string;
}

export interface ClinicalAlert {
  id: string;
  type: 'error' | 'success' | 'info';
  title: string;
  message: string;
  date: string;
  patientId?: string;
}

export interface DesignToken {
  name: string;
  tokenName: string;
  value: string;
  description: string;
  category: 'brand' | 'semantic' | 'typography' | 'spacing' | 'motion';
}
