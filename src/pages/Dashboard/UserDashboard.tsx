import React from 'react';
import { DollarSign, FileText, TrendingUp, Calendar, Bell, Download } from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import FinancialChart from '../../components/Dashboard/FinancialChart';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const UserDashboard: React.FC = () => {
  const financialData = [
    { year: '2019-20', income: 750000, tax: 62500, refund: 15000, tds: 75000 },
    { year: '2020-21', income: 820000, tax: 78000, refund: 12000, tds: 85000 },
    { year: '2021-22', income: 950000, tax: 112500, refund: 8000, tds: 120000 },
    { year: '2022-23', income: 1200000, tax: 187500, refund: 5000, tds: 180000 },
    { year: '2023-24', income: 1350000, tax: 262500, refund: 0, tds: 200000 },
  ];

  const recentActivity = [
    { type: 'upload', message: 'Form 16 uploaded successfully', time: '2 hours ago' },
    { type: 'review', message: 'ITR-1 reviewed by CA', time: '1 day ago' },
    { type: 'calculation', message: 'Tax calculation updated', time: '3 days ago' },
    { type: 'reminder', message: 'ITR filing deadline: November 30th, 2025', time: '1 week ago' },
  ];

  const taxTips = [
    "Maximize Section 80C deductions up to ₹1.5 lakh (PPF, ELSS, NSC)",
    "Claim HRA exemption if you're paying rent in metro cities",
    "Health insurance premiums qualify for Section 80D deductions",
    "Keep all investment proofs and rent receipts for tax filing",
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value="₹13,50,000"
          change={{ value: 7.4, type: 'increase' }}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Income Tax"
          value="₹2,62,500"
          change={{ value: 12.8, type: 'increase' }}
          icon={<TrendingUp className="w-6 h-6" />}
          color="red"
        />
        <StatsCard
          title="Documents"
          value="8"
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Days to ITR Deadline"
          value="42"
          icon={<Calendar className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
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
            <div className="mt-4">
              <Button variant="outline" className="w-full" icon={<Download className="w-4 h-4" />}>
                Download ITR Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;