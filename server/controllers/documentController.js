const Document = require('../models/Document');
const TaxForm = require('../models/TaxForm');
const Notification = require('../models/Notification');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = `uploads/${req.user._id}/${req.body.assessmentYear || 'temp'}`;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and DOC files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload document
const uploadDocument = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      assessmentYear,
      financialYear,
      taxFormId,
      isRequired = false
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if tax form exists
    let taxForm = null;
    if (taxFormId) {
      taxForm = await TaxForm.findOne({
        _id: taxFormId,
        userId: req.user._id
      });

      if (!taxForm) {
        return res.status(404).json({
          success: false,
          message: 'Tax form not found'
        });
      }
    }

    // Create document record
    const document = new Document({
      userId: req.user._id,
      taxFormId: taxFormId || null,
      name: name || req.file.originalname,
      originalName: req.file.originalname,
      type,
      category,
      filePath: req.file.path,
      url: `/uploads/${req.user._id}/${assessmentYear}/${req.file.filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype,
      assessmentYear,
      financialYear,
      isRequired
    });

    await document.save();

    // Add document to tax form if provided
    if (taxForm) {
      taxForm.documents.push({
        name: document.name,
        type: document.type,
        url: document.url,
        size: document.size,
        uploadedAt: document.uploadedAt,
        status: 'pending'
      });
      await taxForm.save();
    }

    // Create notification
    await Notification.create({
      userId: req.user._id,
      type: 'document_uploaded',
      title: 'Document Uploaded Successfully',
      message: `Your ${type} document has been uploaded and is pending verification.`,
      priority: 'medium',
      metadata: {
        documentId: document._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    
    // Clean up uploaded file if document creation failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload document'
    });
  }
};

// Get user documents
const getDocuments = async (req, res) => {
  try {
    const {
      assessmentYear,
      type,
      status,
      category,
      page = 1,
      limit = 10
    } = req.query;

    const query = { userId: req.user._id };
    if (assessmentYear) query.assessmentYear = assessmentYear;
    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.category = category;

    const documents = await Document.find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
};

// Get specific document
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: { document }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document'
    });
  }
};

// Download document
const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if file exists
    try {
      await fs.access(document.filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(document.filePath, document.originalName);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document'
    });
  }
};

// Update document
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, category, tags } = req.body;

    const document = await Document.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (document.status === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update verified document'
      });
    }

    // Update fields
    if (name) document.name = name;
    if (type) document.type = type;
    if (category) document.category = category;
    if (tags) document.tags = tags;

    await document.save();

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update document'
    });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }

    // Remove document from tax form if associated
    if (document.taxFormId) {
      await TaxForm.findByIdAndUpdate(document.taxFormId, {
        $pull: { documents: { _id: document._id } }
      });
    }

    // Delete document record
    await Document.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

// Verify document (for accountants/admins)
const verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    document.status = status;
    document.verificationNotes = notes;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();

    await document.save();

    // Create notification for user
    await Notification.create({
      userId: document.userId,
      type: 'document_uploaded',
      title: `Document ${status === 'verified' ? 'Verified' : 'Rejected'}`,
      message: `Your document "${document.name}" has been ${status}. ${notes ? `Notes: ${notes}` : ''}`,
      priority: status === 'verified' ? 'medium' : 'high'
    });

    res.json({
      success: true,
      message: `Document ${status} successfully`
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify document'
    });
  }
};

// Get documents for verification (for accountants/admins)
const getDocumentsForVerification = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10 } = req.query;

    const documents = await Document.find({ status })
      .populate('userId', 'firstName lastName email')
      .sort({ uploadedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Document.countDocuments({ status });

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get documents for verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents for verification'
    });
  }
};

module.exports = {
  upload,
  uploadDocument,
  getDocuments,
  getDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
  verifyDocument,
  getDocumentsForVerification
};
