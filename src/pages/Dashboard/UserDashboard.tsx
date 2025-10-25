import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, TrendingUp, Calendar, Bell, Download } from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import FinancialChart from '../../components/Dashboard/FinancialChart';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

const UserDashboard: React.FC = () => {
  const [daysToDeadline, setDaysToDeadline] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<any[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tax forms
      const formsResponse = await apiService.getTaxForms();
      if (formsResponse.success) {
        const forms = formsResponse.data.taxForms;
        
        // Calculate total income and tax from all forms
        let income = 0;
        let tax = 0;
        const yearlyData: any = {};
        
        forms.forEach((form: any) => {
          // Use the pre-calculated totalIncome from the form (already calculated in backend)
          const formIncome = form.income?.totalIncome || 0;
          income += formIncome;
          
          // Get calculated tax
          const formTax = form.taxCalculation?.totalTax || 0;
          tax += formTax;
          
          // Group by financial year for chart
          const year = form.financialYear || 'Unknown';
          if (!yearlyData[year]) {
            yearlyData[year] = { year, income: 0, tax: 0, refund: 0, tds: 0 };
          }
          yearlyData[year].income += formIncome;
          yearlyData[year].tax += formTax;
          yearlyData[year].refund += form.taxCalculation?.refund || 0;
          yearlyData[year].tds += form.deductions?.tds || 0;
        });
        
        setTotalIncome(income);
        setTotalTax(tax);
        setFinancialData(Object.values(yearlyData).sort((a: any, b: any) => a.year.localeCompare(b.year)));
      }
      
      // Fetch documents count
      const docsResponse = await apiService.getDocuments();
      if (docsResponse.success) {
        setDocumentCount(docsResponse.data.documents?.length || 0);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate days until September 16 ITR deadline
  useEffect(() => {
    const calculateDaysToDeadline = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // ITR deadline is September 16 of current year
      // If we're past September 16, show next year's deadline
      let deadlineDate = new Date(currentYear, 8, 16); // Month is 0-indexed, so 8 = September
      
      // If today is after this year's deadline, use next year's deadline
      if (today > deadlineDate) {
        deadlineDate = new Date(currentYear + 1, 8, 16);
      }
      
      // Calculate difference in days
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysToDeadline(diffDays);
    };

    calculateDaysToDeadline();
    
    // Update daily at midnight
    const interval = setInterval(() => {
      calculateDaysToDeadline();
    }, 1000 * 60 * 60 * 24); // Update every 24 hours

    return () => clearInterval(interval);
  }, []);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage change (comparing latest year to previous)
  const calculateChange = (data: any[], key: string) => {
    if (data.length < 2) return null;
    const latest = data[data.length - 1][key] || 0;
    const previous = data[data.length - 2][key] || 0;
    if (previous === 0) return null;
    const change = ((latest - previous) / previous) * 100;
    return { value: Math.abs(change), type: change >= 0 ? 'increase' : 'decrease' };
  };

  // Get the deadline date for display
  const getDeadlineDate = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let deadlineDate = new Date(currentYear, 8, 16); // September 16
    
    if (today > deadlineDate) {
      deadlineDate = new Date(currentYear + 1, 8, 16);
    }
    
    return deadlineDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Download ITR Guide
  const handleDownloadGuide = async () => {
    try {
      toast.loading('Downloading ITR Guide...');
      const blob = await apiService.downloadGuide();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = 'Income-Tax-Guide-for-India.pdf';
      window.document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(link);
      toast.dismiss();
      toast.success('ITR Guide downloaded successfully!');
    } catch (error: any) {
      toast.dismiss();
      console.error('Download guide error:', error);
      toast.error(error.message || 'Failed to download ITR guide');
    }
  };

  const recentActivity = [
    { type: 'upload', message: 'Form 16 uploaded successfully', time: '2 hours ago' },
    { type: 'review', message: 'ITR-1 reviewed by CA', time: '1 day ago' },
    { type: 'calculation', message: 'Tax calculation updated', time: '3 days ago' },
    { type: 'reminder', message: `ITR filing deadline: ${getDeadlineDate()}`, time: '1 week ago' },
  ];

  const taxTips = [
    "Maximize Section 80C deductions up to ₹1.5 lakh (PPF, ELSS, NSC)",
    "Claim HRA exemption if you're paying rent in metro cities",
    "Health insurance premiums qualify for Section 80D deductions",
    "Keep all investment proofs and rent receipts for tax filing",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          change={calculateChange(financialData, 'income')}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Income Tax"
          value={formatCurrency(totalTax)}
          change={calculateChange(financialData, 'tax')}
          icon={<TrendingUp className="w-6 h-6" />}
          color="red"
        />
        <StatsCard
          title="Documents"
          value={documentCount.toString()}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Days to ITR Deadline"
          value={daysToDeadline.toString()}
          icon={<Calendar className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      {financialData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialChart
            title="Income Trend"
            data={financialData}
            dataKey="income"
            type="line"
            color="#059669"
          />
          <FinancialChart
            title="Income Tax Liability"
            data={financialData}
            dataKey="tax"
            type="bar"
            color="#dc2626"
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tax Forms Yet</h3>
            <p className="text-gray-600 mb-6">Create your first ITR form to see your financial trends and tax calculations.</p>
            <Button onClick={() => window.location.href = '/dashboard/itr-forms'}>
              Create ITR Form
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ITR Filing Progress */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">ITR Filing Progress</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: 'Personal Information', completed: true },
                { step: 'Income Details (Form 16)', completed: true },
                { step: 'Deductions & Exemptions', completed: false },
                { step: 'Review & Submit', completed: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    item.completed 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-600' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {item.completed && <span className="text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="w-full">Continue ITR Filing</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Tax Tips */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Income Tax Tips</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxTips.map((tip, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-800">{tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                icon={<Download className="w-4 h-4" />}
                onClick={handleDownloadGuide}
              >
                Download ITR Guide
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                onClick={() => window.location.href = '/dashboard/guide'}
              >
                📚 Complete ITR Filing Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;