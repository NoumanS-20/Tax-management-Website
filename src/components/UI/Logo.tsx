import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Swift (Blue) */}
      <div className="flex items-center">
        <span className={`font-bold text-blue-600 ${size === 'sm' ? 'text-2xl' : size === 'md' ? 'text-3xl' : 'text-4xl'}`}>
          Swift
        </span>
      </div>
      
      {/* Tax (Gold) with checkmark icon */}
      <div className="flex items-center gap-1">
        <span className={`font-bold text-yellow-500 ${size === 'sm' ? 'text-2xl' : size === 'md' ? 'text-3xl' : 'text-4xl'}`}>
          Tax
        </span>
        
        {/* Checkmark with speed lines */}
        <div className="relative">
          <svg 
            className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'} text-green-500`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {/* Speed lines */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2">
            <div className={`bg-blue-400 ${size === 'sm' ? 'h-0.5 w-2' : 'h-1 w-3'} mb-1 rounded-full opacity-60`}></div>
            <div className={`bg-blue-400 ${size === 'sm' ? 'h-0.5 w-3' : 'h-1 w-4'} mb-1 rounded-full opacity-80`}></div>
            <div className={`bg-blue-400 ${size === 'sm' ? 'h-0.5 w-2' : 'h-1 w-3'} rounded-full opacity-60`}></div>
          </div>
        </div>
      </div>
      
      {/* Gold coins stack (optional - can be toggled) */}
      <div className={`ml-1 flex items-end ${size === 'sm' ? 'gap-0.5' : 'gap-1'}`}>
        <div className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-500`}></div>
        <div className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-500 -ml-1`}></div>
        <div className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-500 -ml-1`}></div>
      </div>
    </div>
  );
};

export default Logo;
