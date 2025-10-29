import React, { useState } from 'react';
import { 
  CheckCircle, FileText, Upload, Download, Send, 
  UserPlus, Eye, AlertCircle, ChevronRight,
  Home, Building, Calculator, Shield, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const ITRGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      title: 'Register & Create Account',
      icon: UserPlus,
      color: 'blue',
      description: 'Start your ITR filing journey by creating your SwiftTax account',
      details: [
        'Visit the SwiftTax registration page',
        'Provide your basic details: Name, Email, Phone',
        'Enter your PAN number (mandatory for ITR filing)',
        'Create a secure password',
        'Verify your email address',
        'Complete your profile with additional details'
      ],
      tips: [
        'Keep your PAN card handy',
        'Use a valid email - all notifications will be sent here',
        'Choose a strong password with mix of letters, numbers & symbols'
      ],
      action: () => navigate('/register')
    },
    {
      number: 2,
      title: 'Create Your ITR Form',
      icon: FileText,
      color: 'green',
      description: 'Select the appropriate ITR form type and start filling your details',
      details: [
        'Go to "ITR Forms" section in dashboard',
        'Click "Create New ITR Form" button',
        'Select the correct ITR form type (ITR-1, ITR-2, ITR-3, or ITR-4)',
        'Choose Assessment Year (e.g., 2024-25)',
        'Provide Financial Year (e.g., 2023-24)',
        'Save as draft to continue later'
      ],
      formTypes: {
        'ITR-1 (Sahaj)': 'For individuals with salary, one house property, and other sources',
        'ITR-2': 'For individuals/HUFs not having business income',
        'ITR-3': 'For individuals/HUFs having business/profession income',
        'ITR-4 (Sugam)': 'For presumptive income from business & profession'
      },
      tips: [
        'Choose the correct ITR form based on your income sources',
        'You can save as draft and edit multiple times',
        'Keep all income documents ready before starting'
      ],
      action: () => navigate('/dashboard/itr-forms')
    },
    {
      number: 3,
      title: 'Fill Income Details',
      icon: Building,
      color: 'purple',
      description: 'Enter all your income sources accurately',
      details: [
        'Open your draft ITR form',
        'Fill Salary Income (from Form 16)',
        'Add House Property Income (rent received)',
        'Enter Business/Professional Income (if applicable)',
        'Add Capital Gains (from share trading, property sale)',
        'Include Income from Other Sources (interest, dividends)',
        'System will auto-calculate Gross Total Income'
      ],
      requiredDocuments: [
        'Form 16 (from employer)',
        'Form 16A (TDS certificates for other income)',
        'Salary slips',
        'Bank statements',
        'Capital gains statements',
        'Interest certificates'
      ],
      tips: [
        'Enter amounts in Indian Rupees (₹)',
        'Cross-verify with your Form 16',
        'Include all income sources - even small amounts',
        'Don\'t forget interest income from savings accounts'
      ]
    },
    {
      number: 4,
      title: 'Claim Deductions',
      icon: Calculator,
      color: 'orange',
      description: 'Maximize your tax savings by claiming eligible deductions',
      details: [
        'Section 80C: PPF, EPF, ELSS, LIC, Home Loan Principal (max ₹1.5 lakh)',
        'Section 80D: Health insurance premiums (self & parents)',
        'Section 80E: Education loan interest',
        'Section 80G: Donations to charitable institutions',
        'Section 24: Home loan interest (max ₹2 lakh)',
        'Other eligible deductions',
        'System calculates total deductions automatically'
      ],
      requiredDocuments: [
        'PPF/EPF statements',
        'LIC premium receipts',
        'ELSS investment proofs',
        'Health insurance premium receipts',
        'Education loan interest certificate',
        'Donation receipts with 80G certificate',
        'Home loan interest certificate'
      ],
      tips: [
        'Claim only what you have proof for',
        'Keep all receipts and certificates handy',
        'Health insurance can be claimed for self, spouse, children & parents',
        'Home loan interest has separate limits for self-occupied & rented property'
      ]
    },
    {
      number: 5,
      title: 'Upload Documents',
      icon: Upload,
      color: 'indigo',
      description: 'Upload all supporting documents for your ITR',
      details: [
        'Go to "Documents" section in dashboard',
        'Click "Upload Document" button',
        'Select document type (Form 16, salary slip, etc.)',
        'Choose file from your computer',
        'Link document to your ITR form (optional)',
        'Add notes if needed',
        'Upload multiple documents as required'
      ],
      supportedFormats: [
        'PDF documents (.pdf)',
        'Images (.jpg, .jpeg, .png)',
        'Maximum file size: 10MB per file'
      ],
      tips: [
        'Scan documents clearly',
        'Ensure all pages are included',
        'Organize documents by category',
        'Keep digital copies for future reference'
      ],
      action: () => navigate('/dashboard/documents')
    },
    {
      number: 6,
      title: 'Review Tax Calculation',
      icon: Eye,
      color: 'teal',
      description: 'Verify your tax calculations and liability',
      details: [
        'Review Gross Total Income',
        'Check all deductions claimed',
        'Verify Total Taxable Income',
        'Review Tax calculated',
        'Check TDS/TCS already paid',
        'See final Tax Payable or Refund amount',
        'Use the Tax Calculator for what-if scenarios'
      ],
      calculations: [
        'Gross Total Income = Sum of all income heads',
        'Total Income = Gross Total Income - Deductions',
        'Tax on Total Income = As per applicable slab',
        'Tax Payable = Tax + Surcharge + Cess - TDS/TCS - Advance Tax'
      ],
      tips: [
        'Double-check all figures',
        'Verify TDS amounts with Form 26AS',
        'Check if refund amount matches your calculation',
        'Use old vs new tax regime calculator to choose better option'
      ],
      action: () => navigate('/dashboard/calculator')
    },
    {
      number: 7,
      title: 'Export to XML',
      icon: Download,
      color: 'pink',
      description: 'Download your ITR data in XML format for government portal',
      details: [
        'Go to your ITR form details page',
        'Click "Export to XML" button',
        'XML file will be downloaded automatically',
        'File name format: ITR_FormType_AssessmentYear_ID.xml',
        'Save the file in a secure location',
        'This file contains all your entered data'
      ],
      xmlBenefits: [
        'No need to manually enter data on government portal',
        'All calculations preserved accurately',
        'Saves time and reduces errors',
        'Can be imported directly to e-filing portal'
      ],
      tips: [
        'Keep a backup of the XML file',
        'Don\'t edit the XML file manually',
        'Download fresh XML if you make any changes',
        'File is ready to upload to Income Tax portal'
      ]
    },
    {
      number: 8,
      title: 'Upload to Income Tax Portal',
      icon: Send,
      color: 'red',
      description: 'Submit your ITR on the official Income Tax e-filing portal',
      details: [
        'Visit https://www.incometax.gov.in/iec/foportal',
        'Login with your credentials (PAN & password)',
        'Go to "e-File" > "File Income Tax Return"',
        'Select Assessment Year',
        'Choose "Import from XML" option',
        'Upload the XML file downloaded from SwiftTax',
        'Verify all pre-filled data',
        'Review the tax calculation',
        'Preview the ITR before submission'
      ],
      portalSteps: [
        'Login to e-filing portal',
        'Navigate to File ITR section',
        'Select correct Assessment Year',
        'Import XML file',
        'Verify data accuracy',
        'E-verify within 120 days'
      ],
      tips: [
        'Register on e-filing portal if not done already',
        'Keep your login credentials handy',
        'Verify all data after import',
        'Save acknowledgment number after submission',
        'Complete e-verification within 120 days'
      ]
    },
    {
      number: 9,
      title: 'E-Verify Your ITR',
      icon: Shield,
      color: 'emerald',
      description: 'Complete the verification process to finish your filing',
      details: [
        'E-verify through Aadhaar OTP (instant)',
        'Or use Net Banking',
        'Or login to bank account',
        'Or use Demat account',
        'Or send signed ITR-V by post (physical verification)',
        'Verification must be completed within 120 days',
        'Receive acknowledgment confirmation'
      ],
      verificationMethods: {
        'Aadhaar OTP': 'Instant verification using Aadhaar linked mobile',
        'Net Banking': 'Login to your bank and verify',
        'Bank Account': 'Login through bank account validation',
        'Demat Account': 'Verify through your demat account',
        'ITR-V by Post': 'Send signed ITR-V to Bangalore within 120 days'
      },
      tips: [
        'Aadhaar OTP is the fastest method',
        'Ensure Aadhaar-PAN linking is done',
        'Keep mobile number linked to Aadhaar active',
        'Without verification, ITR is not considered filed'
      ]
    },
    {
      number: 10,
      title: 'Track Status & Refund',
      icon: CheckCircle,
      color: 'cyan',
      description: 'Monitor your ITR status and refund processing',
      details: [
        'Check ITR processing status on e-filing portal',
        'View in "View Returns/Forms" section',
        'Receive confirmation email after processing',
        'Track refund status if applicable',
        'Refund typically processed within 20-45 days',
        'Refund credited directly to bank account',
        'Download ITR-V acknowledgment'
      ],
      statusTypes: {
        'ITR Filed': 'Successfully submitted',
        'Under Processing': 'Being verified by IT department',
        'Processed': 'Verification completed',
        'Refund Issued': 'Refund amount transferred',
        'Demand Raised': 'Additional tax payable'
      },
      tips: [
        'Regularly check your email for updates',
        'Track refund status on NSDL website',
        'Ensure correct bank account details',
        'Respond promptly to any notices',
        'Download and save all acknowledgments'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string; icon: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'bg-green-100 text-green-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-600' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: 'bg-teal-100 text-teal-600' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: 'bg-pink-100 text-pink-600' },
      red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'bg-red-100 text-red-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'bg-cyan-100 text-cyan-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Complete ITR Filing Guide</h1>
          <p className="text-xl text-blue-100 mb-6">
            Follow this comprehensive step-by-step guide to file your Income Tax Return effortlessly
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>10 Easy Steps</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Complete Documentation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/dashboard/itr-forms')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create ITR Form
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/dashboard/documents')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/dashboard/calculator')}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Tax Calculator
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('https://www.incometax.gov.in/iec/foportal', '_blank')}
            >
              <Send className="w-4 h-4 mr-2" />
              IT E-Filing Portal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          const colors = getColorClasses(step.color);
          const isExpanded = activeStep === step.number;

          return (
            <Card 
              key={step.number} 
              className={`transition-all hover:shadow-lg ${isExpanded ? `border-2 ${colors.border}` : ''}`}
            >
              <CardContent className="p-6">
                <div 
                  className="flex items-start space-x-4 cursor-pointer"
                  onClick={() => setActiveStep(isExpanded ? null : step.number)}
                >
                  {/* Step Number & Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-semibold ${colors.text}`}>
                            STEP {step.number}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                      </div>
                      <ChevronRight 
                        className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className={`mt-6 p-6 ${colors.bg} rounded-lg space-y-6`}>
                        {/* Main Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Step-by-Step Instructions
                          </h4>
                          <ol className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-gray-700">
                                <span className={`font-semibold ${colors.text} mt-0.5`}>{idx + 1}.</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Form Types */}
                        {step.formTypes && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">ITR Form Types</h4>
                            <div className="space-y-2">
                              {Object.entries(step.formTypes).map(([form, desc]) => (
                                <div key={form} className="bg-white rounded-lg p-3">
                                  <span className="font-semibold text-gray-900">{form}:</span>
                                  <span className="text-gray-700 ml-2">{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Required Documents */}
                        {step.requiredDocuments && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">📄 Required Documents</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {step.requiredDocuments.map((doc, idx) => (
                                <div key={idx} className="bg-white rounded p-2 text-sm text-gray-700 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                  {doc}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Supported Formats */}
                        {step.supportedFormats && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Supported File Formats</h4>
                            <div className="bg-white rounded-lg p-3">
                              <ul className="space-y-1">
                                {step.supportedFormats.map((format, idx) => (
                                  <li key={idx} className="text-gray-700 text-sm">• {format}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* XML Benefits */}
                        {step.xmlBenefits && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">✨ Benefits of XML Export</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {step.xmlBenefits.map((benefit, idx) => (
                                <div key={idx} className="bg-white rounded p-2 text-sm text-gray-700 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Portal Steps */}
                        {step.portalSteps && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">🌐 Income Tax Portal Steps</h4>
                            <div className="space-y-2">
                              {step.portalSteps.map((portalStep, idx) => (
                                <div key={idx} className="bg-white rounded p-3 flex items-center space-x-3">
                                  <span className={`w-6 h-6 rounded-full ${colors.icon} flex items-center justify-center text-sm font-bold`}>
                                    {idx + 1}
                                  </span>
                                  <span className="text-gray-700">{portalStep}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Calculations */}
                        {step.calculations && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">🧮 Tax Calculations</h4>
                            <div className="bg-white rounded-lg p-4 space-y-2">
                              {step.calculations.map((calc, idx) => (
                                <div key={idx} className="text-sm font-mono text-gray-700">
                                  {calc}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verification Methods */}
                        {step.verificationMethods && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">✅ Verification Methods</h4>
                            <div className="space-y-2">
                              {Object.entries(step.verificationMethods).map(([method, desc]) => (
                                <div key={method} className="bg-white rounded-lg p-3">
                                  <span className="font-semibold text-gray-900">{method}:</span>
                                  <span className="text-gray-700 ml-2">{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status Types */}
                        {step.statusTypes && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">📊 ITR Status Types</h4>
                            <div className="space-y-2">
                              {Object.entries(step.statusTypes).map(([status, desc]) => (
                                <div key={status} className="bg-white rounded-lg p-3">
                                  <span className="font-semibold text-gray-900">{status}:</span>
                                  <span className="text-gray-700 ml-2">{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                            Pro Tips
                          </h4>
                          <div className="space-y-2">
                            {step.tips.map((tip, idx) => (
                              <div key={idx} className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-gray-700">
                                💡 {tip}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        {step.action && (
                          <div className="pt-4">
                            <Button onClick={step.action} className="w-full">
                              Start This Step
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Help */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to assist you throughout your ITR filing journey
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              📧 Email Support
            </Button>
            <Button variant="outline">
              💬 Live Chat
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ITRGuide;
