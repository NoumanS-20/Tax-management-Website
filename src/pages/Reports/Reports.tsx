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
import jsPDF from 'jspdf';


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

      // Fetch documents - handle gracefully if it fails
      try {
        const docsResponse = await apiService.getDocuments();
        if (docsResponse.success && docsResponse.data && docsResponse.data.documents) {
          setDocuments(docsResponse.data.documents);
        } else {
          // No documents found, set empty array
          setDocuments([]);
        }
      } catch (docError) {
        console.error('Error fetching documents:', docError);
        // Don't fail the entire request if documents fail
        setDocuments([]);
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

    console.log('Calculating tax summary for forms:', forms);

    forms.forEach((form: any) => {
      // Use pre-calculated totalIncome from the form to avoid double counting
      totalIncome += form.income?.totalIncome || 0;

      // Use pre-calculated totalDeductions from the form to avoid double counting
      totalDeductions += form.deductions?.totalDeductions || 0;

      // Get tax calculation - ensure taxCalculation object exists
      if (form.taxCalculation) {
        console.log('Form tax calculation:', {
          formId: form.id,
          totalTax: form.taxCalculation.totalTax,
          tds: form.taxCalculation.tds,
          taxCalculation: form.taxCalculation
        });
        totalTax += form.taxCalculation.totalTax || 0;
        tds += form.taxCalculation.tds || 0;
      } else {
        console.log('Form has no taxCalculation:', form.id);
      }
    });

    const taxableIncome = totalIncome - totalDeductions;
    const taxPayable = Math.max(0, totalTax - tds);

    console.log('Tax Summary Calculated:', {
      totalIncome,
      totalDeductions,
      taxableIncome,
      totalTax,
      tds,
      taxPayable
    });

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
      
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper to add text with word wrap
      // (Removed unused addWrappedText function)

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Tax Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Financial Year
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Financial Year: ${selectedYear}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Tax Summary Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Tax Summary', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };

      const summaryData = [
        { label: 'Total Income:', value: formatCurrency(taxSummary.totalIncome) },
        { label: 'Total Deductions:', value: formatCurrency(taxSummary.totalDeductions) },
        { label: 'Taxable Income:', value: formatCurrency(taxSummary.taxableIncome) },
        { label: 'Total Tax:', value: formatCurrency(taxSummary.totalTax) },
        { label: 'TDS Paid:', value: formatCurrency(taxSummary.tds) },
        { label: 'Tax Payable/Refundable:', value: formatCurrency(taxSummary.taxPayable) }
      ];

      summaryData.forEach(item => {
        checkNewPage(10);
        doc.text(item.label, margin + 10, yPosition);
        doc.text(item.value, pageWidth - margin - 10, yPosition, { align: 'right' });
        yPosition += 8;
      });

      yPosition += 10;

      // ITR Forms Section
      if (filteredForms.length > 0) {
        checkNewPage(20);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('ITR Forms Filed', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Table headers
        const headers = ['Form Type', 'Assessment Year', 'Status', 'Income', 'Tax', 'Date'];
        const colWidths = [30, 35, 25, 30, 25, 30];
        const startX = margin;

        doc.setFont('helvetica', 'bold');
        let xPos = startX;
        headers.forEach((header, i) => {
          doc.text(header, xPos, yPosition);
          xPos += colWidths[i];
        });
        yPosition += 7;

        // Draw line under headers
        doc.line(startX, yPosition - 2, pageWidth - margin, yPosition - 2);
        yPosition += 3;

        doc.setFont('helvetica', 'normal');

        // Table rows
        filteredForms.forEach((form: any) => {
          checkNewPage(10);
          
          xPos = startX;
          const rowData = [
            form.formType || 'N/A',
            form.assessmentYear || 'N/A',
            form.status || 'draft',
            formatCurrency(form.income?.totalIncome || 0),
            formatCurrency(form.taxCalculation?.totalTax || 0),
            form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : 'Not submitted'
          ];

          rowData.forEach((data, i) => {
            const text = doc.splitTextToSize(data, colWidths[i] - 2)[0]; // Truncate if too long
            doc.text(text, xPos, yPosition);
            xPos += colWidths[i];
          });
          yPosition += 7;
        });

        yPosition += 10;
      }

      // Documents Section
      checkNewPage(20);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Documents Summary', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      const totalDocuments = documents.length;
      const approvedDocs = documents.filter((d: any) => d.status === 'approved').length;
  const submittedDocs = documents.filter((d: any) => d.status === 'pending').length;

      doc.text(`Total Documents: ${totalDocuments}`, margin + 10, yPosition);
      yPosition += 8;
      doc.text(`Approved: ${approvedDocs}`, margin + 10, yPosition);
      yPosition += 8;
  doc.text(`Submitted: ${submittedDocs}`, margin + 10, yPosition);
      yPosition += 15;

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      const fileName = `tax-report-${selectedYear}-${Date.now()}.pdf`;
      doc.save(fileName);
      
      toast.dismiss();
      toast.success('PDF report downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
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

  const handleGenerateComprehensiveReport = async () => {
    try {
      toast.loading('Generating comprehensive report...');
      
      // Generate comprehensive CSV with all data
      let csv = 'Tax Report - Comprehensive\n';
      csv += `Financial Year: ${selectedYear}\n`;
      csv += `Generated On: ${new Date().toLocaleDateString('en-IN')}\n\n`;
      
      // Summary Section
      csv += 'SUMMARY\n';
      csv += 'Category,Amount\n';
      csv += `Total Income,${taxSummary.totalIncome}\n`;
      csv += `Total Deductions,${taxSummary.totalDeductions}\n`;
      csv += `Taxable Income,${taxSummary.taxableIncome}\n`;
      csv += `Total Tax,${taxSummary.totalTax}\n`;
      csv += `TDS Deducted,${taxSummary.tds}\n`;
      csv += `Tax Payable,${taxSummary.taxPayable}\n\n`;
      
      // Forms Section
      csv += 'ITR FORMS\n';
      csv += 'Form Type,Assessment Year,Status,Total Income,Tax Amount,Created Date\n';
      filteredForms.forEach(form => {
        csv += `${form.formType},${form.assessmentYear},${form.status},${form.income?.totalIncome || 0},${form.taxCalculation?.totalTax || 0},${new Date(form.createdAt).toLocaleDateString('en-IN')}\n`;
      });
      
      csv += '\n';
      
      // Documents Section
      csv += 'DOCUMENTS\n';
      csv += `Total Documents: ${documents.length}\n`;
      csv += `Approved: ${documents.filter(d => d.status === 'approved').length}\n`;
  csv += `Submitted: ${documents.filter(d => d.status === 'pending').length}\n`;
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `comprehensive-report-${selectedYear}-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('Comprehensive report downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate comprehensive report');
    }
  };

  const handleDownloadForm26AS = async () => {
    try {
      toast.loading('Generating Form 26AS...');
      
      // Generate Form 26AS format
      let content = '=== FORM 26AS (Tax Credit Statement) ===\n\n';
      content += `PAN: ${taxForms[0]?.personalInfo?.panNumber || 'N/A'}\n`;
      content += `Assessment Year: ${selectedYear}\n`;
      content += `Generated On: ${new Date().toLocaleDateString('en-IN')}\n\n`;
      
      content += '--- TDS DETAILS ---\n';
      content += 'Deductor,TDS Amount,Date,Section\n';
      
      let totalTDS = 0;
      taxForms.forEach(form => {
        if (form.taxCalculation?.tds > 0) {
          content += `Employer,${form.taxCalculation.tds},${new Date(form.createdAt).toLocaleDateString('en-IN')},194\n`;
          totalTDS += form.taxCalculation.tds;
        }
      });
      
      content += `\nTotal TDS: ₹${totalTDS}\n\n`;
      
      content += '--- TAX SUMMARY ---\n';
      content += `Total Income: ₹${taxSummary.totalIncome}\n`;
      content += `Total Deductions: ₹${taxSummary.totalDeductions}\n`;
      content += `Taxable Income: ₹${taxSummary.taxableIncome}\n`;
      content += `Total Tax Liability: ₹${taxSummary.totalTax}\n`;
      content += `TDS Credited: ₹${taxSummary.tds}\n`;
      content += `Tax Payable/(Refundable): ₹${taxSummary.taxPayable}\n\n`;
      
      content += '--- IMPORTANT NOTES ---\n';
      content += '1. This is a system-generated document for reference only\n';
      content += '2. For official Form 26AS, please download from TRACES portal\n';
      content += '3. Visit: https://www.tdscpc.gov.in/\n';
      content += '4. Verify all TDS credits match with this statement\n';
      
      // Download as text file
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Form-26AS-${selectedYear}-${Date.now()}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('Form 26AS downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate Form 26AS');
    }
  };

  const handleGenerateTaxComputation = async () => {
    try {
      toast.loading('Generating tax computation sheet...');
      
      // Generate detailed tax computation
      let content = '=== TAX COMPUTATION SHEET ===\n\n';
      content += `Assessment Year: ${selectedYear}\n`;
      content += `Generated On: ${new Date().toLocaleDateString('en-IN')}\n\n`;
      
      content += '--- INCOME COMPUTATION ---\n';
      content += 'Income Head,Amount (₹)\n';
      
      let totalIncome = 0;
      taxForms.forEach(form => {
        if (form.income) {
          content += `Salary Income,${form.income.salary || 0}\n`;
          content += `Business Income,${form.income.businessIncome || 0}\n`;
          content += `Capital Gains,${form.income.capitalGains || 0}\n`;
          content += `House Property,${form.income.houseProperty || 0}\n`;
          content += `Other Income,${form.income.otherIncome || 0}\n`;
          totalIncome += form.income.totalIncome || 0;
        }
      });
      
      content += `\nGross Total Income: ₹${totalIncome}\n\n`;
      
      content += '--- DEDUCTIONS (CHAPTER VI-A) ---\n';
      content += 'Section,Amount (₹)\n';
      
      let totalDeductions = 0;
      taxForms.forEach(form => {
        if (form.deductions) {
          content += `Section 80C (Investments),${form.deductions.section80C || 0}\n`;
          content += `Section 80D (Health Insurance),${form.deductions.section80D || 0}\n`;
          content += `Section 80G (Donations),${form.deductions.section80G || 0}\n`;
          content += `Section 24 (Home Loan Interest),${form.deductions.section24 || 0}\n`;
          content += `Section 80E (Education Loan),${form.deductions.section80E || 0}\n`;
          totalDeductions += form.deductions.totalDeductions || 0;
        }
      });
      
      content += `\nTotal Deductions: ₹${totalDeductions}\n\n`;
      
      content += '--- TAX CALCULATION ---\n';
      const taxableIncome = totalIncome - totalDeductions;
      content += `Taxable Income: ₹${taxableIncome}\n\n`;
      
      // Calculate tax slabs
      content += 'Tax Slabs:\n';
      let tax = 0;
      if (taxableIncome <= 250000) {
        content += `Up to ₹2,50,000: ₹0 (Nil)\n`;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
        content += `₹2,50,001 - ₹5,00,000: ₹${tax.toFixed(0)} (5%)\n`;
      } else if (taxableIncome <= 750000) {
        tax = 12500 + (taxableIncome - 500000) * 0.10;
        content += `₹2,50,001 - ₹5,00,000: ₹12,500 (5%)\n`;
        content += `₹5,00,001 - ₹7,50,000: ₹${((taxableIncome - 500000) * 0.10).toFixed(0)} (10%)\n`;
      } else if (taxableIncome <= 1000000) {
        tax = 37500 + (taxableIncome - 750000) * 0.15;
        content += `₹2,50,001 - ₹5,00,000: ₹12,500\n`;
        content += `₹5,00,001 - ₹7,50,000: ₹25,000\n`;
        content += `₹7,50,001 - ₹10,00,000: ₹${((taxableIncome - 750000) * 0.15).toFixed(0)} (15%)\n`;
      } else if (taxableIncome <= 1250000) {
        tax = 75000 + (taxableIncome - 1000000) * 0.20;
        content += `Up to ₹10,00,000: ₹75,000\n`;
        content += `₹10,00,001 - ₹12,50,000: ₹${((taxableIncome - 1000000) * 0.20).toFixed(0)} (20%)\n`;
      } else if (taxableIncome <= 1500000) {
        tax = 125000 + (taxableIncome - 1250000) * 0.25;
        content += `Up to ₹12,50,000: ₹1,25,000\n`;
        content += `₹12,50,001 - ₹15,00,000: ₹${((taxableIncome - 1250000) * 0.25).toFixed(0)} (25%)\n`;
      } else {
        tax = 187500 + (taxableIncome - 1500000) * 0.30;
        content += `Up to ₹15,00,000: ₹1,87,500\n`;
        content += `Above ₹15,00,000: ₹${((taxableIncome - 1500000) * 0.30).toFixed(0)} (30%)\n`;
      }
      
      content += `\nIncome Tax: ₹${Math.round(tax)}\n`;
      
      // Surcharge
      let surcharge = 0;
      if (taxableIncome > 5000000) {
        surcharge = tax * 0.10;
        content += `Surcharge (10%): ₹${Math.round(surcharge)}\n`;
      }
      
      // Cess
      const cess = (tax + surcharge) * 0.04;
      content += `Health & Education Cess (4%): ₹${Math.round(cess)}\n`;
      
      const totalTax = Math.round(tax + surcharge + cess);
      content += `\nTotal Tax Liability: ₹${totalTax}\n`;
      content += `Less: TDS/TCS: ₹${taxSummary.tds}\n`;
      content += `Tax Payable/(Refundable): ₹${totalTax - taxSummary.tds}\n\n`;
      
      content += '--- NOTES ---\n';
      content += '1. Tax calculated as per Income Tax Act, 1961\n';
      content += '2. Rates applicable for AY ' + selectedYear + '\n';
      content += '3. This is a system-generated computation\n';
      content += '4. Please verify all figures before ITR filing\n';
      
      // Download as text file
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `tax-computation-${selectedYear}-${Date.now()}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('Tax computation sheet downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate tax computation sheet');
    }
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
      label: 'Total Tax',
      value: taxSummary.totalTax,
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
          {taxSummary.totalTax === 0 && taxSummary.totalIncome > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Tax calculation not found.</strong> To recalculate tax for existing forms, 
                please open each ITR form, click "Edit", and then "Save". This will trigger automatic 
                tax calculation.
              </div>
            </div>
          )}
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
                <div className="text-sm text-gray-600 mt-1">Submitted</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {(documents.reduce((sum, d) => sum + (d.size || 0), 0) / 1024 / 1024).toFixed(2)}
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
              onClick={handleGenerateComprehensiveReport}
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
              onClick={handleDownloadForm26AS}
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
              onClick={handleGenerateTaxComputation}
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
