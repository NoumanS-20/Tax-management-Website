import React from 'react';
import { Users, FileText, DollarSign, AlertCircle, TrendingUp, Download } from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import FinancialChart from '../../components/Dashboard/FinancialChart';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AdminDashboard: React.FC = () => {
  const platformData = [
    { year: '2019-20', users: 1200, filings: 980, revenue: 4800000 },
    { year: '2020-21', users: 1800, filings: 1450, revenue: 7250000 },
    { year: '2021-22', users: 2500, filings: 2100, revenue: 10500000 },
    { year: '2022-23', users: 3200, filings: 2800, revenue: 14000000 },
    { year: '2023-24', users: 4100, filings: 3500, revenue: 17500000 },
  ];

  const usersByRole = [
    { role: 'Individual Taxpayers', count: 3850, color: '#2563eb' },
    { role: 'Premium', count: 245, color: '#059669' },
    { role: 'CAs/Tax Consultants', count: 15, color: '#d97706' },
  ];

  const recentAlerts = [
    { type: 'error', message: 'Server response time spike detected', time: '5 min ago', severity: 'high' },
    { type: 'warning', message: 'Database storage at 85% capacity', time: '2 hours ago', severity: 'medium' },
    { type: 'info', message: 'Weekly backup completed successfully', time: '1 day ago', severity: 'low' },
    { type: 'warning', message: 'Unusual login pattern detected', time: '2 days ago', severity: 'medium' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="4,110"
          change={{ value: 28.4, type: 'increase' }}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="ITR Filings"
          value="3,542"
          change={{ value: 25.1, type: 'increase' }}
          icon={<FileText className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Revenue"
          value="₹1,75,00,000"
          change={{ value: 25.0, type: 'increase' }}
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="System Alerts"
          value="12"
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialChart
          title="Platform Growth"
          data={platformData}
          dataKey="users"
          type="line"
          color="#2563eb"
        />
        <FinancialChart
          title="Revenue Trend"
          data={platformData}
          dataKey="revenue"
          type="bar"
          color="#059669"
        />
      </div>

      {/* Management Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersByRole.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.role}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <Button className="w-full">Manage Users</Button>
              <Button variant="outline" className="w-full">Export Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{alert.time}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Alerts</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" icon={<Users className="w-4 h-4" />}>
                Add New User
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={<FileText className="w-4 h-4" />}>
                Review Pending ITRs
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={<TrendingUp className="w-4 h-4" />}>
                Generate Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={<Download className="w-4 h-4" />}>
                Export Data
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Server Uptime</span>
                  <span className="text-sm font-medium text-blue-900">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Response Time</span>
                  <span className="text-sm font-medium text-blue-900">120ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Active Sessions</span>
                  <span className="text-sm font-medium text-blue-900">1,247</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;