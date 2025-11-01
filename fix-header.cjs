const fs = require('fs');
const path = require('path');

const headerContent = `import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, X, Trash2, AlertCircle, Mail, CheckCircle, Info } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data.notifications.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await fetch(\`/api/notifications/\${notification.id}/read\`, {
        method: 'PATCH',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        }
      });
      
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
      setShowNotifications(false);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(\`/api/notifications/\${id}\`, {
        method: 'DELETE',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        }
      });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tax_deadline':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'document_uploaded':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'form_reviewed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return \`\${diffInMins}m ago\`;
    if (diffInHours < 24) return \`\${diffInHours}h ago\`;
    if (diffInDays < 7) return \`\${diffInDays}d ago\`;
    return notificationDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Tax Management System</h1>
          <p className="text-sm text-gray-500 mt-1">Simplify your tax filing process</p>
        </div>
        
        <div className="flex items-center space-x-6">
          {user && (
            <>
              <button
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-6 mt-80 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Notifications {unreadCount > 0 && \`(\${unreadCount})\`}
                    </h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={\`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer \${
                            !notification.read ? 'bg-blue-50' : ''
                          }\`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 text-center">
                    <button
                      onClick={() => {
                        navigate('/dashboard/notifications');
                        setShowNotifications(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">Role: {user.role}</p>
                      {user.panNumber && (
                        <p className="text-xs text-gray-400">PAN: {user.panNumber}</p>
                      )}
                      {user.aadharNumber && (
                        <p className="text-xs text-gray-400">Aadhaar: {user.aadharNumber}</p>
                      )}
                      {user.createdAt && (
                        <p className="text-xs text-gray-400">
                          Member since: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-sm bg-red-600 text-white hover:bg-red-700 rounded-b-lg font-medium transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
`;

const filePath = path.join(__dirname, 'src', 'components', 'Layout', 'Header.tsx');

try {
  // Delete the file first
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('Deleted existing Header.tsx');
  }
  
  // Wait a moment
  setTimeout(() => {
    // Write new file with UTF-8 encoding (no BOM)
    fs.writeFileSync(filePath, headerContent, { encoding: 'utf8' });
    console.log('Header.tsx created successfully with UTF-8 encoding');
    
    // Verify the file
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.startsWith('import React')) {
      console.log('✓ File verification successful - starts correctly');
    } else {
      console.log('✗ File verification failed - may be corrupted');
    }
  }, 1000);
} catch (error) {
  console.error('Error:', error.message);
}
