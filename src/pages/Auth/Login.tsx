import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';
import TaxClipboard3D from '../../components/UI/TaxClipboard3D';
import Logo from '../../components/UI/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 flex items-center justify-center p-4">
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
          <div className="p-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <Logo size="lg" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 bg-blue-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-pink-300 focus:bg-white outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 pr-12 bg-blue-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-pink-300 focus:bg-white outline-none transition-all duration-200"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600"
              size="lg"
              loading={isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-pink-400 hover:text-pink-500">
                Create account
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

        {/* Right Side - 3D Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-cyan-200 via-purple-200 to-pink-200 p-12 relative overflow-hidden">
          <div className="relative z-10 w-full h-full">
            <TaxClipboard3D />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-300/25 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-300/20 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;