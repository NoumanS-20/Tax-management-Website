import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Modern rectangular table
const RectangularTable = () => {
  return (
    <group position={[0, -0.8, 0]}>
      {/* Table top */}
      <RoundedBox args={[2.2, 0.08, 1.2]} radius={0.03} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8fb3c7" roughness={0.3} metalness={0.1} />
      </RoundedBox>

      {/* Table edge */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[2.22, 0.02, 1.22]} />
        <meshStandardMaterial color="#7a9faf" roughness={0.4} />
      </mesh>

      {/* Front left leg */}
      <mesh position={[-0.95, -0.4, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.72, 16]} />
        <meshStandardMaterial color="#6b8a9a" roughness={0.5} />
      </mesh>

      {/* Front right leg */}
      <mesh position={[0.95, -0.4, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.72, 16]} />
        <meshStandardMaterial color="#6b8a9a" roughness={0.5} />
      </mesh>

      {/* Back left leg */}
      <mesh position={[-0.95, -0.4, -0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.72, 16]} />
        <meshStandardMaterial color="#6b8a9a" roughness={0.5} />
      </mesh>

      {/* Back right leg */}
      <mesh position={[0.95, -0.4, -0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.72, 16]} />
        <meshStandardMaterial color="#6b8a9a" roughness={0.5} />
      </mesh>
    </group>
  );
};

// Wooden chair with orange/brown seat
const WoodenChair = () => {
  return (
    <group position={[0, -1.35, -0.8]} rotation={[0, 0, 0]}>
      {/* Seat */}
      <RoundedBox args={[0.5, 0.08, 0.5]} radius={0.03} smoothness={4} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#d4834f" roughness={0.5} />
      </RoundedBox>

      {/* Backrest - curved */}
      <group position={[0, 0.35, -0.22]}>
        <RoundedBox args={[0.5, 0.6, 0.08]} radius={0.04} smoothness={4} castShadow>
          <meshStandardMaterial color="#d4834f" roughness={0.5} />
        </RoundedBox>
      </group>

      {/* Front left leg */}
      <mesh position={[-0.18, -0.25, 0.18]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.5, 12]} />
        <meshStandardMaterial color="#c9995e" roughness={0.7} />
      </mesh>

      {/* Front right leg */}
      <mesh position={[0.18, -0.25, 0.18]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.5, 12]} />
        <meshStandardMaterial color="#c9995e" roughness={0.7} />
      </mesh>

      {/* Back left leg */}
      <mesh position={[-0.18, -0.25, -0.18]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.5, 12]} />
        <meshStandardMaterial color="#c9995e" roughness={0.7} />
      </mesh>

      {/* Back right leg */}
      <mesh position={[0.18, -0.25, -0.18]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.5, 12]} />
        <meshStandardMaterial color="#c9995e" roughness={0.7} />
      </mesh>
    </group>
  );
};

