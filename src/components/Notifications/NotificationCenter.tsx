import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Trash2, Mail, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../UI/Card';
import Button from '../UI/Button';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  metadata?: {
    taxFormId?: string;
    documentId?: string;
    dueDate?: string;
    amount?: number;
    actionUrl?: string;
    actionText?: string;
  };
  createdAt: string;
  readAt?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { isRead: filter === 'unread' ? 'false' : 'true' };
      const response = await apiService.getNotifications(params);
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await apiService.markNotificationAsRead(id);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, isRead: true, readAt: new Date().toISOString() } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiService.markAllNotificationsAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await apiService.deleteNotification(id);
      if (response.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        toast.success('Notification deleted');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-5 h-5 ${
      priority === 'urgent' ? 'text-red-600' :
      priority === 'high' ? 'text-orange-600' :
      priority === 'medium' ? 'text-blue-600' :
      'text-gray-600'
    }`;

    switch (type) {
      case 'tax_deadline':
        return <AlertCircle className={iconClass} />;
      case 'document_uploaded':
        return <Mail className={iconClass} />;
      case 'form_reviewed':
        return <CheckCircle className={iconClass} />;
      case 'payment_due':
        return <AlertCircle className={iconClass} />;
      case 'refund_processed':
        return <CheckCircle className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
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
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            icon={<Check className="w-4 h-4" />}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any notifications yet." 
                : `No ${filter} notifications found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.isRead ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        
                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="mt-3 space-y-1">
                            {notification.metadata.dueDate && (
                              <p className="text-sm text-gray-500">
                                Due: {new Date(notification.metadata.dueDate).toLocaleDateString()}
                              </p>
                            )}
                            {notification.metadata.amount && (
                              <p className="text-sm text-gray-500">
                                Amount: ₹{notification.metadata.amount.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(notification.createdAt)}
                          {notification.readAt && (
                            <span className="ml-2">• Read {formatDate(notification.readAt)}</span>
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification.id)}
                            icon={<Check className="w-4 h-4" />}
                          >
                            Mark Read
                          </Button>
                        )}
                        
                        {notification.metadata?.actionUrl && (
                          <Button
                            size="sm"
                            href={notification.metadata.actionUrl}
                          >
                            {notification.metadata.actionText || 'View'}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNotification(notification.id)}
                          icon={<Trash2 className="w-4 h-4" />}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
