const TaxForm = require('../models/TaxForm');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Tax calculation engine
const calculateTax = (taxableIncome) => {
  let tax = 0;
  let surcharge = 0;
  let cess = 0;

  if (taxableIncome <= 250000) {
    tax = 0;
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 750000) {
    tax = 12500 + (taxableIncome - 500000) * 0.10;
  } else if (taxableIncome <= 1000000) {
    tax = 37500 + (taxableIncome - 750000) * 0.15;
  } else if (taxableIncome <= 1250000) {
    tax = 75000 + (taxableIncome - 1000000) * 0.20;
  } else if (taxableIncome <= 1500000) {
    tax = 125000 + (taxableIncome - 1250000) * 0.25;
  } else {
    tax = 187500 + (taxableIncome - 1500000) * 0.30;
  }

  // Surcharge calculation
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    surcharge = tax * 0.10;
  } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
    surcharge = tax * 0.15;
  } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
    surcharge = tax * 0.25;
  } else if (taxableIncome > 50000000) {
    surcharge = tax * 0.37;
  }

  // Health and Education Cess (4%)
  cess = (tax + surcharge) * 0.04;

  return {
    incomeTax: Math.round(tax),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTax: Math.round(tax + surcharge + cess)
  };
};

// Create new tax form
const createTaxForm = async (req, res) => {
  try {
    const {
      assessmentYear,
      financialYear,
      formType,
      personalInfo,
      income,
      deductions,
      exemptions
    } = req.body;

    // Check if form already exists for this assessment year
    const existingForm = await TaxForm.findOne({
      userId: req.user._id,
      assessmentYear
    });

    if (existingForm) {
      return res.status(400).json({
        success: false,
        message: 'Tax form already exists for this assessment year'
      });
    }

    // Auto-populate personal info from user profile if not provided
    const userPersonalInfo = {
      panNumber: personalInfo?.panNumber || req.user.panNumber,
      aadharNumber: personalInfo?.aadharNumber || req.user.aadharNumber,
      dateOfBirth: personalInfo?.dateOfBirth || req.user.dateOfBirth,
      address: personalInfo?.address || req.user.address,
      bankDetails: personalInfo?.bankDetails || {}
    };

    // Validate PAN number is available
    if (!userPersonalInfo.panNumber) {
      return res.status(400).json({
        success: false,
        message: 'PAN number is required. Please update your profile with PAN number before creating ITR form.'
      });
    }

    // Create new tax form
    const taxForm = new TaxForm({
      userId: req.user._id,
      assessmentYear,
      financialYear,
      formType,
      personalInfo: userPersonalInfo,
      income,
      deductions,
      exemptions
    });

    // Calculate tax
    const taxCalculation = calculateTax(taxForm.taxCalculation.taxableIncome);
    taxForm.taxCalculation = { ...taxForm.taxCalculation, ...taxCalculation };

    await taxForm.save();

    // Create notification
    await Notification.create({
      userId: req.user._id,
      type: 'form_reviewed',
      title: 'New Tax Form Created',
      message: `Your ${formType} for AY ${assessmentYear} has been created successfully.`,
      priority: 'medium'
    });

    res.status(201).json({
      success: true,
      message: 'Tax form created successfully',
      data: { taxForm }
    });
  } catch (error) {
    console.error('Create tax form error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create tax form'
    });
  }
};

// Get user's tax forms
const getTaxForms = async (req, res) => {
  try {
    const { assessmentYear, status, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    if (assessmentYear) query.assessmentYear = assessmentYear;
    if (status) query.status = status;

    const taxForms = await TaxForm.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('documents');

    const total = await TaxForm.countDocuments(query);

    res.json({
      success: true,
      data: {
        taxForms,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get tax forms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax forms'
    });
  }
};

// Get specific tax form
const getTaxForm = async (req, res) => {
  try {
    const { id } = req.params;

    const taxForm = await TaxForm.findOne({
      _id: id,
      userId: req.user._id
    }).populate('documents');

    if (!taxForm) {
      return res.status(404).json({
        success: false,
        message: 'Tax form not found'
      });
    }

    res.json({
      success: true,
      data: { taxForm }
    });
  } catch (error) {
    console.error('Get tax form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax form'
    });
  }
};

// Update tax form
const updateTaxForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const taxForm = await TaxForm.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!taxForm) {
      return res.status(404).json({
        success: false,
        message: 'Tax form not found'
      });
    }

    if (taxForm.status === 'filed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update filed tax form'
      });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        taxForm[key] = updateData[key];
      }
    });

    // Recalculate tax
    const taxCalculation = calculateTax(taxForm.taxCalculation.taxableIncome);
    taxForm.taxCalculation = { ...taxForm.taxCalculation, ...taxCalculation };

    await taxForm.save();

    res.json({
      success: true,
      message: 'Tax form updated successfully',
      data: { taxForm }
    });
  } catch (error) {
    console.error('Update tax form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tax form'
    });
  }
};

