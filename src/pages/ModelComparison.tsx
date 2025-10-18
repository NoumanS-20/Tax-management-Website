import React from 'react';
import { TaxClipboard3DScene } from '../components/UI/TaxClipboard3D';
import { LoginIllustration3D, RegisterIllustration3D } from '../components/UI/TaxIllustration3D';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

const ModelComparison: React.FC = () => {
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
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-5xl font-bold text-white">
              3D Model Comparison
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Before & After: See the evolution of our 3D illustrations
          </p>
        </div>

        {/* NEW MODEL - Featured */}
        <div className="mb-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-green-400/50 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
              <CheckCircle2 size={20} />
              NEW MODEL
            </div>
            <h2 className="text-3xl font-bold text-white">Tax Clipboard Scene</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="h-[500px] bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-xl">
              <TaxClipboard3DScene />
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-400 mb-3">✨ What's New</h3>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                    <span><strong>Detailed Clipboard:</strong> Complete with clip, TAX header, and 3 checkmark items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                    <span><strong>Money Stack:</strong> 4 layered green dollar bills with $ symbols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                    <span><strong>Coin Stacks:</strong> 3 separate stacks with 6 metallic gold coins each</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                    <span><strong>Enhanced Materials:</strong> Realistic metallic finishes and emissive glows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                    <span><strong>Professional Shadows:</strong> 2048x2048 shadow maps for realism</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">🎨 Design Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Clipboard Color</p>
                    <p className="text-white font-semibold">#5b9bd5 (Blue)</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Coin Material</p>
                    <p className="text-white font-semibold">Gold Metallic (85%)</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Bills Color</p>
                    <p className="text-white font-semibold">#7cb342 (Green)</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Shadow Quality</p>
                    <p className="text-white font-semibold">2048x2048</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur rounded-xl p-4 border border-pink-400/30">
                <p className="text-white text-sm">
                  <strong>💡 Pro Tip:</strong> This model is based on your provided image and includes all the key elements: clipboard, checkmarks, money, and coins!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIOUS MODELS */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-gray-500">Previous Models</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Login Lock */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Login Lock</h3>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs">Previous</span>
            </div>
            <div className="h-80 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl overflow-hidden mb-4">
              <LoginIllustration3D />
            </div>
            <p className="text-gray-300 text-sm">
              Security-focused design with lock, key, and coins
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Registration Card</h3>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs">Previous</span>
            </div>
            <div className="h-80 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl overflow-hidden mb-4">
              <RegisterIllustration3D />
            </div>
            <p className="text-gray-300 text-sm">
              User profile card with checkmark and documents
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-3 px-4 text-gray-300">Feature</th>
                  <th className="py-3 px-4 text-green-400">New Model</th>
                  <th className="py-3 px-4 text-gray-400">Previous Models</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Based on User Image</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ Yes</td>
                  <td className="py-3 px-4 text-gray-500">✗ No</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Clipboard with TAX</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ Yes</td>
                  <td className="py-3 px-4 text-gray-500">✗ No</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Money Bills</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ 4 Stacked Bills</td>
                  <td className="py-3 px-4 text-gray-500">✗ No</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Coin Stacks</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ 3 Stacks (18 coins)</td>
                  <td className="py-3 px-4 text-yellow-500">~ 2-3 single coins</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Shadow Quality</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">2048x2048</td>
                  <td className="py-3 px-4 text-yellow-500">1024x1024</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Metallic Materials</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ 85% Metalness</td>
                  <td className="py-3 px-4 text-yellow-500">~ 70% Metalness</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4">Checkmarks</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ 3 on Clipboard</td>
                  <td className="py-3 px-4 text-yellow-500">~ 1 on Card</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Tax Theme</td>
                  <td className="py-3 px-4 text-green-400 font-semibold">✓ Explicit TAX Header</td>
                  <td className="py-3 px-4 text-yellow-500">~ Generic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            All models built with React Three Fiber + Three.js
          </p>
          <p className="text-gray-500 text-xs mt-2">
            The new Tax Clipboard model is now featured on Login and Register pages
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
