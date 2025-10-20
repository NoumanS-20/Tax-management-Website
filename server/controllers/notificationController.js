const Notification = require('../models/Notification');
const User = require('../models/User');

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const { isRead, type, priority, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user._id };
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    // Transform _id to id for frontend compatibility
    const transformedNotifications = notifications.map(notif => ({
      ...notif.toObject(),
      id: notif._id.toString()
    }));

    res.json({
      success: true,
      data: {
        notifications: transformedNotifications,
        unreadCount,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

// Create notification (for admins)
const createNotification = async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      priority = 'medium',
      metadata = {}
    } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      priority,
      metadata
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
};

// Send bulk notifications (for admins)
const sendBulkNotifications = async (req, res) => {
  try {
    const {
      userIds,
      type,
      title,
      message,
      priority = 'medium',
      metadata = {}
    } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    // Validate all users exist
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some users not found'
      });
    }

    // Create notifications
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      priority,
      metadata
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Notifications sent to ${userIds.length} users`
    });
  } catch (error) {
    console.error('Send bulk notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk notifications'
    });
  }
};

// Get notification statistics (for admins)
const getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead'
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              isRead: '$isRead'
            }
          }
        }
      }
    ]);

    // Process type statistics
    const typeStats = {};
    const priorityStats = {};

    if (stats.length > 0) {
      stats[0].byType.forEach(item => {
        if (!typeStats[item.type]) {
          typeStats[item.type] = { total: 0, unread: 0 };
        }
        typeStats[item.type].total++;
        if (!item.isRead) typeStats[item.type].unread++;
      });

      stats[0].byPriority.forEach(item => {
        if (!priorityStats[item.priority]) {
          priorityStats[item.priority] = { total: 0, unread: 0 };
        }
        priorityStats[item.priority].total++;
        if (!item.isRead) priorityStats[item.priority].unread++;
      });
    }

    res.json({
      success: true,
      data: {
        total: stats[0]?.total || 0,
        unread: stats[0]?.unread || 0,
        byType: typeStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics'
    });
  }
};

// Schedule notification (for system notifications)
const scheduleNotification = async (req, res) => {
  try {
    const {
      userId,
      type,
      title,
      message,
      priority = 'medium',
      scheduledFor,
      metadata = {}
    } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      priority,
      scheduledFor: new Date(scheduledFor),
      metadata
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification scheduled successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Schedule notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule notification'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  sendBulkNotifications,
  getNotificationStats,
  scheduleNotification
};
