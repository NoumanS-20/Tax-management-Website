import React, { useEffect, useRef } from 'react';

const Interactive3DBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const gradient = gradientRef.current;
    if (!container || !gradient) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate rotation based on mouse position (-10 to 10 degrees)
      const rotateX = ((clientY / innerHeight) - 0.5) * 20;
      const rotateY = ((clientX / innerWidth) - 0.5) * -20;
      
      // Calculate gradient position
      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;
      
      // Apply 3D transform to container
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Move gradient spotlight
      gradient.style.background = `
        radial-gradient(circle 600px at ${x}% ${y}%, 
          rgba(59, 130, 246, 0.15) 0%, 
          transparent 100%),
        radial-gradient(circle 400px at ${100 - x}% ${100 - y}%, 
          rgba(147, 197, 253, 0.1) 0%, 
          transparent 100%)
      `;
    };

    const handleMouseLeave = () => {
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 transition-transform duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div 
        ref={gradientRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 600px at 50% 50%, 
              rgba(59, 130, 246, 0.15) 0%, 
              transparent 100%)
          `,
          transition: 'background 0.3s ease-out'
        }}
      />
      
      {/* Floating particles for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Interactive3DBackground;
