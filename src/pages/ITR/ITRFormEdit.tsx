import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Building, CreditCard, TrendingUp, 
  Home, Receipt, PiggyBank, FileText, AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

const ITRFormEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'deductions' | 'exemptions'>('income');
  
  const [formData, setFormData] = useState({
    income: {
      salary: 0,
      businessIncome: 0,
      capitalGains: 0,
      houseProperty: 0,
      other: 0,
    },
    deductions: {
      section80C: 0,
      section80D: 0,
      section80G: 0,
      section24: 0,
      section80E: 0,
      other: 0,
    },
    exemptions: {
      hra: 0,
      lta: 0,
      other: 0,
    },
  });

  useEffect(() => {
    if (id) {
      fetchFormData(id);
    }
  }, [id]);

  const fetchFormData = async (formId: string) => {
    try {
      setLoading(true);
      console.log('Fetching form data for ID:', formId);
      const response = await apiService.getTaxForm(formId);
      console.log('API response:', response);
      if (response.success) {
        const form = response.data;
        console.log('Form data:', form);
        if (form.status !== 'draft') {
          toast.error('Only draft forms can be edited');
          navigate(`/dashboard/itr-forms/${formId}`);
          return;
        }
        setFormData({
          income: form.income,
          deductions: form.deductions,
          exemptions: form.exemptions,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch form data');
      }
    } catch (error: any) {
      console.error('Error fetching form data:', error);
      toast.error(error.message || 'Failed to fetch form data');
      navigate('/dashboard/itr-forms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    category: 'income' | 'deductions' | 'exemptions',
    field: string,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: numValue,
      },
    }));
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);
      const response = await apiService.updateTaxForm(id, formData);
      if (response.success) {
        toast.success('Form saved successfully!');
        navigate(`/dashboard/itr-forms/${id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotals = () => {
    const totalIncome = Object.values(formData.income).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(formData.deductions).reduce((sum, val) => sum + val, 0);
    const totalExemptions = Object.values(formData.exemptions).reduce((sum, val) => sum + val, 0);
    const taxableIncome = Math.max(0, totalIncome - totalDeductions - totalExemptions);
    
    return { totalIncome, totalDeductions, totalExemptions, taxableIncome };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'income' as const, label: 'Income', icon: TrendingUp },
    { id: 'deductions' as const, label: 'Deductions', icon: PiggyBank },
    { id: 'exemptions' as const, label: 'Exemptions', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/itr-forms/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit ITR Form</h1>
            <p className="text-gray-600 mt-1">Update your income, deductions, and exemptions</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tax Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totals.totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalDeductions)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Exemptions</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totals.totalExemptions)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Taxable Income</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.taxableIncome)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Income Tab */}
      {activeTab === 'income' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Income Sources
            </h2>
            <p className="text-sm text-gray-600 mt-1">Enter your income from various sources</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Salary */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  Salary Income
                </label>
                <input
                  type="number"
                  value={formData.income.salary}
                  onChange={(e) => handleInputChange('income', 'salary', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Income from your employer (as per Form 16)</p>
              </div>

              {/* Business Income */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                  Business/Professional Income
                </label>
                <input
                  type="number"
                  value={formData.income.businessIncome}
                  onChange={(e) => handleInputChange('income', 'businessIncome', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Income from business or profession</p>
              </div>

              {/* Capital Gains */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                  Capital Gains
                </label>
                <input
                  type="number"
                  value={formData.income.capitalGains}
                  onChange={(e) => handleInputChange('income', 'capitalGains', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Income from sale of shares, mutual funds, property</p>
              </div>

              {/* House Property */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                  Income from House Property
                </label>
                <input
                  type="number"
                  value={formData.income.houseProperty}
                  onChange={(e) => handleInputChange('income', 'houseProperty', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Rental income from property</p>
              </div>

              {/* Other Income */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Receipt className="w-4 h-4 mr-2 text-gray-400" />
                  Other Income
                </label>
                <input
                  type="number"
                  value={formData.income.other}
                  onChange={(e) => handleInputChange('income', 'other', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Interest income, dividends, or other sources</p>
              </div>

              {/* Total */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Income</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totals.totalIncome)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deductions Tab */}
      {activeTab === 'deductions' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <PiggyBank className="w-5 h-5 mr-2 text-blue-600" />
              Tax Deductions
            </h2>
            <p className="text-sm text-gray-600 mt-1">Claim your eligible tax deductions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Section 80C */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Section 80C (PPF, ELSS, Life Insurance, etc.)
                </label>
                <input
                  type="number"
                  value={formData.deductions.section80C}
                  onChange={(e) => handleInputChange('deductions', 'section80C', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="150000"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: ₹1,50,000 per year</p>
              </div>

              {/* Section 80D */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Section 80D (Health Insurance Premium)
                </label>
                <input
                  type="number"
                  value={formData.deductions.section80D}
                  onChange={(e) => handleInputChange('deductions', 'section80D', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="25000"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: ₹25,000 (₹50,000 for senior citizens)</p>
              </div>

              {/* Section 80G */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Section 80G (Donations to Charitable Trusts)
                </label>
                <input
                  type="number"
                  value={formData.deductions.section80G}
                  onChange={(e) => handleInputChange('deductions', 'section80G', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Donations to eligible charitable institutions</p>
              </div>

              {/* Section 24 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Section 24 (Home Loan Interest)
                </label>
                <input
                  type="number"
                  value={formData.deductions.section24}
                  onChange={(e) => handleInputChange('deductions', 'section24', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="200000"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum: ₹2,00,000 for self-occupied property</p>
              </div>

              {/* Section 80E */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Section 80E (Education Loan Interest)
                </label>
                <input
                  type="number"
                  value={formData.deductions.section80E}
                  onChange={(e) => handleInputChange('deductions', 'section80E', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Interest on education loan for higher studies</p>
              </div>

              {/* Other Deductions */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Other Deductions
                </label>
                <input
                  type="number"
                  value={formData.deductions.other}
                  onChange={(e) => handleInputChange('deductions', 'other', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Other eligible deductions</p>
              </div>

              {/* Total */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Deductions</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(totals.totalDeductions)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exemptions Tab */}
      {activeTab === 'exemptions' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Tax Exemptions
            </h2>
            <p className="text-sm text-gray-600 mt-1">Claim your eligible tax exemptions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* HRA */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  HRA (House Rent Allowance)
                </label>
                <input
                  type="number"
                  value={formData.exemptions.hra}
                  onChange={(e) => handleInputChange('exemptions', 'hra', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">House Rent Allowance received from employer</p>
              </div>

              {/* LTA */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  LTA (Leave Travel Allowance)
                </label>
                <input
                  type="number"
                  value={formData.exemptions.lta}
                  onChange={(e) => handleInputChange('exemptions', 'lta', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Leave Travel Allowance for vacation trips</p>
              </div>

              {/* Other Exemptions */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Other Exemptions
                </label>
                <input
                  type="number"
                  value={formData.exemptions.other}
                  onChange={(e) => handleInputChange('exemptions', 'other', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Other eligible exemptions (conveyance, medical, etc.)</p>
              </div>

              {/* Total */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Exemptions</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totals.totalExemptions)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Important Information</h3>
              <p className="text-sm text-blue-800">
                Make sure to have all supporting documents ready before filing. Tax calculations are 
                automatically updated based on your inputs. You can save your progress and continue 
                editing later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end space-x-3 pb-8">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/itr-forms/${id}`)}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ITRFormEdit;
