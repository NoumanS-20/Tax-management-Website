import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  BarChart3, 
  Settings,
  Users,
  TrendingUp,
  Calculator,
  HelpCircle,
  LogOut,
  Bell,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const userNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/itr-forms', icon: FileText, label: 'ITR Forms' },
    { path: '/documents', icon: Upload, label: 'Documents' },
    { path: '/calculator', icon: Calculator, label: 'Tax Calculator' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const accountantNavItems = [
    { path: '/accountant', icon: LayoutDashboard, label: 'Accountant Dashboard' },
    { path: '/accountant/clients', icon: Users, label: 'Client Management' },
    { path: '/accountant/reviews', icon: FileText, label: 'ITR Review Queue' },
    { path: '/accountant/reports', icon: BarChart3, label: 'Client Reports' },
  ];

  const getNavItems = () => {
    if (user?.role === 'admin') return adminNavItems;
    if (user?.role === 'accountant') return accountantNavItems;
    return userNavItems;
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FinStack</h1>
            <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 mb-2">
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </button>
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;