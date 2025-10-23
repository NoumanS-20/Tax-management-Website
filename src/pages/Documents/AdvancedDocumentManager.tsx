import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Eye, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { apiService } from '../../services/api';
import { Document } from '../../types';
import toast from 'react-hot-toast';

const AdvancedDocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    assessmentYear: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await apiService.getDocuments(params);
      if (response.success) {
        setDocuments(response.data.documents);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await apiService.deleteDocument(id);
      if (response.success) {
        toast.success('Document deleted successfully');
        fetchDocuments();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      console.log('Downloading document:', doc);
      console.log('Document ID:', doc.id);
      const blob = await apiService.downloadDocument(doc.id);
      console.log('Blob received:', blob);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.originalName || doc.name;
      window.document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(link);
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download document');
    }
  };

  const handleView = async (doc: Document) => {
    try {
      console.log('Viewing document:', doc);
      console.log('Document ID:', doc.id);
      const blob = await apiService.downloadDocument(doc.id);
      console.log('Blob received:', blob);
      const url = window.URL.createObjectURL(blob);
      // Open in new tab
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        toast.error('Please allow pop-ups to view documents');
      }
      // Clean up after a delay to allow the browser to load the file
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error: any) {
      console.error('View error:', error);
      toast.error(error.message || 'Failed to view document');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Document Manager</h1>
          <p className="text-gray-600 mt-2">Upload and manage your tax documents</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          icon={<Upload className="w-5 h-5" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="form16">Form 16</option>
              <option value="form16a">Form 16A</option>
              <option value="salarySlip">Salary Slip</option>
              <option value="bankStatement">Bank Statement</option>
              <option value="investmentProof">Investment Proof</option>
              <option value="rentReceipt">Rent Receipt</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Assessment Year Filter */}
            <select
              value={filters.assessmentYear}
              onChange={(e) => setFilters({ ...filters, assessmentYear: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== '') 
                ? 'No documents match your search criteria.' 
                : 'Upload your first document to get started.'}
            </p>
            <Button
              onClick={() => setShowUploadModal(true)}
              icon={<Upload className="w-5 h-5" />}
            >
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {doc.type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    <span className="ml-1 capitalize">{doc.status}</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Document Info */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assessment Year:</span>
                      <span>{doc.assessmentYear}</span>
                    </div>
                  </div>

                  {/* Verification Notes */}
                  {doc.verificationNotes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {doc.verificationNotes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(doc)}
                      icon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      icon={<Trash2 className="w-4 h-4" />}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchDocuments();
          }}
        />
      )}
    </div>
  );
};

// Upload Document Modal Component
const UploadDocumentModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    assessmentYear: '2024-25',
    financialYear: '2023-24',
    taxFormId: '', // Optional - link to specific tax form
    isRequired: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [taxForms, setTaxForms] = useState<any[]>([]);

  // Fetch available tax forms
  useEffect(() => {
    const fetchTaxForms = async () => {
      try {
        const response = await apiService.getTaxForms();
        if (response.success) {
          setTaxForms(response.data.taxForms);
        }
      } catch (error) {
        console.error('Error fetching tax forms:', error);
      }
    };
    fetchTaxForms();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!formData.name) {
        setFormData({ ...formData, name: e.target.files[0].name });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      // Only include non-empty values
      Object.entries(formData).forEach(([key, value]) => {
        // Skip empty taxFormId
        if (key === 'taxFormId' && !value) return;
        uploadData.append(key, value.toString());
      });

      const response = await apiService.uploadDocument(uploadData);
      if (response.success) {
        toast.success('Document uploaded successfully!');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Type</option>
              <option value="form16">Form 16</option>
              <option value="form16a">Form 16A</option>
              <option value="salarySlip">Salary Slip</option>
              <option value="bankStatement">Bank Statement</option>
              <option value="investmentProof">Investment Proof</option>
              <option value="rentReceipt">Rent Receipt</option>
              <option value="panCard">PAN Card</option>
              <option value="aadharCard">Aadhaar Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              <option value="income">Income</option>
              <option value="deduction">Deduction</option>
              <option value="exemption">Exemption</option>
              <option value="identity">Identity</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Link to Tax Form (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link to Tax Form (Optional)
            </label>
            <select
              value={formData.taxFormId}
              onChange={(e) => setFormData({ ...formData, taxFormId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None - Upload without linking</option>
              {taxForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.formType} - FY {form.financialYear}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              You can link this document to a tax form later
            </p>
          </div>

          {/* Assessment Year */}
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

          {/* Required Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRequired"
              checked={formData.isRequired}
              onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-700">
              This is a required document
            </label>
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
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedDocumentManager;