// Person sitting at desk
const Person = () => {
  return (
    <group position={[0, -1.25, -0.65]}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#ffd4b8" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.32, 0]} scale={[1.15, 0.8, 1.1]} castShadow>
        <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#8b5a3c" roughness={0.9} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 1.22, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.08, 1.22, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Smile - curved upward */}
      <mesh position={[0, 1.1, 0.2]} rotation={[-0.3, 0, 0]}>
        <torusGeometry args={[0.08, 0.01, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
        <meshStandardMaterial color="#ffd4b8" />
      </mesh>

      {/* Body/Torso - white shirt */}
      <RoundedBox args={[0.5, 0.7, 0.3]} radius={0.08} smoothness={4} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </RoundedBox>

      {/* Left arm - reaching toward laptop */}
      <group position={[-0.28, 0.6, 0.15]}>
        <mesh rotation={[0.8, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        {/* Left hand */}
        <mesh position={[-0.05, 0, 0.25]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#ffd4b8" />
        </mesh>
      </group>

      {/* Right arm - reaching toward laptop */}
      <group position={[0.28, 0.6, 0.15]}>
        <mesh rotation={[0.8, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        {/* Right hand */}
        <mesh position={[0.05, 0, 0.25]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#ffd4b8" />
        </mesh>
      </group>

      {/* Pants - left leg bent */}
      <mesh position={[-0.12, 0.15, -0.05]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.6, 16]} />
        <meshStandardMaterial color="#2c4c6f" roughness={0.7} />
      </mesh>

      {/* Right leg bent */}
      <mesh position={[0.12, 0.15, -0.05]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.6, 16]} />
        <meshStandardMaterial color="#2c4c6f" roughness={0.7} />
      </mesh>

      {/* Left foot on ground */}
      <RoundedBox args={[0.15, 0.08, 0.22]} radius={0.03} smoothness={4} position={[-0.12, -0.25, 0.05]} castShadow>
        <meshStandardMaterial color="#4a4a4a" roughness={0.5} />
      </RoundedBox>

      {/* Right foot on ground */}
      <RoundedBox args={[0.15, 0.08, 0.22]} radius={0.03} smoothness={4} position={[0.12, -0.25, 0.05]} castShadow>
        <meshStandardMaterial color="#4a4a4a" roughness={0.5} />
      </RoundedBox>
    </group>
  );
};

// Laptop on table
const Laptop = () => {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const emissive = screenRef.current.material as THREE.MeshStandardMaterial;
      emissive.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={[0, -0.72, 0.2]} rotation={[0, Math.PI, 0]}>
      {/* Base/keyboard */}
      <RoundedBox args={[0.5, 0.02, 0.35]} radius={0.01} smoothness={4} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#b8bcc4" metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Keyboard detail */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.45, 0.005, 0.3]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.7} />
      </mesh>

      {/* Screen */}
      <group position={[0, 0.18, -0.15]} rotation={[-0.15, 0, 0]}>
        <RoundedBox args={[0.48, 0.32, 0.02]} radius={0.015} smoothness={4} castShadow>
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.2} />
        </RoundedBox>
        
        {/* Display */}
        <mesh position={[0, 0, 0.015]} ref={screenRef}>
          <boxGeometry args={[0.44, 0.28, 0.005]} />
          <meshStandardMaterial 
            color="#d4e8f5" 
            emissive="#a8d5ec"
            emissiveIntensity={0.15}
            roughness={0.1} 
          />
        </mesh>
      </group>
    </group>
  );
};

// Coffee mug
const CoffeeMug = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={[-0.8, -0.72, 0.15]}>
        {/* Mug body */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
          <meshStandardMaterial color="#ff9c4f" roughness={0.3} />
        </mesh>

        {/* Handle */}
        <mesh position={[0.08, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.05, 0.015, 12, 16, Math.PI]} />
          <meshStandardMaterial color="#ff9c4f" roughness={0.3} />
        </mesh>

        {/* Coffee inside */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.02, 16]} />
          <meshStandardMaterial color="#3d2817" roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

// Small plant
const Plant = () => {
  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
      <group position={[0.8, -0.72, 0.1]}>
        {/* Pot */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
          <meshStandardMaterial color="#7a9b7e" roughness={0.6} />
        </mesh>

        {/* Leaves */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#5c8a5f" roughness={0.8} />
        </mesh>
        <mesh position={[-0.03, 0.16, 0.02]} scale={[0.8, 1.2, 0.8]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#6b9b6e" roughness={0.8} />
        </mesh>
        <mesh position={[0.03, 0.15, -0.02]} scale={[0.7, 1.1, 0.7]} castShadow>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#5c8a5f" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
};

// Interactive scene with hover effect
const InteractiveScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.1 : 1;
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
      <RectangularTable />
      <WoodenChair />
      <Person />
      <Laptop />
      <CoffeeMug />
      <Plant />
    </group>
  );
};

// Main component
const PersonAtDesk3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 5], fov: 40 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#b8dde8']} />
        
        {/* Lighting setup for clean look */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ffffff" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.6}
          penumbra={1}
          intensity={0.4}
          castShadow
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.15} />
        </mesh>

        <InteractiveScene />
        
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

export default PersonAtDesk3D;
