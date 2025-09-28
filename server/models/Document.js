const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taxFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxForm',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'form16', 
      'form16a', 
      'salarySlip', 
      'bankStatement', 
      'investmentProof', 
      'rentReceipt', 
      'panCard',
      'aadharCard',
      'passport',
      'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['income', 'deduction', 'exemption', 'identity', 'other'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  mimeType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'processing'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    trim: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  assessmentYear: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Assessment year must be in format YYYY-YY']
  },
  financialYear: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}$/, 'Financial year must be in format YYYY-YY']
  },
  metadata: {
    extractedData: mongoose.Schema.Types.Mixed,
    ocrText: String,
    confidence: Number,
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  tags: [String],
  isRequired: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Documents expire after 7 years as per tax law
      return new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ userId: 1, assessmentYear: 1 });
documentSchema.index({ taxFormId: 1 });
documentSchema.index({ type: 1, status: 1 });
documentSchema.index({ uploadedAt: -1 });
documentSchema.index({ expiresAt: 1 });

// Virtual for file size in human readable format
documentSchema.virtual('sizeFormatted').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Ensure virtual fields are serialized
documentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);