// Submit tax form for review
const submitForReview = async (req, res) => {
  try {
    const { id } = req.params;

    const taxForm = await TaxForm.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!taxForm) {
      return res.status(404).json({
        success: false,
        message: 'Tax form not found'
      });
    }

    if (taxForm.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft forms can be submitted for review'
      });
    }

    // Check if required documents are uploaded
    const requiredDocs = ['form16', 'panCard'];
    const uploadedDocs = taxForm.documents.map(doc => doc.type);
    const missingDocs = requiredDocs.filter(doc => !uploadedDocs.includes(doc));

    if (missingDocs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required documents: ${missingDocs.join(', ')}`
      });
    }

    taxForm.status = 'in-review';
    await taxForm.save();

    // Create notification for accountants
    const accountants = await User.find({ role: 'accountant' });
    for (const accountant of accountants) {
      await Notification.create({
        userId: accountant._id,
        type: 'form_reviewed',
        title: 'New Tax Form for Review',
        message: `Tax form for ${req.user.firstName} ${req.user.lastName} is ready for review.`,
        priority: 'high',
        metadata: {
          taxFormId: taxForm._id,
          actionUrl: `/accountant/reviews/${taxForm._id}`,
          actionText: 'Review Form'
        }
      });
    }

    res.json({
      success: true,
      message: 'Tax form submitted for review successfully'
    });
  } catch (error) {
    console.error('Submit for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit tax form for review'
    });
  }
};

// Get tax calculation summary
const getTaxSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const taxForm = await TaxForm.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!taxForm) {
      return res.status(404).json({
        success: false,
        message: 'Tax form not found'
      });
    }

    const summary = {
      grossIncome: taxForm.taxCalculation.grossTotalIncome,
      deductions: taxForm.taxCalculation.totalDeductions,
      exemptions: taxForm.taxCalculation.totalExemptions,
      taxableIncome: taxForm.taxCalculation.taxableIncome,
      incomeTax: taxForm.taxCalculation.incomeTax,
      surcharge: taxForm.taxCalculation.surcharge,
      cess: taxForm.taxCalculation.cess,
      totalTax: taxForm.taxCalculation.totalTax,
      tds: taxForm.taxCalculation.tds,
      advanceTax: taxForm.taxCalculation.advanceTax,
      selfAssessmentTax: taxForm.taxCalculation.selfAssessmentTax,
      refund: taxForm.taxCalculation.refund
    };

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    console.error('Get tax summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax summary'
    });
  }
};

// Get tax forms for admin/accountant review
const getFormsForReview = async (req, res) => {
  try {
    const { status = 'in-review', page = 1, limit = 10 } = req.query;

    const query = { status };
    if (req.user.role === 'accountant') {
      // Accountants can see forms assigned to them or unassigned
      query.$or = [
        { assignedAccountant: req.user._id },
        { assignedAccountant: { $exists: false } }
      ];
    }

    const taxForms = await TaxForm.find(query)
      .populate('userId', 'firstName lastName email panNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TaxForm.countDocuments(query);

    res.json({
      success: true,
      data: {
        taxForms,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get forms for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forms for review'
    });
  }
};

// Review tax form (for accountants/admins)
const reviewTaxForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const taxForm = await TaxForm.findById(id);

    if (!taxForm) {
      return res.status(404).json({
        success: false,
        message: 'Tax form not found'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review status'
      });
    }

    taxForm.status = status;
    taxForm.reviewNotes.push({
      reviewerId: req.user._id,
      note: notes
    });

    await taxForm.save();

    // Create notification for user
    await Notification.create({
      userId: taxForm.userId,
      type: 'form_reviewed',
      title: `Tax Form ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your tax form for AY ${taxForm.assessmentYear} has been ${status}. ${notes ? `Notes: ${notes}` : ''}`,
      priority: status === 'approved' ? 'medium' : 'high'
    });

    res.json({
      success: true,
      message: `Tax form ${status} successfully`
    });
  } catch (error) {
    console.error('Review tax form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review tax form'
    });
  }
};

module.exports = {
  createTaxForm,
  getTaxForms,
  getTaxForm,
  updateTaxForm,
  submitForReview,
  getTaxSummary,
  getFormsForReview,
  reviewTaxForm
};
