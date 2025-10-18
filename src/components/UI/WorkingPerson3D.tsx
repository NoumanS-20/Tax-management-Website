import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Desk Component
function Desk() {
  return (
    <group position={[0, -0.8, 0]}>
      {/* Desktop surface */}
      <RoundedBox args={[4, 0.15, 2]} radius={0.05} smoothness={4} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#6b5b47" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      
      {/* Desk front panel */}
      <RoundedBox args={[3.8, 0.8, 0.1]} radius={0.05} smoothness={4} position={[0, -0.5, 0.9]} castShadow>
        <meshStandardMaterial color="#5a4d3e" roughness={0.6} />
      </RoundedBox>

      {/* Desk drawer */}
      <RoundedBox args={[1.2, 0.3, 0.08]} radius={0.03} smoothness={4} position={[0.8, -0.5, 0.92]} castShadow>
        <meshStandardMaterial color="#4a3d2e" roughness={0.7} />
      </RoundedBox>

      {/* Drawer handle */}
      <mesh position={[0.8, -0.5, 0.97]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Computer Monitor
function Monitor() {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 0.2, -0.3]}>
      {/* Monitor stand base */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Monitor stand pole */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#34495e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Monitor back */}
      <RoundedBox args={[1.8, 1.2, 0.1]} radius={0.05} smoothness={4} position={[0, 0, -0.05]} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.6} />
      </RoundedBox>

      {/* Monitor screen */}
      <RoundedBox 
        ref={screenRef}
        args={[1.7, 1.1, 0.05]} 
        radius={0.03} 
        smoothness={4} 
        position={[0, 0, 0.03]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#3498db" 
          emissive="#2980b9"
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Screen content bars */}
      {[-0.3, -0.1, 0.1].map((y, i) => (
        <mesh key={i} position={[-0.2, y, 0.06]}>
          <boxGeometry args={[1.2, 0.08, 0.01]} />
          <meshStandardMaterial color="#ecf0f1" emissive="#bdc3c7" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// Wall Clock
function WallClock() {
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -time * 0.1;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -time * 0.5;
    }
  });

  return (
    <group position={[-2, 1.5, -0.5]}>
      {/* Clock back circle */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#34495e" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Clock face */}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 32]} />
        <meshStandardMaterial color="#ecf0f1" roughness={0.4} />
      </mesh>

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 0.3;
        return (
          <mesh
            key={i}
            position={[
              Math.sin(angle) * radius,
              Math.cos(angle) * radius,
              0.08
            ]}
          >
            <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        );
      })}

      {/* Hour hand */}
      <group ref={hourHandRef} position={[0, 0, 0.09]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.02]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
      </group>

      {/* Minute hand */}
      <group ref={minuteHandRef} position={[0, 0, 0.1]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.03, 0.28, 0.02]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>

      {/* Center dot */}
      <mesh position={[0, 0, 0.11]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
}

// Pen/Pencil Holder with Pens
function PenHolder() {
  return (
    <group position={[-1.2, -0.65, 0.3]}>
      {/* Holder cup */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.13, 0.3, 32]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Pens/Pencils sticking out */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.05}>
        <mesh position={[-0.05, 0.25, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
          <meshStandardMaterial color="#3498db" />
        </mesh>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.05}>
        <mesh position={[0.05, 0.3, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 16]} />
          <meshStandardMaterial color="#e67e22" />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.05}>
        <mesh position={[0, 0.28, -0.05]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 16]} />
          <meshStandardMaterial color="#2ecc71" />
        </mesh>
      </Float>
    </group>
  );
}

// Person Character
function Person() {
  return (
    <group position={[0.3, -0.2, 0.8]}>
      {/* Body/Torso */}
      <RoundedBox args={[0.8, 1, 0.4]} radius={0.1} smoothness={4} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#2c3e50" roughness={0.7} />
      </RoundedBox>

      {/* Collar/Shirt detail */}
      <mesh position={[0, 0.4, 0.21]}>
        <boxGeometry args={[0.3, 0.15, 0.02]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#f0c9a0" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#f0c9a0" roughness={0.8} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Glasses - Left lens */}
      <RoundedBox args={[0.22, 0.18, 0.02]} radius={0.08} smoothness={4} position={[-0.15, 0.95, 0.34]} castShadow>
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.3} 
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </RoundedBox>

      {/* Glasses - Right lens */}
      <RoundedBox args={[0.22, 0.18, 0.02]} radius={0.08} smoothness={4} position={[0.15, 0.95, 0.34]} castShadow>
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.3} 
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </RoundedBox>

      {/* Glasses bridge */}
      <mesh position={[0, 0.95, 0.35]}>
        <boxGeometry args={[0.08, 0.03, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
      </mesh>

      {/* Glasses frame */}
      <mesh position={[-0.15, 0.95, 0.34]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.11, 0.015, 8, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 0.95, 0.34]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.11, 0.015, 8, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Left Arm */}
      <RoundedBox args={[0.18, 0.7, 0.18]} radius={0.05} smoothness={4} position={[-0.5, 0.1, 0.1]} rotation={[0.3, 0, 0.2]} castShadow>
        <meshStandardMaterial color="#2c3e50" />
      </RoundedBox>

      {/* Right Arm */}
      <RoundedBox args={[0.18, 0.7, 0.18]} radius={0.05} smoothness={4} position={[0.5, 0.1, 0.1]} rotation={[0.3, 0, -0.2]} castShadow>
        <meshStandardMaterial color="#2c3e50" />
      </RoundedBox>

      {/* Left Hand */}
      <mesh position={[-0.5, -0.5, 0.3]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f0c9a0" />
      </mesh>

      {/* Right Hand */}
      <mesh position={[0.5, -0.5, 0.3]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f0c9a0" />
      </mesh>
    </group>
  );
}

// Coffee Cup
function CoffeeCup() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
      <group position={[1.3, -0.65, 0.4]}>
        {/* Cup body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.25, 32]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Coffee inside */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.02, 32]} />
          <meshStandardMaterial color="#4a2511" roughness={0.8} />
        </mesh>

        {/* Handle */}
        <mesh position={[0.15, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.3} />
        </mesh>

        {/* Steam particles */}
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.6}
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      </group>
    </Float>
  );
}

// Interactive Scene Component
function InteractiveWorkScene() {
  const [isHovered, setIsHovered] = useState(false);
  const sceneRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (sceneRef.current) {
      const targetScale = isHovered ? 1.12 : 1;
      sceneRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group
      ref={sceneRef}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.15}>
        <Desk />
        <Monitor />
        <Person />
        <WallClock />
        <PenHolder />
        <CoffeeCup />
      </Float>
    </group>
  );
}

// Main Component
export function WorkingPerson3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-3, 3, 3]} intensity={0.5} color="#3498db" />
        <pointLight position={[3, 1, -2]} intensity={0.3} color="#e74c3c" />
        <spotLight
          position={[0, 5, 2]}
          intensity={0.5}
          angle={0.6}
          penumbra={1}
          castShadow
        />

        {/* Interactive Scene */}
        <InteractiveWorkScene />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
