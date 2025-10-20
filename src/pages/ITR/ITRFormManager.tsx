import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import { TaxForm } from '../../types';
import toast from 'react-hot-toast';

const ITRFormManager: React.FC = () => {
  const navigate = useNavigate();
  const [taxForms, setTaxForms] = useState<TaxForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchTaxForms();
  }, []);

  const fetchTaxForms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTaxForms();
      if (response.success) {
        setTaxForms(response.data.taxForms);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch tax forms');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (formId: string) => {
    toast.success('Opening form details...');
    // Navigate to form details page
    navigate(`/dashboard/itr-forms/${formId}`);
  };

  const handleContinue = (formId: string) => {
    toast.success('Continue editing form...');
    // Navigate to form edit page
    navigate(`/dashboard/itr-forms/${formId}/edit`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'in-review': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'filed': return 'text-purple-600 bg-purple-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'in-review': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'filed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
          <h1 className="text-3xl font-bold text-gray-900">ITR Forms</h1>
          <p className="text-gray-600 mt-2">Manage your Income Tax Returns</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          icon={<Plus className="w-5 h-5" />}
        >
          Create New ITR
        </Button>
      </div>

      {/* Forms Grid */}
      {taxForms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ITR Forms Yet</h3>
            <p className="text-gray-600 mb-6">Create your first Income Tax Return form to get started.</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              icon={<Plus className="w-5 h-5" />}
            >
              Create Your First ITR
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxForms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {form.formType} - AY {form.assessmentYear}
                    </h3>
                    <p className="text-sm text-gray-600">
                      FY {form.financialYear}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                    {getStatusIcon(form.status)}
                    <span className="ml-1 capitalize">{form.status.replace('-', ' ')}</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tax Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Income</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(form.taxCalculation.grossTotalIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Taxable Income</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(form.taxCalculation.taxableIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Tax</p>
                        <p className="font-semibold text-red-600">
                          {formatCurrency(form.taxCalculation.totalTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Refund</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(form.taxCalculation.refund)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Documents</span>
                    <span className="font-medium">{form.documents?.length || 0} uploaded</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {form.status === 'filed' ? '100%' : 
                         form.status === 'approved' ? '90%' :
                         form.status === 'in-review' ? '75%' : '50%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: form.status === 'filed' ? '100%' : 
                                 form.status === 'approved' ? '90%' :
                                 form.status === 'in-review' ? '75%' : '50%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(form.id)}
                    >
                      View Details
                    </Button>
                    {form.status === 'draft' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleContinue(form.id)}
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <CreateITRFormModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchTaxForms();
          }}
        />
      )}
    </div>
  );
};

// Create ITR Form Modal Component
const CreateITRFormModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    assessmentYear: '2024-25',
    financialYear: '2023-24',
    formType: 'ITR-1'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.createTaxForm(formData);
      if (response.success) {
        toast.success('ITR form created successfully!');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create ITR form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New ITR Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Year
            </label>
            <select
              value={formData.assessmentYear}
              onChange={(e) => setFormData({ ...formData, assessmentYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Year
            </label>
            <select
              value={formData.financialYear}
              onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
              <option value="2021-22">2021-22</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Type
            </label>
            <select
              value={formData.formType}
              onChange={(e) => setFormData({ ...formData, formType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ITR-1">ITR-1 (Sahaj) - For Salaried Individuals</option>
              <option value="ITR-2">ITR-2 - For Individuals with Capital Gains</option>
              <option value="ITR-3">ITR-3 - For Business/Professional Income</option>
              <option value="ITR-4">ITR-4 (Sugam) - For Presumptive Business</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Create Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ITRFormManager;
