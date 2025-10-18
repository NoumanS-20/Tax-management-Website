import React from 'react';
import { TaxIllustration3D, LoginIllustration3D, RegisterIllustration3D } from '../components/UI/TaxIllustration3D';
import { TaxClipboard3DScene } from '../components/UI/TaxClipboard3D';
import { WorkingPerson3D } from '../components/UI/WorkingPerson3D';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ThreeDShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Login
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">
            3D Illustrations Showcase
          </h1>
          <p className="text-gray-300 text-lg">
            Interactive 3D illustrations for the Tax Management App
          </p>
        </div>

        {/* Illustrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* NEW: Tax Clipboard Scene - Main Featured */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-2">📋 Tax Clipboard Scene</h2>
            <p className="text-cyan-300 text-sm mb-4">⭐ Featured - Based on your image!</p>
            <div className="w-full h-96 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 rounded-xl overflow-hidden">
              <TaxClipboard3DScene />
            </div>
            <p className="text-gray-300 mt-4 text-sm">
              ✓ Detailed clipboard with TAX header and checkmarks<br/>
              ✓ Stack of green dollar bills with $ symbols<br/>
              ✓ Multiple gold coin stacks with realistic metallic finish<br/>
              ✓ Auto-rotating camera with enhanced lighting and shadows
            </p>
          </div>

          {/* Tax Management Illustration */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Tax Management</h2>
            <div className="w-full h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl overflow-hidden">
              <TaxIllustration3D />
            </div>
            <p className="text-gray-300 mt-4 text-sm">
              Features: Calculator, floating documents, coins with auto-rotation
            </p>
          </div>

          {/* Login Illustration */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Login Security</h2>
            <div className="w-full h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl overflow-hidden">
              <LoginIllustration3D />
            </div>
            <p className="text-gray-300 mt-4 text-sm">
              Features: 3D lock icon, floating coins, security theme
            </p>
          </div>

          {/* NEW: Working Person - Registration */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-2">👨‍💼 Working Professional</h2>
            <p className="text-teal-300 text-sm mb-4">⭐ New for Registration!</p>
            <div className="w-full h-96 bg-gradient-to-br from-teal-100 via-cyan-50 to-sky-100 rounded-xl overflow-hidden">
              <WorkingPerson3D />
            </div>
            <p className="text-gray-300 mt-4 text-sm">
              ✓ Person at desk with computer and glasses<br/>
              ✓ Working clock with moving hands<br/>
              ✓ Pen holder with colorful pens<br/>
              ✓ Coffee cup with steam effect
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Illustration Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">Interactive Elements</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Auto-rotating camera with OrbitControls</li>
                <li>✓ Floating animations for dynamic movement</li>
                <li>✓ Responsive to mouse interaction</li>
                <li>✓ Smooth transitions and rotations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-pink-400 mb-3">Design Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Modern gradient backgrounds</li>
                <li>✓ Professional 3D objects (calculator, lock, coins)</li>
                <li>✓ Optimized lighting with ambient + directional</li>
                <li>✓ Color-coordinated with app theme</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Built with React Three Fiber + Three.js + @react-three/drei</p>
          <p className="mt-2">Fully responsive and performance-optimized</p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDShowcase;
