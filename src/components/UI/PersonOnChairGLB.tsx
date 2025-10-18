import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Loading fallback
const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#5dccf7" />
    </mesh>
  );
};

// Model component with hover interaction
const PersonOnChairModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);
  
  try {
    // Load the GLB model
    const { scene } = useGLTF('/models/person-on-chair.glb');

    // Animate scale on hover
    useFrame(() => {
      if (groupRef.current) {
        const targetScale = hovered ? 1.15 : 1;
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
        groupRef.current.scale.setScalar(scaleRef.current);
      }
    });

    return (
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
      </group>
    );
  } catch (error) {
    console.error('Error loading GLB model:', error);
    return <LoadingFallback />;
  }
};

// Main component
const PersonOnChairGLB = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f0f9ff']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -3]} intensity={0.4} color="#5dccf7" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.5}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        <Suspense fallback={<LoadingFallback />}>
          <PersonOnChairModel />
        </Suspense>

        {/* Interactive controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload('/models/person-on-chair.glb');

export default PersonOnChairGLB;
