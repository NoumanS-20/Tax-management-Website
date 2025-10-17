import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Calculator, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, user, isLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-md w-full space-y-8 relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-pulse-slow">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-xl text-purple-200 font-medium animate-fade-in">{getGreeting()}</p>
            <h2 className="text-4xl font-bold text-white animate-slide-up">Welcome Back!</h2>
            <p className="mt-3 text-purple-200 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Sign in to continue your tax journey
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
        </div>

        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-3 px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            <Shield className="w-6 h-6 text-blue-300 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Secure</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            <TrendingUp className="w-6 h-6 text-green-300 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Fast</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            <Sparkles className="w-6 h-6 text-yellow-300 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Easy</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-3xl border border-white/20 transform hover:shadow-purple-500/20 transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                placeholder="Enter your email"
              />
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all duration-300 group-hover:border-purple-300 bg-white/80"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center group cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 group-hover:text-purple-600 transition-colors cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500 hover:underline transition-all">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
              loading={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Sign in to Dashboard
                <Sparkles className="w-4 h-4" />
              </span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-white/90 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 inline-block">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-yellow-300 hover:text-yellow-200 underline transition-colors">
              Create account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;