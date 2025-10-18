import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Modern comfortable chair
const ModernChair = () => {
  return (
    <group position={[0, -1.2, 0]}>
      {/* Seat cushion */}
      <RoundedBox args={[1.4, 0.3, 1.2]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff7b5f" roughness={0.4} />
      </RoundedBox>

      {/* Backrest */}
      <RoundedBox args={[1.4, 1.2, 0.25]} radius={0.1} smoothness={4} position={[0, 0.6, -0.5]}>
        <meshStandardMaterial color="#ff7b5f" roughness={0.4} />
      </RoundedBox>

      {/* Left armrest */}
      <group position={[-0.65, 0.15, 0.1]}>
        <RoundedBox args={[0.15, 0.5, 0.8]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#ff6b4f" roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Right armrest */}
      <group position={[0.65, 0.15, 0.1]}>
        <RoundedBox args={[0.15, 0.5, 0.8]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#ff6b4f" roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Wooden legs - front left */}
      <mesh position={[-0.5, -0.4, 0.4]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>

      {/* Front right */}
      <mesh position={[0.5, -0.4, 0.4]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>

      {/* Back left */}
      <mesh position={[-0.5, -0.4, -0.4]} rotation={[-0.05, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>

      {/* Back right */}
      <mesh position={[0.5, -0.4, -0.4]} rotation={[-0.05, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.6} />
      </mesh>
    </group>
  );
};

// Person sitting with laptop
const PersonSitting = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffd4b8" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.65, 0.02]} scale={[1.1, 0.7, 1.05]}>
        <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Glasses - left lens */}
      <mesh position={[-0.12, 1.52, 0.28]}>
        <torusGeometry args={[0.08, 0.015, 16, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glasses - right lens */}
      <mesh position={[0.12, 1.52, 0.28]}>
        <torusGeometry args={[0.08, 0.015, 16, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glasses bridge */}
      <mesh position={[0, 1.52, 0.28]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Torso - shirt */}
      <RoundedBox args={[0.6, 0.8, 0.35]} radius={0.1} smoothness={4} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#5dccf7" roughness={0.6} />
      </RoundedBox>

      {/* Left arm */}
      <group position={[-0.35, 0.7, 0]}>
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#5dccf7" roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.15, -0.5, 0.2]} rotation={[0.8, 0, 0.5]}>
          <cylinderGeometry args={[0.07, 0.07, 0.4, 16]} />
          <meshStandardMaterial color="#5dccf7" roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.25, -0.75, 0.35]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#ffd4b8" />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.35, 0.7, 0]}>
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#5dccf7" roughness={0.6} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.15, -0.5, 0.2]} rotation={[0.8, 0, -0.5]}>
          <cylinderGeometry args={[0.07, 0.07, 0.4, 16]} />
          <meshStandardMaterial color="#5dccf7" roughness={0.6} />
        </mesh>
        {/* Hand - thumbs up position */}
        <mesh position={[0.25, -0.75, 0.35]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#ffd4b8" />
        </mesh>
        {/* Thumb */}
        <mesh position={[0.28, -0.68, 0.42]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.15, 12]} />
          <meshStandardMaterial color="#ffd4b8" />
        </mesh>
      </group>

      {/* Pants - left leg */}
      <mesh position={[-0.15, 0, 0]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.11, 0.9, 16]} />
        <meshStandardMaterial color="#2c5f7f" roughness={0.7} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.15, 0, 0]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.11, 0.9, 16]} />
        <meshStandardMaterial color="#2c5f7f" roughness={0.7} />
      </mesh>

      {/* Left shoe */}
      <RoundedBox args={[0.18, 0.12, 0.3]} radius={0.04} smoothness={4} position={[-0.15, -0.5, 0.25]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
      </RoundedBox>

      {/* Right shoe */}
      <RoundedBox args={[0.18, 0.12, 0.3]} radius={0.04} smoothness={4} position={[0.15, -0.5, 0.25]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
      </RoundedBox>
    </group>
  );
};

// Laptop
const Laptop = () => {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const emissive = screenRef.current.material as THREE.MeshStandardMaterial;
      emissive.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[0, -0.3, 0.4]} rotation={[0, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[0.8, 0.03, 0.6]} radius={0.02} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#999999" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Keyboard area */}
      <mesh position={[0, 0.02, 0.05]}>
        <boxGeometry args={[0.7, 0.01, 0.5]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>

      {/* Screen */}
      <group position={[0, 0.35, -0.28]} rotation={[-0.2, 0, 0]}>
        <RoundedBox args={[0.75, 0.55, 0.03]} radius={0.02} smoothness={4}>
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        
        {/* Screen display */}
        <mesh position={[0, 0, 0.02]} ref={screenRef}>
          <boxGeometry args={[0.68, 0.48, 0.01]} />
          <meshStandardMaterial 
            color="#6ec9f5" 
            emissive="#4da8d4"
            emissiveIntensity={0.3}
            roughness={0.1} 
          />
        </mesh>

        {/* Apple logo on screen */}
        <mesh position={[0, 0, 0.025]}>
          <circleGeometry args={[0.04, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// Floating paper/document
const FloatingPaper = () => {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={[-1.2, 0.5, 0]}>
        <RoundedBox args={[0.3, 0.4, 0.02]} radius={0.01} smoothness={4}>
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </RoundedBox>
        {/* Document lines */}
        <mesh position={[0, 0.1, 0.015]}>
          <boxGeometry args={[0.22, 0.02, 0.001]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 0.05, 0.015]}>
          <boxGeometry args={[0.22, 0.02, 0.001]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.22, 0.02, 0.001]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </Float>
  );
};

// Interactive scene with hover effect
const InteractiveLaptopScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

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
      <ModernChair />
      <PersonSitting />
      <Laptop />
      <FloatingPaper />
    </group>
  );
};

// Main component
const PersonWithLaptop3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f0f9ff']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 3, -3]} intensity={0.4} color="#ffa07a" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.5}
          penumbra={1}
          intensity={0.3}
          castShadow
        />

        <InteractiveLaptopScene />
        
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

export default PersonWithLaptop3D;
