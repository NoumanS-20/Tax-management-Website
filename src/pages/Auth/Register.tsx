import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, CreditCard, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import PersonAtDesk3D from '../../components/UI/PersonAtDesk3D';
import Logo from '../../components/UI/Logo';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    panNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Please enter a valid Indian mobile number');
      return false;
    }
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      toast.error('Please enter a valid PAN number (e.g., ABCDE1234F)');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        panNumber: formData.panNumber.trim().toUpperCase() || undefined,
        password: formData.password
      });
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-100 flex items-center justify-center p-4">
      {/* Home Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 bg-white hover:bg-gray-100 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:shadow-xl"
        aria-label="Go to home"
      >
        <Home className="w-6 h-6" />
      </button>

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Form */}
          <div className="p-8 max-h-screen overflow-y-auto">
            <div className="text-center mb-6">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <Logo size="lg" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Join SwiftTax</h2>
              <p className="mt-2 text-gray-600">Create your account to start filing ITR</p>
            </div>

            <div className="bg-white">
              <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="panNumber"
                  name="panNumber"
                  type="text"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 uppercase"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500 underline" target="_blank">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-gray-700 underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-gray-700 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-100 p-12 relative overflow-hidden">
        {/* Title Text */}
        <div className="relative z-20 mb-6">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent text-center tracking-wider animate-pulse-slow">
            JOIN US TODAY!!!
          </h2>
        </div>

        {/* 3D Person at Desk Scene */}
        <div className="relative z-10 w-full h-full flex-1">
          <PersonAtDesk3D />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-sky-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-300/25 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Register;