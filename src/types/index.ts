export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'accountant';
  avatar?: string;
  panNumber?: string;
  aadharNumber?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface TaxForm {
  id: string;
  userId: string;
  assessmentYear: string; // e.g., "2024-25"
  financialYear: string; // e.g., "2023-24"
  formType: 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4';
  status: 'draft' | 'in-review' | 'approved' | 'filed' | 'rejected';
  income: {
    salary: number;
    businessIncome: number;
    capitalGains: number;
    houseProperty: number;
    other: number;
  };
  deductions: {
    section80C: number; // PPF, ELSS, etc.
    section80D: number; // Health insurance
    section80G: number; // Donations
    section24: number; // Home loan interest
    section80E: number; // Education loan
    other: number;
  };
  exemptions: {
    hra: number;
    lta: number;
    other: number;
  };
  taxCalculation: {
    grossTotalIncome: number;
    totalDeductions: number;
    totalExemptions: number;
    taxableIncome: number;
    incomeTax: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    tds: number;
    advanceTax: number;
    selfAssessmentTax: number;
    refund: number;
  };
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  filedAt?: string;
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  type: 'form16' | 'form16a' | 'salarySlip' | 'bankStatement' | 'investmentProof' | 'rentReceipt' | 'panCard' | 'aadharCard' | 'passport' | 'other';
  category: 'income' | 'deduction' | 'exemption' | 'identity' | 'other';
  size: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  url?: string;
  assessmentYear?: string;
  financialYear?: string;
  taxFormId?: string;
  verificationNotes?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalDeductions: number;
  totalExemptions: number;
  taxableIncome: number;
  estimatedTax: number;
  potentialRefund: number;
  assessmentYear: string;
  tds: number;
  advanceTax: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    panNumber?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshAuthToken: () => Promise<boolean>;
}