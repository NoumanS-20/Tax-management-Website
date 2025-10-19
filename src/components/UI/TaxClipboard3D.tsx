import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// Wooden board/clipboard
const WoodenBoard = () => {
  return (
    <RoundedBox args={[2, 2.5, 0.15]} radius={0.08} smoothness={4} position={[0, 0, 0]} castShadow>
      <meshStandardMaterial color="#8b6f47" roughness={0.7} metalness={0.1} />
    </RoundedBox>
  );
};

// Paper with TAX text
const TaxPaper = () => {
  return (
    <group position={[0, 0.1, 0.08]}>
      {/* Main paper */}
      <RoundedBox args={[1.6, 2, 0.02]} radius={0.03} smoothness={4} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </RoundedBox>

      {/* TAX header - blue rectangle */}
      <mesh position={[0, 0.7, 0.02]}>
        <boxGeometry args={[1.2, 0.3, 0.01]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* White boxes for TAX letters */}
      <group position={[0, 0.7, 0.03]}>
        {/* T box */}
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.2, 0.18, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* A box */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.18, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* X box */}
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.2, 0.18, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* TAX letters inside the white boxes - in black */}
      <group position={[0, 0.7, 0.04]}>
        {/* T letter */}
        <Text
          position={[-0.35, 0, 0]}
          fontSize={0.15}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          T
        </Text>
        {/* A letter */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          A
        </Text>
        {/* X letter */}
        <Text
          position={[0.35, 0, 0]}
          fontSize={0.15}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
      </group>

      {/* Form lines */}
      {[0.2, 0, -0.2, -0.4, -0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0.02]}>
          <boxGeometry args={[1.3, 0.04, 0.01]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>
      ))}
    </group>
  );
};

// Cash/dollar bills
const CashMoney = () => {
  return (
    <group>
      {/* First bill */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[1.2, 0.5, 0.15]} rotation={[0, 0, 0.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.4, 0.02]} />
            <meshStandardMaterial color="#85bb65" roughness={0.6} />
          </mesh>
          {/* Dollar sign */}
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.2}
            color="#2d5016"
            anchorX="center"
            anchorY="middle"
          >
            $
          </Text>
        </group>
      </Float>

      {/* Second bill */}
      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>
        <group position={[1.1, -0.3, 0.2]} rotation={[0, 0, -0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.4, 0.02]} />
            <meshStandardMaterial color="#7fb069" roughness={0.6} />
          </mesh>
          {/* Dollar sign */}
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.2}
            color="#2d5016"
            anchorX="center"
            anchorY="middle"
          >
            $
          </Text>
        </group>
      </Float>

      {/* Third bill */}
      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.25}>
        <group position={[-1.1, 0.2, 0.18]} rotation={[0, 0, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.4, 0.02]} />
            <meshStandardMaterial color="#85bb65" roughness={0.6} />
          </mesh>
          {/* Dollar sign */}
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.2}
            color="#2d5016"
            anchorX="center"
            anchorY="middle"
          >
            $
          </Text>
        </group>
      </Float>
    </group>
  );
};

// Gold coins
const GoldCoins = () => {
  return (
    <group>
      {/* Coin 1 - top right */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh position={[1.3, 0.9, 0.25]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.1} />
        </mesh>
      </Float>

      {/* Coin 2 - middle right */}
      <Float speed={1.7} rotationIntensity={0.3} floatIntensity={0.35}>
        <mesh position={[1.2, 0.1, 0.22]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.1} />
        </mesh>
      </Float>

      {/* Coin 3 - bottom right */}
      <Float speed={1.9} rotationIntensity={0.35} floatIntensity={0.3}>
        <mesh position={[1.15, -0.6, 0.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 32]} />
          <meshStandardMaterial color="#FFA500" metalness={1.0} roughness={0.1} />
        </mesh>
      </Float>

      {/* Coin 4 - top left */}
      <Float speed={2.2} rotationIntensity={0.38} floatIntensity={0.42}>
        <mesh position={[-1.2, 0.6, 0.23]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.06, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.1} />
        </mesh>
      </Float>

      {/* Coin 5 - bottom left */}
      <Float speed={1.6} rotationIntensity={0.28} floatIntensity={0.38}>
        <mesh position={[-1.1, -0.5, 0.21]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
          <meshStandardMaterial color="#FFA500" metalness={1.0} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
};

// Main tax scene
const TaxScene = () => {
  return (
    <group>
      <WoodenBoard />
      <TaxPaper />
      <CashMoney />
      <GoldCoins />
    </group>
  );
};

// Interactive scene with hover effect
const InteractiveScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.08 : 1;
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
      groupRef.current.scale.setScalar(scaleRef.current);
      
      // Rotation removed - board stays still
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <TaxScene />
    </group>
  );
};

// Main component
const TaxClipboard3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={['transparent']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 0]} intensity={0.4} color="#a78bfa" />
        <spotLight
          position={[0, 5, 3]}
          angle={0.5}
          penumbra={1}
          intensity={0.5}
          castShadow
        />

        <InteractiveScene />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default TaxClipboard3D;
