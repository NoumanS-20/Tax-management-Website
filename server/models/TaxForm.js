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

  // Calculate income tax based on slabs
  const taxableIncome = this.taxCalculation.taxableIncome;
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

  // Update tax calculation fields
  this.taxCalculation.incomeTax = Math.round(tax);
  this.taxCalculation.surcharge = Math.round(surcharge);
  this.taxCalculation.cess = Math.round(cess);
  this.taxCalculation.totalTax = Math.round(tax + surcharge + cess);

  // Calculate refund/tax payable
  const totalTaxPaid = this.taxCalculation.tds + this.taxCalculation.advanceTax + this.taxCalculation.selfAssessmentTax;
  this.taxCalculation.refund = totalTaxPaid - this.taxCalculation.totalTax;

  this.updatedAt = new Date();
  next();
});

// Index for better query performance
taxFormSchema.index({ userId: 1, assessmentYear: 1 });
taxFormSchema.index({ status: 1 });
taxFormSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TaxForm', taxFormSchema);
