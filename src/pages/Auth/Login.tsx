import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { TaxClipboard3DScene } from '../../components/UI/TaxClipboard3D';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, isLoading } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} login coming soon!`, { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 animate-gradient-shift">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-pink-300/50 hover:shadow-3xl">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Form */}
          <div className="p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-pink-400">Logo Here</h1>
            </div>

            {/* Welcome Text */}
            <div className="mb-8 animate-fade-in-up">
              <p className="text-sm text-gray-600 mb-2 animate-pulse-slow">Welcome back !!!</p>
              <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Log In</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="login@gmail.com"
                  className="w-full px-4 py-3 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-300 hover:shadow-md"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    Forgot Password ?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-300 pr-12 hover:shadow-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <p className="text-center text-sm text-gray-400 mb-4">or continue with</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center w-14 h-14 bg-white border-2 border-gray-200 rounded-full hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                >
                  <FcGoogle size={24} />
                </button>
                <button
                  onClick={() => handleSocialLogin('GitHub')}
                  className="flex items-center justify-center w-14 h-14 bg-white border-2 border-gray-200 rounded-full hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                >
                  <FaGithub size={24} className="text-gray-800" />
                </button>
                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center w-14 h-14 bg-white border-2 border-gray-200 rounded-full hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                >
                  <FaFacebook size={24} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-pink-400 hover:text-pink-500 font-semibold transition-colors">
                  Sign up for free
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

export default Login;