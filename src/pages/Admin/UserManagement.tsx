import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreVertical, Edit, Trash2, Eye, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'accountant';
  status: 'active' | 'inactive' | 'suspended';
  panNumber?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  taxFormsCount: number;
  documentsCount: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          panNumber: 'ABCDE1234F',
          phone: '+91 9876543210',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-01-15T10:30:00Z',
          taxFormsCount: 3,
          documentsCount: 12
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'user',
          status: 'active',
          panNumber: 'FGHIJ5678K',
          phone: '+91 9876543211',
          createdAt: '2024-01-05T00:00:00Z',
          lastLogin: '2024-01-14T15:45:00Z',
          taxFormsCount: 2,
          documentsCount: 8
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@example.com',
          role: 'accountant',
          status: 'active',
          phone: '+91 9876543212',
          createdAt: '2024-01-10T00:00:00Z',
          lastLogin: '2024-01-15T09:15:00Z',
          taxFormsCount: 0,
          documentsCount: 0
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah@example.com',
          role: 'user',
          status: 'inactive',
          panNumber: 'LMNOP9012Q',
          phone: '+91 9876543213',
          createdAt: '2023-12-15T00:00:00Z',
          lastLogin: '2024-01-05T14:20:00Z',
          taxFormsCount: 1,
          documentsCount: 5
        }
      ];

      setUsers(mockUsers);
    } catch (error: any) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'active' } : user
          ));
          toast.success('User activated successfully');
          break;
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'inactive' } : user
          ));
          toast.success('User deactivated successfully');
          break;
        case 'suspend':
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'suspended' } : user
          ));
          toast.success('User suspended successfully');
          break;
        case 'delete':
          setUsers(prev => prev.filter(user => user.id !== userId));
          toast.success('User deleted successfully');
          break;
      }
    } catch (error: any) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
          ));
          toast.success(`${selectedUsers.length} users activated`);
          break;
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
          ));
          toast.success(`${selectedUsers.length} users deactivated`);
          break;
        case 'delete':
          setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
          toast.success(`${selectedUsers.length} users deleted`);
          break;
      }
      setSelectedUsers([]);
    } catch (error: any) {
      toast.error(`Failed to ${action} users`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100';
      case 'accountant': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
        </div>
        <Button
          onClick={() => setShowUserModal(true)}
          icon={<Users className="w-5 h-5" />}
        >
          Add User
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="accountant">Accountant</option>
              <option value="admin">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate ({selectedUsers.length})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(user => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 font-semibold">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        <p>{user.taxFormsCount} forms</p>
                        <p>{user.documentsCount} documents</p>
                        {user.lastLogin && (
                          <p className="text-xs text-gray-500">
                            Last login: {formatDate(user.lastLogin)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                          icon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<MoreVertical className="w-4 h-4" />}
                          >
                            More
                          </Button>
                          {/* Dropdown menu would go here */}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={(userData) => {
            if (editingUser) {
              setUsers(prev => prev.map(user => 
                user.id === editingUser.id ? { ...user, ...userData } : user
              ));
            } else {
              const newUser: User = {
                id: Date.now().toString(),
                ...userData,
                createdAt: new Date().toISOString(),
                taxFormsCount: 0,
                documentsCount: 0
              };
              setUsers(prev => [newUser, ...prev]);
            }
            setShowUserModal(false);
            setEditingUser(null);
            toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
          }}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal: React.FC<{
  user?: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
    panNumber: user?.panNumber || '',
    phone: user?.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="accountant">Accountant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Number
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABCDE1234F"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 9876543210"
            />
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
              className="flex-1"
            >
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
