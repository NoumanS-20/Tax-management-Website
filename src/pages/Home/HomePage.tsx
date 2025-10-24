import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Shield, Clock, TrendingUp, CheckCircle, 
  Users, Target, Eye, Mail, Phone, MapPin, Menu, X,
  Calculator, Upload, Bell, ChevronRight, Award, Zap
} from 'lucide-react';
import Button from '../../components/UI/Button';
import Logo from '../../components/UI/Logo';
import TaxClipboard3D from '../../components/UI/TaxClipboard3D';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'features', 'mission', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateContactForm = () => {
    if (!contactForm.name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    
    if (!contactForm.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!contactForm.subject.trim()) {
      toast.error('Please enter a subject');
      return false;
    }
    
    if (!contactForm.message.trim()) {
      toast.error('Please enter your message');
      return false;
    }
    
    if (contactForm.message.trim().length < 10) {
      toast.error('Message should be at least 10 characters long');
      return false;
    }
    
    return true;
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateContactForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the actual API endpoint
      const response = await apiService.createContact(contactForm);
      
      // Success
      toast.success(response.message || 'Message sent successfully! We\'ll get back to you soon.', {
        duration: 5000,
        icon: '✅'
      });
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Calculator,
      title: 'Smart Tax Calculator',
      description: 'Calculate your taxes accurately with our advanced tax computation engine that considers all deductions and exemptions.'
    },
    {
      icon: FileText,
      title: 'ITR Form Management',
      description: 'Create, edit, and manage multiple ITR forms (ITR-1 to ITR-4) with ease. Track your filing status in real-time.'
    },
    {
      icon: Upload,
      title: 'Document Upload',
      description: 'Securely upload and store all your tax-related documents including Form 16, investment proofs, and receipts.'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Bank-grade security with end-to-end encryption. Fully compliant with Indian tax laws and DPDP Act 2023.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Never miss a deadline with timely reminders for tax filing, document uploads, and payment due dates.'
    },
    {
      icon: TrendingUp,
      title: 'Tax Optimization',
      description: 'Get personalized suggestions to maximize your deductions and minimize your tax liability legally.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Users' },
    { number: '₹50Cr+', label: 'Taxes Filed' },
    { number: '99.9%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
              <Logo size="md" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'features' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('mission')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'mission' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Mission & Vision
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition-colors ${
                  activeSection === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Contact
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('mission')}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Mission & Vision
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Contact
              </button>
              <div className="pt-3 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button className="w-full" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="w-4 h-4" />
                <span>Trusted by 10,000+ Users</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                File Your Taxes
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Swift & Simple
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                India's most trusted online tax filing platform. Complete your ITR filing in minutes with 
                our smart calculator, expert guidance, and secure document management.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="text-lg px-8 py-4"
                >
                  Start Filing Now
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => scrollToSection('features')}
                  className="text-lg px-8 py-4"
                >
                  Explore Features
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - 3D Illustration */}
            <div className="relative h-[500px] lg:h-[600px]">
              <TaxClipboard3D />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About SwiftTax</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simplifying tax compliance for every Indian taxpayer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                SwiftTax is India's leading online tax filing platform, designed to make income tax 
                return (ITR) filing simple, fast, and stress-free. We understand that tax filing can 
                be overwhelming, which is why we've built a platform that guides you through every step.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded in 2023, we've helped thousands of individuals and businesses file their taxes 
                accurately and on time. Our platform combines cutting-edge technology with expert tax 
                knowledge to ensure you get maximum refunds while staying 100% compliant with Indian tax laws.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're a salaried employee, freelancer, business owner, or investor, SwiftTax 
                has the right tools and expertise to handle your tax filing needs efficiently.
              </p>
              
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">100% Secure</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Govt. Approved</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
                <p className="text-gray-700">Happy Customers</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                <Award className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">99.9%</h3>
                <p className="text-gray-700">Success Rate</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                <Clock className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">15 Min</h3>
                <p className="text-gray-700">Average Filing Time</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl">
                <Zap className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Instant</h3>
                <p className="text-gray-700">Form Generation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to file your taxes with confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Features Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h3>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of satisfied users who have simplified their tax filing with SwiftTax
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-blue-900 text-black hover:bg-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 ml-4">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To empower every Indian taxpayer with simple, accessible, and affordable tax filing 
                solutions. We believe that filing taxes should not be complicated, time-consuming, 
                or stressful.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to democratize tax compliance by making professional-grade tax tools 
                available to everyone, regardless of their financial knowledge or background. We're 
                committed to helping you maximize your savings while staying 100% compliant with 
                Indian tax regulations.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-10 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 ml-4">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To become India's most trusted and user-friendly tax filing platform, serving millions 
                of taxpayers across the nation. We envision a future where every Indian can confidently 
                manage their tax obligations without any hassle.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're building a comprehensive financial ecosystem that goes beyond tax filing - 
                providing tax planning, investment advice, and financial literacy to help every Indian 
                achieve their financial goals.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Integrity', description: 'Honest and transparent in everything we do' },
                { title: 'Innovation', description: 'Constantly improving our platform and services' },
                { title: 'Customer First', description: 'Your success is our top priority' },
                { title: 'Security', description: 'Bank-grade protection for your data' }
              ].map((value, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help you every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                      <p className="text-gray-600">support@swifttax.in</p>
                      <p className="text-gray-600">info@swifttax.in</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                      <p className="text-gray-600">+91 1800-123-4567 (Toll Free)</p>
                      <p className="text-gray-600">+91 98765-43210</p>
                      <p className="text-sm text-gray-500 mt-1">Mon-Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Visit Us</h4>
                      <p className="text-gray-600">
                        SwiftTax Solutions Pvt. Ltd.<br />
                        123, Business Park, Sector 18<br />
                        Gurugram, Haryana - 122015<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
                <p className="mt-6 text-blue-100 text-sm">
                  * During tax season (Jan-July), we're available 7 days a week!
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              <form className="space-y-6" onSubmit={handleContactFormSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can we help you?"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us more about your query..."
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <Button 
                  type="submit"
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <Logo size="md" />
              </div>
              <p className="text-gray-400 text-sm">
                India's most trusted online tax filing platform. Simple, secure, and swift.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white">About Us</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white">Features</button></li>
                <li><button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white">Terms of Service</button></li>
                <li><button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>ITR Filing</li>
                <li>Tax Calculator</li>
                <li>Document Management</li>
                <li>Tax Planning</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Income Tax Act 1961</li>
                <li>DPDP Act 2023 Compliant</li>
                <li>ISO 27001 Certified</li>
                <li>PCI DSS Compliant</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 SwiftTax Solutions Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
