import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, FileText, Shield, AlertCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
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
              Welcome to <strong>SwiftTax</strong> ("Company", "we", "our", or "us"). These Terms of Service ("Terms") govern your access to and use of our online platform and all related tools, software, and applications (collectively, the "Services").
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using or accessing our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our Services.
            </p>
          </section>

          {/* 1. Eligibility */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">1. Eligibility</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old and legally capable of entering into binding contracts under Indian law to use our Services. By using SwiftTax, you represent and warrant that you meet these eligibility requirements.
            </p>
          </section>

          {/* 2. Description of Services */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">2. Description of Services</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              SwiftTax provides an online platform designed to help users with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Filing income tax returns electronically in compliance with Indian tax regulations;</li>
              <li>Calculating estimated tax liabilities and refunds;</li>
              <li>Accessing tax-related tools and financial resources; and</li>
              <li>Receiving automated support for tax filing and compliance.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We may update, modify, or remove certain features or functionalities at any time without prior notice.
            </p>
          </section>

          {/* 3. User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              By using SwiftTax, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information during registration and tax filing;</li>
              <li>Maintain the confidentiality of your account credentials;</li>
              <li>Use the Services only for lawful, personal, and non-commercial purposes; and</li>
              <li>Comply with all applicable Indian laws and regulations, including the Income Tax Act, 1961.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3 font-medium">
              You are solely responsible for the accuracy of information submitted and any consequences arising from errors or omissions.
            </p>
          </section>

          {/* 4. Accuracy of Information */}
          <section>
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-gray-900">4. Accuracy of Information</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                While SwiftTax strives to maintain accuracy in its tools and calculations, we do not guarantee that all computations or recommendations are error-free.
              </p>
              <p>
                You are responsible for verifying your details and reviewing your tax return before submission to the Income Tax Department (ITD).
              </p>
              <p className="font-medium">
                SwiftTax shall not be liable for any losses, penalties, or damages resulting from inaccurate, incomplete, or misleading information provided by you.
              </p>
            </div>
          </section>

          {/* 5. Use of Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Use of Third-Party Services</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                SwiftTax integrates with government and third-party systems (such as the Income Tax e-filing portal and payment gateways) to facilitate electronic filing and related services.
              </p>
              <p>
                We do not control these third-party systems and are not responsible for any downtime, inaccuracies, or errors caused by them.
              </p>
            </div>
          </section>

          {/* 6. Payment and Refund Policy */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Payment and Refund Policy</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All payments made for SwiftTax's paid services are final and <strong>non-refundable</strong>.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We do not provide refunds under any circumstances, including but not limited to filing errors, changes in user information, or dissatisfaction with the service.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prices are quoted in Indian Rupees (INR) and may change without prior notice.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>All transactions are processed securely through trusted, PCI-compliant payment gateways.</span>
              </li>
            </ul>
          </section>

          {/* 7. Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Intellectual Property Rights</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                All content on SwiftTax—including but not limited to software, text, design, graphics, and logos—is owned by or licensed to SwiftTax and protected under applicable copyright and trademark laws of India.
              </p>
              <p>
                You may not reproduce, distribute, or modify any material without prior written authorization from SwiftTax.
              </p>
            </div>
          </section>

          {/* 8. Privacy and Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Privacy and Data Protection</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                SwiftTax values your privacy. Our Privacy Policy explains how we collect, store, and use your data, including your personal and financial information, in compliance with Indian data protection laws.
              </p>
              <p>
                By using our Services, you consent to such data handling.
              </p>
            </div>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To the maximum extent permitted by law:
            </p>
            <ul className="space-y-3 text-gray-700 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>SwiftTax shall not be liable for any direct, indirect, incidental, or consequential losses, including but not limited to data loss, missed deadlines, or penalties imposed by tax authorities.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Our total liability, in any case, shall not exceed the amount paid (if any) for the specific service giving rise to the claim.</span>
              </li>
            </ul>
          </section>

          {/* 10. Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Disclaimer of Warranties</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                SwiftTax provides its Services on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the reliability, accuracy, or completeness of the Services.
              </p>
              <p>
                We do not guarantee uninterrupted access or that our system will always be free from errors, viruses, or security breaches.
              </p>
            </div>
          </section>

          {/* 11. Suspension or Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Suspension or Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may suspend or terminate your access to the Services without prior notice if:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You violate these Terms;</li>
              <li>You engage in fraudulent or unlawful activities; or</li>
              <li>Required by law or regulatory authorities.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Upon termination, your right to use the Services will cease immediately.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree to indemnify, defend, and hold harmless SwiftTax, its affiliates, officers, and employees from any claims, losses, damages, or expenses (including legal fees) arising out of:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Your misuse of the Services;</li>
              <li>Any inaccurate or false information submitted by you; or</li>
              <li>Violation of these Terms or any applicable Indian law.</li>
            </ul>
          </section>

          {/* 13. Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              SwiftTax reserves the right to modify or update these Terms at any time. The most recent version will always be available through our platform. Your continued use of the Services after such updates constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 14. Governing Law and Jurisdiction */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Governing Law and Jurisdiction</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                These Terms are governed by and construed in accordance with the <strong>laws of India</strong>.
              </p>
              <p>
                Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in <strong>Chennai, Tamil Nadu</strong>.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="border-t pt-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Questions or Concerns?</h3>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us through our support channels or email us at <a href="mailto:legal@swifttax.in" className="text-blue-600 hover:underline">legal@swifttax.in</a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>© 2025 SwiftTax. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
