const Contact = require('../models/Contact');

// Create new contact message
const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Message length validation
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long'
      });
    }

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.get('user-agent') || '';

    // Create contact
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
      userId: req.user?._id || null // If user is logged in
    });

    console.log('New contact message received:', {
      id: contact._id,
      email: contact.email,
      subject: contact.subject
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contact._id,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

// Get all contact messages (Admin only)
const getAllContacts = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName email')
      .populate('repliedBy', 'firstName lastName');

    const total = await Contact.countDocuments(query);

    // Transform contacts to include id field
    const transformedContacts = contacts.map(contact => ({
      ...contact.toObject(),
      id: contact._id.toString()
    }));

    res.json({
      success: true,
      data: {
        contacts: transformedContacts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
};

// Get single contact message (Admin only)
const getContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id)
      .populate('userId', 'firstName lastName email panNumber phone')
      .populate('repliedBy', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...contact.toObject(),
        id: contact._id.toString()
      }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
};

// Update contact status (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    
    if (status === 'replied') {
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.user._id;
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: {
        ...contact.toObject(),
        id: contact._id.toString()
      }
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message'
    });
  }
};

// Delete contact message (Admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
};

// Get contact statistics (Admin only)
const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Contact.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Contact.countDocuments({ createdAt: { $gte: today } });

    const statsObj = {
      total,
      today: todayCount,
      byStatus: {}
    };

    stats.forEach(stat => {
      statsObj.byStatus[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: statsObj
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
};
