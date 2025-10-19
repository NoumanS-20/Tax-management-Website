import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, AlertTriangle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <div className="space-y-2 text-gray-600">
            <p><strong>Effective Date:</strong> 19 October 2025</p>
            <p><strong>Last Updated:</strong> 19 October 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At <strong>SwiftTax</strong> ("we", "our", or "us"), we value your trust and are committed to protecting your privacy. This Privacy Policy describes how we collect, use, store, and safeguard your personal and financial information when you use our online tax filing and related services (collectively, the "Services").
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-medium">
              By using SwiftTax, you consent to the practices described in this Privacy Policy.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following categories of information when you use our Services:
            </p>

            {/* Personal Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">a. Personal Information</h3>
              <p className="text-gray-700 mb-3">Information that identifies you, such as:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Full name</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Date of birth</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>PAN (Permanent Account Number)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Aadhaar number (if provided voluntarily)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contact information (email address, mobile number, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Residential and communication addresses</span>
                </li>
              </ul>
            </div>

            {/* Financial Information */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">b. Financial Information</h3>
              <p className="text-gray-700 mb-3">Details necessary for tax computation and filing, including:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Income details (salary, business income, capital gains, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bank account information (for refund purposes)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tax deducted at source (TDS) data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Investment and deduction details</span>
                </li>
              </ul>
            </div>

            {/* Technical Information */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">c. Technical Information</h3>
              <p className="text-gray-700 mb-3">When you access SwiftTax, we may automatically collect:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Device information (browser type, operating system, IP address)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Usage data (pages visited, time spent, preferences)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cookies and similar tracking technologies</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the information collected for the following lawful purposes:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4 mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To prepare, file, and manage your income tax returns;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To verify your identity and prevent fraudulent activities;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To personalize your experience and improve our platform;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To comply with legal and regulatory obligations;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To send you important notifications about filings, deadlines, and service updates;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>For internal analytics, troubleshooting, and security monitoring.</span>
              </li>
            </ul>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-gray-700 font-medium">
                We will <strong>not</strong> sell, rent, or trade your information to any third party for marketing or commercial purposes.
              </p>
            </div>
          </section>

          {/* 3. Legal Basis for Processing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Legal Basis for Processing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              SwiftTax processes your personal data based on one or more of the following legal grounds under the <strong>Digital Personal Data Protection Act, 2023</strong>:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You have provided explicit consent for one or more specific purposes;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Processing is necessary to comply with legal obligations under Indian tax laws;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Processing is necessary for the performance of a service or contract you have entered into with us;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Processing is required for the legitimate interests of SwiftTax, provided such interests do not override your rights.</span>
              </li>
            </ul>
          </section>

          {/* 4. Data Sharing and Disclosure */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">4. Data Sharing and Disclosure</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may share your data with:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4 mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Government authorities</strong>, such as the Income Tax Department, for electronic filing or verification;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Payment gateways</strong>, for secure payment processing;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Cloud and IT service providers</strong>, for data storage and system maintenance (under strict confidentiality agreements);</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Regulatory bodies or law enforcement</strong>, if required by law or judicial process.</span>
              </li>
            </ul>
            <p className="text-gray-700 font-medium">
              All third parties handling your data are contractually obligated to maintain its confidentiality and security.
            </p>
          </section>

          {/* 5. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We retain your personal and financial data for as long as necessary to:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4 mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fulfill the purpose for which it was collected;</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Comply with applicable tax and legal requirements; or</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Resolve disputes and enforce agreements.</span>
              </li>
            </ul>
            <p className="text-gray-700">
              When data is no longer required, it will be securely deleted or anonymized.
            </p>
          </section>

          {/* 6. Data Security */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">6. Data Security</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                We employ industry-standard encryption, firewalls, and access controls to protect your data from unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-medium">
                  Despite these measures, no system is completely secure. By using SwiftTax, you acknowledge that you share information at your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Your Rights */}
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under the <strong>Digital Personal Data Protection Act, 2023</strong>, you have the following rights:
            </p>
            <div className="space-y-3 text-gray-700">
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900">Right to Access:</p>
                <p>Request details of personal data we hold about you.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900">Right to Correction:</p>
                <p>Request correction or updating of inaccurate or incomplete data.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900">Right to Erasure:</p>
                <p>Request deletion of your personal data, subject to legal retention obligations.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900">Right to Withdraw Consent:</p>
                <p>Withdraw your consent for data processing at any time.</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-gray-900">Right to Grievance Redressal:</p>
                <p>Lodge a complaint regarding misuse or unauthorized disclosure of your data.</p>
              </div>
            </div>
            <p className="text-gray-700 mt-4 font-medium">
              Requests to exercise these rights can be made through the mechanisms available within the SwiftTax platform.
            </p>
          </section>

          {/* 8. Cookies and Tracking Technologies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Cookies and Tracking Technologies</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                SwiftTax uses cookies and similar technologies to enhance user experience, remember preferences, and analyze traffic patterns.
              </p>
              <p>
                You may choose to disable cookies through your browser settings, but doing so may limit certain functionalities of the Services.
              </p>
            </div>
          </section>

          {/* 9. Data Storage Location */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Data Storage Location</h2>
            <p className="text-gray-700">
              Your data may be stored and processed on servers located <strong>within India</strong>, in compliance with Indian data localization and protection requirements.
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">10. Children's Privacy</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                SwiftTax does not knowingly collect data from anyone under the age of <strong>18 years</strong>.
              </p>
              <p>
                If you believe a minor has provided information, please ensure that the data is deleted immediately through the account settings.
              </p>
            </div>
          </section>

          {/* 11. Updates to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Updates to This Policy</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                SwiftTax may update this Privacy Policy periodically.
              </p>
              <p>
                The latest version will always be available through our platform, and continued use of our Services after updates constitutes your acceptance of the revised Policy.
              </p>
            </div>
          </section>

          {/* 12. Governing Law and Jurisdiction */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Governing Law and Jurisdiction</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                This Privacy Policy is governed by the <strong>laws of India</strong>.
              </p>
              <p>
                Any disputes arising out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the courts in <strong>Chennai, Tamil Nadu</strong>.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="border-t pt-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Questions or Privacy Concerns?</h3>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at <a href="mailto:privacy@swifttax.in" className="text-blue-600 hover:underline font-medium">privacy@swifttax.in</a> or through our support channels.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>© 2025 SwiftTax. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' • '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
