const mongoose = require('mongoose');

const taxFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  status: {
    type: String,
    enum: ['draft', 'in-review', 'approved', 'filed', 'rejected'],
    default: 'draft'
  },
  formType: {
    type: String,
    enum: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'],
    required: true
  },
  personalInfo: {
    panNumber: {
      type: String,
      required: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format']
    },
    aadharNumber: {
      type: String,
      match: [/^\d{4}-\d{4}-\d{4}$/, 'Invalid Aadhaar number format']
    },
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String
    }
  },
  income: {
    salary: {
      type: Number,
      default: 0,
      min: 0
    },
    businessIncome: {
      type: Number,
      default: 0,
      min: 0
    },
    capitalGains: {
      type: Number,
      default: 0,
      min: 0
    },
    houseProperty: {
      type: Number,
      default: 0,
      min: 0
    },
    otherIncome: {
      type: Number,
      default: 0,
      min: 0
    },
    totalIncome: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  deductions: {
    section80C: {
      type: Number,
      default: 0,
      min: 0,
      max: 150000
    },
    section80D: {
      type: Number,
      default: 0,
      min: 0,
      max: 25000
    },
    section80G: {
      type: Number,
      default: 0,
      min: 0
    },
    section24: {
      type: Number,
      default: 0,
      min: 0,
      max: 200000
    },
    section80E: {
      type: Number,
      default: 0,
      min: 0
    },
    section80TTA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10000
    },
    otherDeductions: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDeductions: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  exemptions: {
    hra: {
      type: Number,
      default: 0,
      min: 0
    },
    lta: {
      type: Number,
      default: 0,
      min: 0
    },
    medicalAllowance: {
      type: Number,
      default: 0,
      min: 0
    },
    otherExemptions: {
      type: Number,
      default: 0,
      min: 0
    },
    totalExemptions: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  taxCalculation: {
    grossTotalIncome: {
      type: Number,
      default: 0
    },
    totalDeductions: {
      type: Number,
      default: 0
    },
    totalExemptions: {
      type: Number,
      default: 0
    },
    taxableIncome: {
      type: Number,
      default: 0
    },
    incomeTax: {
      type: Number,
      default: 0
    },
    surcharge: {
      type: Number,
      default: 0
    },
    cess: {
      type: Number,
      default: 0
    },
    totalTax: {
      type: Number,
      default: 0
    },
    tds: {
      type: Number,
      default: 0
    },
    advanceTax: {
      type: Number,
      default: 0
    },
    selfAssessmentTax: {
      type: Number,
      default: 0
    },
    refund: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['form16', 'form16a', 'salarySlip', 'bankStatement', 'investmentProof', 'rentReceipt', 'other']
    },
    url: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    remarks: String
  }],
  reviewNotes: [{
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  filedAt: Date,
  acknowledgmentNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals before saving
taxFormSchema.pre('save', function(next) {
  // Calculate total income
  this.income.totalIncome = 
    this.income.salary + 
    this.income.businessIncome + 
    this.income.capitalGains + 
    this.income.houseProperty + 
    this.income.otherIncome;

  // Calculate total deductions
  this.deductions.totalDeductions = 
    this.deductions.section80C + 
    this.deductions.section80D + 
    this.deductions.section80G + 
    this.deductions.section24 + 
    this.deductions.section80E + 
    this.deductions.section80TTA + 
    this.deductions.otherDeductions;

  // Calculate total exemptions
  this.exemptions.totalExemptions = 
    this.exemptions.hra + 
    this.exemptions.lta + 
    this.exemptions.medicalAllowance + 
    this.exemptions.otherExemptions;

  // Calculate taxable income
  this.taxCalculation.grossTotalIncome = this.income.totalIncome;
  this.taxCalculation.totalDeductions = this.deductions.totalDeductions;
  this.taxCalculation.totalExemptions = this.exemptions.totalExemptions;
  this.taxCalculation.taxableIncome = 
    this.taxCalculation.grossTotalIncome - 
    this.taxCalculation.totalDeductions - 
    this.taxCalculation.totalExemptions;

  this.updatedAt = new Date();
  next();
});

// Index for better query performance
taxFormSchema.index({ userId: 1, assessmentYear: 1 });
taxFormSchema.index({ status: 1 });
taxFormSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TaxForm', taxFormSchema);
