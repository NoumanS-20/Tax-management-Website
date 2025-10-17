import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Calculator, User, Mail, Phone, CreditCard, Sparkles, Shield, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

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
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, user, isLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (formData.password.length >= 10) strength++;
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

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

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-2xl w-full space-y-6 relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-pulse-slow">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white animate-slide-up">Join FinStack India</h2>
            <p className="mt-3 text-teal-200 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Start your hassle-free ITR filing journey today
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
        </div>

        {/* Benefits Banner */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            <Shield className="w-6 h-6 text-emerald-300 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Bank-Level Security</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            <Check className="w-6 h-6 text-teal-300 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Easy Setup</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            <Sparkles className="w-6 h-6 text-cyan-300 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">100% Free</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/95 backdrop-blur-xl py-8 px-8 shadow-2xl rounded-3xl border border-white/20 transform hover:shadow-teal-500/20 transition-all duration-500">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="panNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  PAN Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="panNumber"
                    name="panNumber"
                    type="text"
                    value={formData.panNumber}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80 uppercase"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-5 py-3.5 pr-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-teal-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {getPasswordStrengthText() && (
                    <p className={`text-xs font-medium ${
                      passwordStrength <= 1 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      Password strength: {getPasswordStrengthText()}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-5 py-3.5 pr-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all duration-300 group-hover:border-teal-300 bg-white/80"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-teal-600 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all"
                />
              </div>
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-teal-600 hover:text-teal-500 font-medium underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-teal-600 hover:text-teal-500 font-medium underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
              loading={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create My Account
                <Sparkles className="w-4 h-4" />
              </span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-white/90 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-block">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-300 hover:text-cyan-200 underline transition-colors">
              Sign in here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;