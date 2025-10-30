import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, X, Trash2, AlertCircle, Mail, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications({ limit: 5 });
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error: any) {
      // Silently fail to avoid spam
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiService.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      toast.success('Notification deleted');
    } catch (error: any) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-4 h-4 ${
      priority === 'urgent' ? 'text-red-600' :
      priority === 'high' ? 'text-orange-600' :
      priority === 'medium' ? 'text-blue-600' :
      'text-gray-600'
    }`;

    switch (type) {
      case 'tax_deadline':
      case 'payment_due':
        return <AlertCircle className={iconClass} />;
      case 'document_uploaded':
        return <Mail className={iconClass} />;
      case 'form_reviewed':
      case 'refund_processed':
        return <CheckCircle className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setShowNotifications(false);
    
    // Navigate based on notification metadata
    if (notification.metadata?.actionUrl) {
      navigate(notification.metadata.actionUrl);
    } else if (notification.metadata?.taxFormId) {
      navigate(`/dashboard/itr-forms/${notification.metadata.taxFormId}`);
    } else if (notification.metadata?.documentId) {
      navigate('/dashboard/documents');
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h2>
          </div>
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      ...existing code...
    </header>
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  ></div>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <div>
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <p className="text-xs text-gray-600">{unreadCount} unread</p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <Bell className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-gray-600 font-medium">No notifications</p>
                          <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notification.isRead ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notification.type, notification.priority)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <p className={`text-sm font-medium ${
                                      !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                    }`}>
                                      {notification.title}
                                    </p>
                                    {!notification.isRead && (
                                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">
                                      {formatDate(notification.createdAt)}
                                    </span>
                                    <button
                                      onClick={(e) => deleteNotification(notification.id, e)}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/dashboard/notifications');
                          }}
                          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 relative">
              <div
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setShowUserInfo((prev) => !prev)}
              >
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <button
                className="p-0 m-0 flex items-center"
                onClick={() => setShowUserMenu((prev) => !prev)}
                aria-label="Open user menu"
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* User Info Dropdown */}
              {showUserInfo && (
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[260px]">
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</div>
                    <div><span className="font-medium">Email:</span> {user?.email}</div>
                    <div><span className="font-medium">Role:</span> {user?.role}</div>
                    {user?.panNumber && <div><span className="font-medium">PAN:</span> {user.panNumber}</div>}
                    {user?.aadharNumber && <div><span className="font-medium">Aadhaar:</span> {user.aadharNumber}</div>}
                    <div><span className="font-medium">Account Created:</span> {new Date(user?.createdAt || '').toLocaleDateString()}</div>
                    {user?.lastLogin && <div><span className="font-medium">Last Login:</span> {new Date(user.lastLogin).toLocaleString()}</div>}
                  </div>
                  <button
                    className="mt-3 w-full text-xs text-blue-600 hover:text-blue-700 font-medium border-t pt-2"
                    onClick={() => setShowUserInfo(false)}
                  >
                    Close
                  </button>
                </div>
              )}

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[120px]">
                  <button
                    className="w-full text-left px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded font-semibold"
                    onClick={() => { logout(); setShowUserMenu(false); }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;