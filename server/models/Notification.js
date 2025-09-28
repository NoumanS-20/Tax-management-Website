const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'tax_deadline',
      'document_uploaded',
      'form_reviewed',
      'payment_due',
      'refund_processed',
      'system_update',
      'reminder',
      'alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isEmailSent: {
    type: Boolean,
    default: false
  },
  isSmsSent: {
    type: Boolean,
    default: false
  },
  metadata: {
    taxFormId: mongoose.Schema.Types.ObjectId,
    documentId: mongoose.Schema.Types.ObjectId,
    dueDate: Date,
    amount: Number,
    actionUrl: String,
    actionText: String
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  readAt: Date,
  expiresAt: {
    type: Date,
    default: function() {
      // Notifications expire after 30 days
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });

// Static method to create deadline notifications
notificationSchema.statics.createDeadlineNotification = async function(userId, type, title, message, dueDate) {
  return this.create({
    userId,
    type: 'tax_deadline',
    title,
    message,
    priority: 'high',
    metadata: {
      dueDate
    },
    scheduledFor: new Date()
  });
};

// Static method to create document notifications
notificationSchema.statics.createDocumentNotification = async function(userId, type, title, message, documentId) {
  return this.create({
    userId,
    type: 'document_uploaded',
    title,
    message,
    priority: 'medium',
    metadata: {
      documentId
    },
    scheduledFor: new Date()
  });
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
