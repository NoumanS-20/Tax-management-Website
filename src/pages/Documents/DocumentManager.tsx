import React, { useState } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import DropZone from '../../components/FileUpload/DropZone';

interface Document {
  id: string;
  name: string;
  type: 'form16' | 'form16a' | 'salarySlip' | 'bankStatement' | 'investmentProof' | 'rentReceipt' | 'other';
  size: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

const DocumentManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Form16_2023-24_TechCorp.pdf',
      type: 'form16',
      size: 245760,
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'verified'
    },
    {
      id: '2',
      name: 'Form16A_TDS_Certificate.pdf',
      type: 'form16a',
      size: 156800,
      uploadedAt: '2024-01-20T14:15:00Z',
      status: 'verified'
    },
    {
      id: '3',
      name: 'LIC_Premium_Receipts_2023.pdf',
      type: 'investmentProof',
      size: 512000,
      uploadedAt: '2024-02-01T09:45:00Z',
      status: 'pending'
    },
    {
      id: '4',
      name: 'SBI_Statement_Mar2024.pdf',
      type: 'bankStatement',
      size: 320000,
      uploadedAt: '2024-02-05T16:20:00Z',
      status: 'rejected'
    }
  ]);

  const getTypeIcon = (type: string) => {
    const icons = {
      form16: '📄',
      form16a: '📋',
      salarySlip: '💰',
      bankStatement: '🏦',
      investmentProof: '📈',
      rentReceipt: '🏠',
      other: '📁'
    };
    return icons[type as keyof typeof icons] || '📁';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.status === filter || doc.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleFilesUploaded = (files: File[]) => {
    console.log('Files uploaded:', files);
    // In a real app, you would upload these files to your server
    setShowUpload(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Manager</h1>
          <p className="text-gray-600">Upload and manage your ITR documents</p>
        </div>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          icon={<Upload className="w-4 h-4" />}
        >
          Upload Documents
        </Button>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <DropZone
          onFilesUploaded={handleFilesUploaded}
          acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
          maxSize={10 * 1024 * 1024}
          multiple={true}
        />
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Documents</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="form16">Form 16</option>
                <option value="form16a">Form 16A</option>
                <option value="salarySlip">Salary Slips</option>
                <option value="bankStatement">Bank Statements</option>
                <option value="investmentProof">Investment Proofs</option>
                <option value="rentReceipt">Rent Receipts</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500">Uploaded on</p>
                <p className="text-sm text-gray-900">{formatDate(doc.uploadedAt)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" icon={<Eye className="w-3 h-3" />}>
                  View
                </Button>
                <Button size="sm" variant="outline" icon={<Download className="w-3 h-3" />}>
                  Download
                </Button>
                <Button size="sm" variant="ghost" icon={<Trash2 className="w-3 h-3" />}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'
              }
            </p>
            {(!searchTerm && filter === 'all') && (
              <Button
                onClick={() => setShowUpload(true)}
                icon={<Upload className="w-4 h-4" />}
              >
                Upload Documents
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentManager;