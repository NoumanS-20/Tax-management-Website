import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, DollarSign, CheckCircle, Clock, 
  AlertCircle, Download, Edit, ArrowLeft, Building,
  CreditCard, Home, TrendingUp, PiggyBank, Receipt
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import { TaxForm } from '../../types';
import toast from 'react-hot-toast';

const ITRFormDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<TaxForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchFormDetails(id);
    }
  }, [id]);

  const fetchFormDetails = async (formId: string) => {
    try {
      setLoading(true);
      console.log('Fetching form details for ID:', formId);
      const response = await apiService.getTaxForm(formId);
      console.log('API response:', response);
      if (response.success) {
        console.log('Form data:', response.data);
        setForm(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch form details');
      }
    } catch (error: any) {
      console.error('Error fetching form details:', error);
      toast.error(error.message || 'Failed to fetch form details');
      navigate('/dashboard/itr-forms');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateITRXML = (formData: TaxForm) => {
    // Generate ITR XML compatible with Income Tax Department's offline utility
    const totalIncome = Object.values(formData.income).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(formData.deductions).reduce((sum, val) => sum + val, 0);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ITR>
  <ITRForm>
    <FormName>${formData.formType}</FormName>
    <AssessmentYear>${formData.assessmentYear}</AssessmentYear>
    <FinancialYear>${formData.financialYear}</FinancialYear>
    <FilingDate>${new Date().toISOString().split('T')[0]}</FilingDate>
    <Status>${formData.status}</Status>
  </ITRForm>
  <IncomeDetails>
    <SalaryIncome>${formData.income.salary}</SalaryIncome>
    <HousePropertyIncome>${formData.income.houseProperty}</HousePropertyIncome>
    <BusinessIncome>${formData.income.businessIncome}</BusinessIncome>
    <CapitalGains>${formData.income.capitalGains}</CapitalGains>
    <OtherSources>${formData.income.other}</OtherSources>
    <GrossIncome>${totalIncome}</GrossIncome>
  </IncomeDetails>
  <Deductions>
    <Section80C>${formData.deductions.section80C}</Section80C>
    <Section80D>${formData.deductions.section80D}</Section80D>
    <Section80E>${formData.deductions.section80E}</Section80E>
    <Section80G>${formData.deductions.section80G}</Section80G>
    <Section24>${formData.deductions.section24}</Section24>
    <OtherDeductions>${formData.deductions.other}</OtherDeductions>
    <TotalDeductions>${totalDeductions}</TotalDeductions>
  </Deductions>
  <Exemptions>
    <HRA>${formData.exemptions.hra}</HRA>
    <LTA>${formData.exemptions.lta}</LTA>
    <OtherExemptions>${formData.exemptions.other}</OtherExemptions>
    <TotalExemptions>${Object.values(formData.exemptions).reduce((sum, val) => sum + val, 0)}</TotalExemptions>
  </Exemptions>
  <TaxComputation>
    <GrossTotalIncome>${formData.taxCalculation.grossTotalIncome}</GrossTotalIncome>
    <TotalDeductions>${formData.taxCalculation.totalDeductions}</TotalDeductions>
    <TotalExemptions>${formData.taxCalculation.totalExemptions}</TotalExemptions>
    <TaxableIncome>${formData.taxCalculation.taxableIncome}</TaxableIncome>
    <TaxOnIncome>${formData.taxCalculation.incomeTax}</TaxOnIncome>
    <Surcharge>${formData.taxCalculation.surcharge}</Surcharge>
    <HealthEducationCess>${formData.taxCalculation.cess}</HealthEducationCess>
    <TotalTaxLiability>${formData.taxCalculation.totalTax}</TotalTaxLiability>
  </TaxComputation>
  <TaxPayments>
    <TDS>${formData.taxCalculation.tds}</TDS>
    <AdvanceTax>${formData.taxCalculation.advanceTax}</AdvanceTax>
    <SelfAssessmentTax>${formData.taxCalculation.selfAssessmentTax}</SelfAssessmentTax>
    <TotalTaxPaid>${formData.taxCalculation.tds + formData.taxCalculation.advanceTax + formData.taxCalculation.selfAssessmentTax}</TotalTaxPaid>
  </TaxPayments>
  <RefundOrPayable>
    <RefundAmount>${formData.taxCalculation.refund}</RefundAmount>
    <NetTaxLiability>${formData.taxCalculation.totalTax - formData.taxCalculation.tds - formData.taxCalculation.advanceTax - formData.taxCalculation.selfAssessmentTax}</NetTaxLiability>
  </RefundOrPayable>
  <Metadata>
    <CreatedAt>${formData.createdAt}</CreatedAt>
    <UpdatedAt>${formData.updatedAt}</UpdatedAt>
    <FiledAt>${formData.filedAt || 'Not Filed'}</FiledAt>
    <DocumentCount>${formData.documents?.length || 0}</DocumentCount>
  </Metadata>
</ITR>`;
    return xml;
  };

  const handleExportXML = () => {
    if (!form) return;
    
    try {
      const xml = generateITRXML(form);
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ITR_${form.formType}_${form.assessmentYear}_${form.id}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('ITR XML file downloaded successfully! You can now upload this to the Income Tax e-filing portal.');
    } catch (error) {
      console.error('Error exporting XML:', error);
      toast.error('Failed to export XML file');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'in-review':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'filed':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'in-review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'filed':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
        <p className="text-gray-600 mb-6">The requested ITR form could not be found.</p>
        <Button onClick={() => navigate('/dashboard/itr-forms')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/itr-forms')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {form.formType} - AY {form.assessmentYear}
            </h1>
            <p className="text-gray-600 mt-1">Financial Year: {form.financialYear}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {form.status === 'draft' && (
            <Button onClick={() => navigate(`/dashboard/itr-forms/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Form
            </Button>
          )}
          <Button variant="outline" onClick={handleExportXML}>
            <Download className="w-4 h-4 mr-2" />
            Export to XML
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(form.status)}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(form.status)}`}>
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-semibold text-gray-900">{formatDate(form.createdAt)}</p>
            </div>
            {form.filedAt && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Filed</p>
                <p className="font-semibold text-gray-900">{formatDate(form.filedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* XML Export Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export to Income Tax Portal
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Click "Export to XML" to download your ITR data in XML format. This file can be uploaded to the Income Tax Department's e-filing portal.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-medium text-gray-900 mb-2">📋 How to use the XML file:</p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Download the XML file using the "Export to XML" button above</li>
                  <li>Visit the Income Tax e-filing portal: <a href="https://www.incometax.gov.in/iec/foportal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">incometax.gov.in</a></li>
                  <li>Log in with your credentials</li>
                  <li>Go to "File Income Tax Return"</li>
                  <li>Select "Import from XML" or use the offline utility</li>
                  <li>Upload the downloaded XML file</li>
                  <li>Verify all data and complete the filing process</li>
                </ol>
              </div>
              <div className="mt-3 flex items-center space-x-2 text-sm text-amber-700">
                <AlertCircle className="w-4 h-4" />
                <span>Note: Always verify all data before final submission to the Income Tax Department.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Calculation Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Tax Calculation Summary
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Gross Total Income</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(form.taxCalculation.grossTotalIncome)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(form.taxCalculation.totalDeductions)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Taxable Income</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(form.taxCalculation.taxableIncome)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Tax</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(form.taxCalculation.totalTax)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">TDS Deducted</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(form.taxCalculation.tds)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Advance Tax Paid</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(form.taxCalculation.advanceTax)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Refund/Tax Payable</p>
                <p className={`text-xl font-bold ${form.taxCalculation.refund >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {form.taxCalculation.refund >= 0 ? '+' : ''}{formatCurrency(form.taxCalculation.refund)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Details */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Income Details
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Salary Income</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(form.income.salary)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Business Income</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(form.income.businessIncome)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Capital Gains</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(form.income.capitalGains)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">House Property</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(form.income.houseProperty)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Receipt className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Other Income</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(form.income.other)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions & Exemptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deductions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <PiggyBank className="w-5 h-5 mr-2 text-blue-600" />
              Deductions
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Section 80C</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.deductions.section80C)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Section 80D (Health)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.deductions.section80D)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Section 80G (Donations)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.deductions.section80G)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Section 24 (Home Loan)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.deductions.section24)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Section 80E (Education)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.deductions.section80E)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exemptions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Exemptions
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">HRA (House Rent Allowance)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.exemptions.hra)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">LTA (Leave Travel Allowance)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.exemptions.lta)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Other Exemptions</span>
                <span className="font-semibold text-gray-900">{formatCurrency(form.exemptions.other)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Uploaded Documents ({form.documents.length})
          </h2>
        </CardHeader>
        <CardContent>
          {form.documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {form.documents.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{doc.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{doc.type}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{(doc.size / 1024).toFixed(0)} KB</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ITRFormDetails;
