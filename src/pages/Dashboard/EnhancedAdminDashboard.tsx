import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTaxForms: number;
  pendingForms: number;
  approvedForms: number;
  totalDocuments: number;
  pendingDocuments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface UserActivity {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  taxFormsCount: number;
  documentsCount: number;
}

interface FormActivity {
  id: string;
  userId: string;
  userName: string;
  formType: string;
  assessmentYear: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const EnhancedAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [formActivity, setFormActivity] = useState<FormActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real application, you would have admin-specific API endpoints
      // For now, we'll simulate the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1250,
        activeUsers: 980,
        totalTaxForms: 2100,
        pendingForms: 150,
        approvedForms: 1850,
        totalDocuments: 8500,
        pendingDocuments: 200,
        totalRevenue: 2500000,
        monthlyRevenue: 450000
      });

      setUserActivity([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          lastLogin: '2024-01-15T10:30:00Z',
          status: 'active',
          taxFormsCount: 3,
          documentsCount: 12
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          lastLogin: '2024-01-14T15:45:00Z',
          status: 'active',
          taxFormsCount: 2,
          documentsCount: 8
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          lastLogin: '2024-01-10T09:15:00Z',
          status: 'inactive',
          taxFormsCount: 1,
          documentsCount: 5
        }
      ]);

      setFormActivity([
        {
          id: '1',
          userId: '1',
          userName: 'John Doe',
          formType: 'ITR-1',
          assessmentYear: '2024-25',
          status: 'in-review',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          userId: '2',
          userName: 'Jane Smith',
          formType: 'ITR-2',
          assessmentYear: '2024-25',
          status: 'approved',
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-15T08:20:00Z'
        }
      ]);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard data');
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'in-review': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'in-review': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and analytics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button icon={<Activity className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Forms</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalTaxForms.toLocaleString()}</p>
                <p className="text-sm text-blue-600">{stats?.pendingForms} pending review</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-green-600">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">User growth chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent User Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent User Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1 capitalize">{user.status}</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Last login: {formatDate(user.lastLogin)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Form Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Form Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formActivity.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{form.userName}</p>
                    <p className="text-sm text-gray-600">{form.formType} - AY {form.assessmentYear}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                      {getStatusIcon(form.status)}
                      <span className="ml-1 capitalize">{form.status.replace('-', ' ')}</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(form.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Database</p>
                <p className="text-sm text-green-700">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">File Storage</p>
                <p className="text-sm text-green-700">Storage healthy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Email Service</p>
                <p className="text-sm text-yellow-700">Minor delays</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminDashboard;
