import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { TaxClipboard3DScene } from '../../components/UI/TaxClipboard3D';

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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, user, isLoading } = useAuth();

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

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} registration coming soon!`, { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 animate-gradient-shift">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-purple-300/50 hover:shadow-3xl">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Form */}
          <div className="p-12 flex flex-col justify-center max-h-screen overflow-y-auto">
            {/* Logo */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-pink-400">Logo Here</h1>
            </div>

            {/* Welcome Text */}
            <div className="mb-6 animate-fade-in-up">
              <p className="text-sm text-gray-600 mb-2 animate-pulse-slow">Join us today !!!</p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Sign Up</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-300 hover:shadow-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-300 hover:shadow-md"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="signup@gmail.com"
                  className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  required
                />
              </div>

              {/* Phone & PAN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit"
                    className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN (Optional)
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all uppercase"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {getPasswordStrengthText() && (
                      <p className={`text-xs mt-1 ${
                        passwordStrength <= 1 ? 'text-red-600' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs mt-1 ${
                    formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
                />
                <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-pink-400 hover:text-pink-500 underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-pink-400 hover:text-pink-500 underline">Privacy Policy</a>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold py-2.5 px-6 rounded-full hover:from-pink-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </form>

            {/* Social Sign Up */}
            <div className="mt-6">
              <p className="text-center text-sm text-gray-400 mb-3">or sign up with</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                >
                  <FcGoogle size={22} />
                </button>
                <button
                  onClick={() => handleSocialLogin('GitHub')}
                  className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                >
                  <FaGithub size={22} className="text-gray-800" />
                </button>
                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                >
                  <FaFacebook size={22} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-pink-400 hover:text-pink-500 font-semibold transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-12 relative overflow-hidden">
            {/* 3D Tax Clipboard Scene */}
            <div className="relative z-10 w-full h-full">
              <TaxClipboard3DScene />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;