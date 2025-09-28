import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

interface TaxCalculation {
  grossIncome: number;
  deductions: number;
  exemptions: number;
  taxableIncome: number;
  incomeTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  tds: number;
  advanceTax: number;
  selfAssessmentTax: number;
  refund: number;
}

const AdvancedTaxCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    // Income
    salary: 0,
    businessIncome: 0,
    capitalGains: 0,
    houseProperty: 0,
    otherIncome: 0,
    
    // Deductions
    section80C: 0,
    section80D: 0,
    section80G: 0,
    section24: 0,
    section80E: 0,
    section80TTA: 0,
    otherDeductions: 0,
    
    // Exemptions
    hra: 0,
    lta: 0,
    medicalAllowance: 0,
    otherExemptions: 0,
    
    // Tax Payments
    tds: 0,
    advanceTax: 0,
    
    // Personal Info
    age: 60,
    isSeniorCitizen: false,
    isSuperSeniorCitizen: false
  });

  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    calculateTax();
  }, [formData]);

  const calculateTax = () => {
    const grossIncome = formData.salary + formData.businessIncome + formData.capitalGains + 
                       formData.houseProperty + formData.otherIncome;
    
    const totalDeductions = formData.section80C + formData.section80D + formData.section80G + 
                           formData.section24 + formData.section80E + formData.section80TTA + 
                           formData.otherDeductions;
    
    const totalExemptions = formData.hra + formData.lta + formData.medicalAllowance + 
                           formData.otherExemptions;
    
    const taxableIncome = Math.max(0, grossIncome - totalDeductions - totalExemptions);
    
    // Calculate tax based on age
    let tax = 0;
    let surcharge = 0;
    let cess = 0;

    if (formData.isSuperSeniorCitizen) {
      // Super Senior Citizen (80+ years)
      if (taxableIncome <= 500000) {
        tax = 0;
      } else if (taxableIncome <= 1000000) {
        tax = (taxableIncome - 500000) * 0.20;
      } else {
        tax = 100000 + (taxableIncome - 1000000) * 0.30;
      }
    } else if (formData.isSeniorCitizen) {
      // Senior Citizen (60-79 years)
      if (taxableIncome <= 300000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 10000 + (taxableIncome - 500000) * 0.20;
      } else {
        tax = 110000 + (taxableIncome - 1000000) * 0.30;
      }
    } else {
      // Regular taxpayer
      if (taxableIncome <= 250000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 750000) {
        tax = 12500 + (taxableIncome - 500000) * 0.10;
      } else if (taxableIncome <= 1000000) {
        tax = 37500 + (taxableIncome - 750000) * 0.15;
      } else if (taxableIncome <= 1250000) {
        tax = 75000 + (taxableIncome - 1000000) * 0.20;
      } else if (taxableIncome <= 1500000) {
        tax = 125000 + (taxableIncome - 1250000) * 0.25;
      } else {
        tax = 187500 + (taxableIncome - 1500000) * 0.30;
      }
    }

    // Surcharge calculation
    if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      surcharge = tax * 0.10;
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      surcharge = tax * 0.15;
    } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
      surcharge = tax * 0.25;
    } else if (taxableIncome > 50000000) {
      surcharge = tax * 0.37;
    }

    // Health and Education Cess (4%)
    cess = (tax + surcharge) * 0.04;

    const totalTax = tax + surcharge + cess;
    const selfAssessmentTax = Math.max(0, totalTax - formData.tds - formData.advanceTax);
    const refund = Math.max(0, formData.tds + formData.advanceTax - totalTax);

    setCalculation({
      grossIncome,
      deductions: totalDeductions,
      exemptions: totalExemptions,
      taxableIncome,
      incomeTax: Math.round(tax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
      tds: formData.tds,
      advanceTax: formData.advanceTax,
      selfAssessmentTax: Math.round(selfAssessmentTax),
      refund: Math.round(refund)
    });
  };

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      isSeniorCitizen: prev.age >= 60 && prev.age < 80,
      isSuperSeniorCitizen: prev.age >= 80
    }));
  };

  const handleAgeChange = (age: number) => {
    setFormData(prev => ({
      ...prev,
      age,
      isSeniorCitizen: age >= 60 && age < 80,
      isSuperSeniorCitizen: age >= 80
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const downloadReport = () => {
    if (!calculation) return;

    const reportData = {
      ...formData,
      calculation,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-calculation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Tax calculation report downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate your income tax liability for FY 2023-24</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowBreakdown(!showBreakdown)}
            icon={<TrendingUp className="w-4 h-4" />}
          >
            {showBreakdown ? 'Hide' : 'Show'} Breakdown
          </Button>
          <Button
            onClick={downloadReport}
            icon={<Download className="w-4 h-4" />}
          >
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleAgeChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="18"
                  max="100"
                />
                {formData.isSeniorCitizen && (
                  <p className="text-sm text-green-600 mt-1">
                    Senior Citizen (60-79 years) - Lower tax rates apply
                  </p>
                )}
                {formData.isSuperSeniorCitizen && (
                  <p className="text-sm text-green-600 mt-1">
                    Super Senior Citizen (80+ years) - Lowest tax rates apply
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Income Sources</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Income
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Income
                </label>
                <input
                  type="number"
                  value={formData.businessIncome}
                  onChange={(e) => handleInputChange('businessIncome', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capital Gains
                </label>
                <input
                  type="number"
                  value={formData.capitalGains}
                  onChange={(e) => handleInputChange('capitalGains', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Property Income
                </label>
                <input
                  type="number"
                  value={formData.houseProperty}
                  onChange={(e) => handleInputChange('houseProperty', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Income
                </label>
                <input
                  type="number"
                  value={formData.otherIncome}
                  onChange={(e) => handleInputChange('otherIncome', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Deductions</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section 80C (PPF, ELSS, etc.) - Max ₹1,50,000
                </label>
                <input
                  type="number"
                  value={formData.section80C}
                  onChange={(e) => handleInputChange('section80C', Math.min(parseFloat(e.target.value) || 0, 150000))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  max="150000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section 80D (Health Insurance) - Max ₹25,000
                </label>
                <input
                  type="number"
                  value={formData.section80D}
                  onChange={(e) => handleInputChange('section80D', Math.min(parseFloat(e.target.value) || 0, 25000))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  max="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section 24 (Home Loan Interest) - Max ₹2,00,000
                </label>
                <input
                  type="number"
                  value={formData.section24}
                  onChange={(e) => handleInputChange('section24', Math.min(parseFloat(e.target.value) || 0, 200000))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  max="200000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Deductions
                </label>
                <input
                  type="number"
                  value={formData.otherDeductions}
                  onChange={(e) => handleInputChange('otherDeductions', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tax Payments */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Tax Payments</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TDS Deducted
                </label>
                <input
                  type="number"
                  value={formData.tds}
                  onChange={(e) => handleInputChange('tds', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advance Tax Paid
                </label>
                <input
                  type="number"
                  value={formData.advanceTax}
                  onChange={(e) => handleInputChange('advanceTax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Tax Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Tax Summary</h3>
            </CardHeader>
            <CardContent>
              {calculation ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Gross Income</p>
                      <p className="font-semibold text-lg">{formatCurrency(calculation.grossIncome)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Deductions</p>
                      <p className="font-semibold text-lg text-green-600">{formatCurrency(calculation.deductions)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Taxable Income</p>
                      <p className="font-semibold text-lg">{formatCurrency(calculation.taxableIncome)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Tax</p>
                      <p className="font-semibold text-lg text-red-600">{formatCurrency(calculation.totalTax)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Net Tax Payable</span>
                      <span className={`text-2xl font-bold ${
                        calculation.selfAssessmentTax > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {calculation.selfAssessmentTax > 0 
                          ? formatCurrency(calculation.selfAssessmentTax)
                          : formatCurrency(calculation.refund)
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {calculation.selfAssessmentTax > 0 
                        ? 'Additional tax to be paid'
                        : 'Refund amount'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Enter your income details to see tax calculation</p>
              )}
            </CardContent>
          </Card>

          {/* Tax Breakdown */}
          {showBreakdown && calculation && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Tax Breakdown</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span>{formatCurrency(calculation.incomeTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surcharge</span>
                    <span>{formatCurrency(calculation.surcharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health & Education Cess (4%)</span>
                    <span>{formatCurrency(calculation.cess)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total Tax</span>
                    <span>{formatCurrency(calculation.totalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TDS Deducted</span>
                    <span className="text-green-600">-{formatCurrency(calculation.tds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advance Tax Paid</span>
                    <span className="text-green-600">-{formatCurrency(calculation.advanceTax)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                    <span>Net Tax Payable</span>
                    <span className={calculation.selfAssessmentTax > 0 ? 'text-red-600' : 'text-green-600'}>
                      {calculation.selfAssessmentTax > 0 
                        ? formatCurrency(calculation.selfAssessmentTax)
                        : formatCurrency(calculation.refund)
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tax Tips */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Tax Saving Tips</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Maximize Section 80C</p>
                  <p className="text-blue-700">
                    You can save up to ₹1,50,000 through PPF, ELSS, NSC, etc.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">Health Insurance</p>
                  <p className="text-green-700">
                    Claim up to ₹25,000 for health insurance premiums under Section 80D.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">Home Loan Benefits</p>
                  <p className="text-purple-700">
                    Claim up to ₹2,00,000 for home loan interest under Section 24.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTaxCalculator;
