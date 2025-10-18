import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Clipboard Component
function Clipboard() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Clipboard Back Board - Blue */}
      <RoundedBox args={[2.5, 3.5, 0.15]} radius={0.15} smoothness={4} position={[0, 0, -0.1]} castShadow>
        <meshStandardMaterial color="#5b9bd5" metalness={0.2} roughness={0.6} />
      </RoundedBox>

      {/* Paper/Document - White */}
      <RoundedBox args={[2.2, 3, 0.08]} radius={0.1} smoothness={4} position={[0, -0.1, 0]} castShadow>
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.8} />
      </RoundedBox>

      {/* TAX Header Button */}
      <RoundedBox args={[1.8, 0.5, 0.12]} radius={0.1} smoothness={4} position={[0, 1.1, 0.08]} castShadow>
        <meshStandardMaterial 
          color="#6fa8dc" 
          metalness={0.3} 
          roughness={0.5}
          emissive="#6fa8dc"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* TAX Text Representation (3D bars to suggest letters) */}
      <mesh position={[-0.4, 1.1, 0.15]}>
        <boxGeometry args={[0.15, 0.25, 0.05]} />
        <meshStandardMaterial color="#f0f4f8" />
      </mesh>
      <mesh position={[0, 1.1, 0.15]}>
        <boxGeometry args={[0.15, 0.25, 0.05]} />
        <meshStandardMaterial color="#f0f4f8" />
      </mesh>
      <mesh position={[0.4, 1.1, 0.15]}>
        <boxGeometry args={[0.15, 0.25, 0.05]} />
        <meshStandardMaterial color="#f0f4f8" />
      </mesh>

      {/* Clipboard Clip/Holder - Gold */}
      <group position={[0, 1.85, 0.08]}>
        {/* Clip Base */}
        <RoundedBox args={[1, 0.35, 0.2]} radius={0.1} smoothness={4} castShadow>
          <meshStandardMaterial 
            color="#f4b942" 
            metalness={0.7} 
            roughness={0.3}
            emissive="#f4b942"
            emissiveIntensity={0.1}
          />
        </RoundedBox>
        
        {/* Clip Handle/Ring */}
        <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.08, 16, 32]} />
          <meshStandardMaterial 
            color="#f4b942" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Checkmark Items (3 rows) */}
      {[0.4, -0.1, -0.6].map((yPos, index) => (
        <group key={index} position={[-0.6, yPos, 0.08]}>
          {/* Checkmark Circle - Blue */}
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
            <meshStandardMaterial 
              color="#6fa8dc" 
              metalness={0.3} 
              roughness={0.5}
            />
          </mesh>
          
          {/* Check Symbol - White */}
          <mesh position={[-0.08, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.06, 0.2, 0.04]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.08, 0.05, 0.05]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.06, 0.14, 0.04]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>

          {/* List Lines next to checkmark */}
          <RoundedBox args={[1.2, 0.08, 0.02]} radius={0.02} smoothness={2} position={[0.8, 0.08, 0.02]}>
            <meshStandardMaterial color="#6fa8dc" />
          </RoundedBox>
          <RoundedBox args={[0.9, 0.06, 0.02]} radius={0.02} smoothness={2} position={[0.95, -0.1, 0.02]}>
            <meshStandardMaterial color="#a8c7e8" />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

// Stack of Dollar Bills
function MoneyStack() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={[-2, -1.5, 0.5]} rotation={[0, -0.3, -0.1]}>
        {/* Multiple bills stacked */}
        {[0, 0.05, 0.1, 0.15].map((zOffset, index) => (
          <group key={index} position={[0, 0, zOffset]}>
            <RoundedBox args={[1.2, 0.6, 0.03]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial 
                color="#7cb342" 
                metalness={0.2} 
                roughness={0.7}
              />
            </RoundedBox>
            
            {/* Dollar symbol representation */}
            <mesh position={[0, 0, 0.02]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
              <meshStandardMaterial 
                color="#90c959" 
                metalness={0.3} 
                roughness={0.5}
              />
            </mesh>
            
            {/* Dollar sign details */}
            <mesh position={[-0.05, 0, 0.03]}>
              <boxGeometry args={[0.04, 0.2, 0.01]} />
              <meshStandardMaterial color="#a8d96c" />
            </mesh>
            <mesh position={[0.05, 0, 0.03]}>
              <boxGeometry args={[0.04, 0.2, 0.01]} />
              <meshStandardMaterial color="#a8d96c" />
            </mesh>

            {/* Small accent circles on corners */}
            {[[-0.45, 0.2], [0.45, 0.2], [-0.45, -0.2], [0.45, -0.2]].map(([x, y], i) => (
              <mesh key={i} position={[x, y, 0.02]}>
                <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
                <meshStandardMaterial color="#a8d96c" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Float>
  );
}

// Coin Stack
function CoinStack({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef} position={position}>
        {/* Stack of coins */}
        {Array.from({ length: 6 }).map((_, index) => (
          <group key={index} position={[0, index * 0.12, 0]}>
            {/* Main coin body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
              <meshStandardMaterial 
                color="#f4b942" 
                metalness={0.85} 
                roughness={0.15}
                emissive="#f4b942"
                emissiveIntensity={0.1}
              />
            </mesh>
            
            {/* Coin edge/rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.35, 0.05, 8, 32]} />
              <meshStandardMaterial 
                color="#d4941f" 
                metalness={0.9} 
                roughness={0.1}
              />
            </mesh>

            {/* Dollar symbol on top coin */}
            {index === 5 && (
              <>
                <mesh position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
                  <meshStandardMaterial color="#d4941f" metalness={0.5} roughness={0.3} />
                </mesh>
                
                {/* $ symbol bars */}
                <mesh position={[-0.05, 0.08, 0]}>
                  <boxGeometry args={[0.03, 0.15, 0.02]} />
                  <meshStandardMaterial color="#a67c1b" />
                </mesh>
                <mesh position={[0.05, 0.08, 0]}>
                  <boxGeometry args={[0.03, 0.15, 0.02]} />
                  <meshStandardMaterial color="#a67c1b" />
                </mesh>
              </>
            )}
          </group>
        ))}
      </group>
    </Float>
  );
}

// Main Scene Component
export function TaxClipboard3DScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 3, 3]} intensity={0.5} color="#6fa8dc" />
        <pointLight position={[5, -3, 2]} intensity={0.4} color="#f4b942" />
        <spotLight 
          position={[0, 6, 3]} 
          intensity={0.6} 
          angle={0.5}
          penumbra={1}
          castShadow
        />

        {/* Main Clipboard */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <Clipboard />
        </Float>

        {/* Money Stack */}
        <MoneyStack />

        {/* Coin Stacks */}
        <CoinStack position={[2.2, -1.2, 0.5]} />
        <CoinStack position={[1.8, -1.8, 0.8]} />
        <CoinStack position={[2.6, -1.6, 0.3]} />

        {/* Ground reflection plane (invisible but receives shadows) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.2} />
        </mesh>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}

// Alternative view for smaller spaces
export function TaxClipboard3DCompact() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1} castShadow />
        <pointLight position={[-3, 2, 2]} intensity={0.5} color="#6fa8dc" />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <Clipboard />
        </Float>

        <CoinStack position={[1.8, -1.5, 0]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}
