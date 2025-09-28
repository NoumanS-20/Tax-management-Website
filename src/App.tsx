import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import DocumentManager from './pages/Documents/DocumentManager';
import AdvancedDocumentManager from './pages/Documents/AdvancedDocumentManager';
import ITRFormManager from './pages/ITR/ITRFormManager';
import AdvancedTaxCalculator from './pages/Calculator/AdvancedTaxCalculator';
import NotificationCenter from './components/Notifications/NotificationCenter';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'accountant') return '/accountant';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
      
      {/* User Routes */}
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/documents" element={<AdvancedDocumentManager />} />
      <Route path="/itr-forms" element={<ITRFormManager />} />
      <Route path="/calculator" element={<AdvancedTaxCalculator />} />
      <Route path="/notifications" element={<NotificationCenter />} />
      <Route path="/reports" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2><p className="text-gray-600">Detailed reports coming soon...</p></div>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2><p className="text-gray-600">User management interface coming soon...</p></div>} />
      <Route path="/admin/analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2><p className="text-gray-600">Advanced analytics dashboard coming soon...</p></div>} />
      <Route path="/admin/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2><p className="text-gray-600">System settings coming soon...</p></div>} />
      
      {/* Accountant Routes */}
      <Route path="/accountant" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Accountant Dashboard</h2><p className="text-gray-600">Accountant dashboard coming soon...</p></div>} />
      <Route path="/accountant/clients" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Client Management</h2><p className="text-gray-600">Client management interface coming soon...</p></div>} />
      <Route path="/accountant/reviews" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">ITR Review Queue</h2><p className="text-gray-600">ITR review queue coming soon...</p></div>} />
      <Route path="/accountant/reports" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 mb-4">Client Reports</h2><p className="text-gray-600">Client reports coming soon...</p></div>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardRouter />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;