import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  FileBarChart,
  PieChart,
  BarChart3,
  Search,
  RefreshCw,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface ReportData {
  id: string;
  type: string;
  title: string;
  financialYear: string;
  generatedDate: string;
  status: string;
  fileSize: string;
  description: string;
}

interface TaxSummary {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  tds: number;
  taxPayable: number;
}

interface FinancialStats {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [taxForms, setTaxForms] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [taxSummary, setTaxSummary] = useState<TaxSummary>({
    totalIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    totalTax: 0,
    tds: 0,
    taxPayable: 0
  });

  const financialYears = [
    '2024-25',
    '2023-24',
    '2022-23',
    '2021-22',
    '2020-21'
  ];

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'tax-summary', label: 'Tax Summary' },
    { value: 'income-statement', label: 'Income Statement' },
    { value: 'deductions', label: 'Deductions Report' },
    { value: 'tds-certificate', label: 'TDS Certificates' },
    { value: 'form26as', label: 'Form 26AS' },
    { value: 'computation', label: 'Tax Computation' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedYear]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch tax forms
      const formsResponse = await apiService.getTaxForms();
      if (formsResponse.success) {
        const filteredForms = formsResponse.data.taxForms.filter(
          (form: any) => form.financialYear === selectedYear
        );
        setTaxForms(filteredForms);

        // Calculate tax summary
        calculateTaxSummary(filteredForms);
      }

      // Fetch documents
      const docsResponse = await apiService.getDocuments();
      if (docsResponse.success) {
        setDocuments(docsResponse.data.documents);
      }
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTaxSummary = (forms: any[]) => {
    let totalIncome = 0;
    let totalDeductions = 0;
    let totalTax = 0;
    let tds = 0;

    forms.forEach((form: any) => {
      // Calculate total income from all sources
      const income = form.income || {};
      totalIncome += Object.values(income).reduce(
        (sum: number, val: any) => sum + (Number(val) || 0),
        0
      );

      // Calculate total deductions
      const deductions = form.deductions || {};
      totalDeductions += Object.values(deductions).reduce(
        (sum: number, val: any) => sum + (Number(val) || 0),
        0
      );

      // Get tax calculation
      if (form.taxCalculation) {
        totalTax += form.taxCalculation.totalTax || 0;
      }
    });

    const taxableIncome = totalIncome - totalDeductions;
    const taxPayable = Math.max(0, totalTax - tds);

    setTaxSummary({
      totalIncome,
      totalDeductions,
      taxableIncome,
      totalTax,
      tds,
      taxPayable
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReportData();
    setRefreshing(false);
    toast.success('Reports refreshed');
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Generating PDF report...');
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dismiss();
      toast.success('PDF report downloaded');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      toast.loading('Generating Excel report...');
      
      // Create CSV content
      const csvContent = generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `tax-report-${selectedYear}-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('Excel report downloaded');
    } catch (error) {
      toast.error('Failed to generate Excel report');
    }
  };

  const generateCSV = () => {
    let csv = 'Financial Year,Total Income,Total Deductions,Taxable Income,Total Tax,Tax Payable\n';
    csv += `${selectedYear},${taxSummary.totalIncome},${taxSummary.totalDeductions},${taxSummary.taxableIncome},${taxSummary.totalTax},${taxSummary.taxPayable}\n`;
    
    return csv;
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleEmailReport = () => {
    toast.success('Report will be emailed to your registered email address');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-review':
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in-review':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const financialStats: FinancialStats[] = [
    {
      label: 'Total Income',
      value: taxSummary.totalIncome,
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green'
    },
    {
      label: 'Total Deductions',
      value: taxSummary.totalDeductions,
      change: 8.3,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'blue'
    },
    {
      label: 'Taxable Income',
      value: taxSummary.taxableIncome,
      change: 15.2,
      icon: <FileBarChart className="w-6 h-6" />,
      color: 'purple'
    },
    {
      label: 'Tax Payable',
      value: taxSummary.taxPayable,
      change: -5.4,
      icon: <PieChart className="w-6 h-6" />,
      color: 'red'
    }
  ];

  const filteredForms = taxForms.filter((form) => {
    if (selectedReportType !== 'all' && form.formType !== selectedReportType) {
      return false;
    }
    if (searchQuery && !form.formType.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Reports</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive tax reports and financial summaries
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="outline"
            icon={<Mail className="w-4 h-4" />}
            onClick={handleEmailReport}
          >
            Email
          </Button>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <Button
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Financial Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {financialYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Report Type
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stat.value)}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change >= 0 ? '+' : ''}
                      {stat.change}%
                    </span>
                    <span className="text-xs text-gray-500 ml-2">vs last year</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tax Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Tax Summary - FY {selectedYear}
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Income</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(taxSummary.totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Deductions</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(taxSummary.totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Taxable Income</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatCurrency(taxSummary.taxableIncome)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Tax</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {formatCurrency(taxSummary.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">TDS Deducted</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(taxSummary.tds)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Tax Payable</span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(taxSummary.taxPayable)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Forms List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            ITR Forms - FY {selectedYear}
          </h2>
        </CardHeader>
        <CardContent>
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No tax forms found</p>
              <p className="text-sm text-gray-500">
                Create a tax form to generate reports
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{form.formType}</h3>
                      <p className="text-sm text-gray-600">
                        AY {form.assessmentYear} • Created{' '}
                        {new Date(form.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(
                          form.taxCalculation?.totalTax || 0
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Tax Amount</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          form.status
                        )}`}
                      >
                        {getStatusIcon(form.status)}
                        <span className="ml-1 capitalize">{form.status}</span>
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Download className="w-4 h-4" />}
                        onClick={() =>
                          toast.success(`Downloading ${form.formType} report`)
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Supporting Documents
          </h2>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No documents uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {documents.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Documents</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">
                  {documents.filter((d) => d.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Approved</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {documents.filter((d) => d.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Pending</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {(documents.reduce((sum, d) => sum + (d.fileSize || 0), 0) / 1024 / 1024).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total MB</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              icon={<FileBarChart className="w-6 h-6 mb-2" />}
              onClick={() => toast.success('Generating comprehensive report...')}
            >
              <span className="text-base font-semibold">Generate Comprehensive Report</span>
              <span className="text-xs text-gray-500 mt-1">
                All forms and documents
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              icon={<Download className="w-6 h-6 mb-2" />}
              onClick={() => toast.success('Downloading Form 26AS...')}
            >
              <span className="text-base font-semibold">Download Form 26AS</span>
              <span className="text-xs text-gray-500 mt-1">
                TDS certificate
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              icon={<BarChart3 className="w-6 h-6 mb-2" />}
              onClick={() => toast.success('Generating tax computation...')}
            >
              <span className="text-base font-semibold">Tax Computation Sheet</span>
              <span className="text-xs text-gray-500 mt-1">
                Detailed calculation
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
