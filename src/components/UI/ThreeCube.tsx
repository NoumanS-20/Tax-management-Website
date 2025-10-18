import React, { useRef } from 'react';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type * as THREE from 'three';

function Cube(props: MeshProps) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.6;
    ref.current.rotation.y += delta * 0.8;
  });
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial
        color="#2563eb" /* blue-600 */
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={0.95}
        emissive="#1d4ed8"
        emissiveIntensity={0.15}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

const ThreeCube: React.FC = () => (
  <div style={{ width: '120px', height: '120px', position: 'relative', zIndex: 2 }}>
    <Canvas
      camera={{ position: [2.2, 2.2, 2.2], fov: 60 }}
      dpr={[1, 2]}
      gl={{ 
        alpha: true, 
        antialias: true,
        outputColorSpace: 'srgb' // Modern Three.js color management
      }}
      flat // Disable automatic tone mapping for simpler setup
    >
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <hemisphereLight args={[0xffffff, 0x444444, 0.6]} />
      <directionalLight position={[2.5, 2.5, 2.5]} intensity={0.9} />
      <pointLight position={[0, 0, 3]} intensity={0.6} />

      <Cube />

      {/* Gentle auto-rotate, no zoom to keep layout stable */}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
  </div>
);

export default ThreeCube;
