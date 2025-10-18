import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced Calculator Component
function Calculator() {
  const meshRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (screenRef.current) {
      // Pulsing screen effect
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Calculator Body with rounded edges */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 2.8, 0.3]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Screen with glow */}
      <mesh ref={screenRef} position={[0, 0.8, 0.16]} castShadow>
        <boxGeometry args={[1.6, 0.6, 0.05]} />
        <meshStandardMaterial 
          color="#1e293b" 
          emissive="#22c55e" 
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Buttons with hover effect */}
      {[-0.5, 0, 0.5].map((x) =>
        [-0.2, -0.7, -1.2].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.16]} castShadow>
            <boxGeometry args={[0.35, 0.35, 0.08]} />
            <meshStandardMaterial 
              color="#f1f5f9"
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>
        ))
      )}

      {/* Special button (=) with gradient effect */}
      <mesh position={[0, -1.7, 0.16]} castShadow>
        <boxGeometry args={[1.3, 0.35, 0.08]} />
        <meshStandardMaterial 
          color="#ec4899"
          metalness={0.3}
          roughness={0.4}
          emissive="#ec4899"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Enhanced Document/Paper Component
function Document({ position }: { position: [number, number, number] }) {
  const docRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (docRef.current) {
      // Gentle rotation animation
      docRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={docRef} position={position}>
        {/* Paper with shadow */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 2, 0.05]} />
          <meshStandardMaterial 
            color="#ffffff"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Header bar */}
        <mesh position={[0, 0.8, 0.03]} castShadow>
          <boxGeometry args={[1.2, 0.15, 0.01]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>

        {/* Lines on paper */}
        {[0.4, 0.1, -0.2, -0.5, -0.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0.03]} castShadow>
            <boxGeometry args={[1.2, 0.06, 0.01]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        ))}

        {/* Corner fold effect */}
        <mesh position={[0.6, 0.9, 0.03]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      </group>
    </Float>
  );
}

// Enhanced Coin Component with symbol
function Coin({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 1.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={1}>
      <group position={position}>
        {/* Main coin body */}
        <mesh ref={meshRef} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#fbbf24"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Coin rim/edge detail */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.05, 8, 32]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>

        {/* Rupee symbol on coin */}
        <mesh position={[0, 0, 0.06]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshStandardMaterial 
            color="#d97706"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Main Tax Illustration Scene
export function TaxIllustration3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.6} color="#ec4899" />
        <pointLight position={[5, -3, 2]} intensity={0.4} color="#06b6d4" />
        <spotLight 
          position={[0, 5, 0]} 
          intensity={0.5} 
          angle={0.6}
          penumbra={1}
          castShadow
        />

        {/* Sparkles for magic effect */}
        <Sparkles
          count={30}
          scale={10}
          size={2}
          speed={0.3}
          opacity={0.4}
          color="#fbbf24"
        />

        {/* Main Calculator */}
        <Calculator />

        {/* Floating Documents */}
        <Document position={[-3, 1, -1]} />
        <Document position={[3, -1, -1]} />

        {/* Floating Coins */}
        <Coin position={[-2.5, -2, 0]} />
        <Coin position={[2.8, 2, 0]} />
        <Coin position={[2, -1.5, 1]} />

        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#ffffff', 8, 15]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Enhanced Login Illustration
export function LoginIllustration3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} castShadow />
        <pointLight position={[-3, -3, -3]} intensity={0.6} color="#a855f7" />
        <pointLight position={[3, 2, 2]} intensity={0.4} color="#ec4899" />

        {/* Sparkles */}
        <Sparkles
          count={25}
          scale={8}
          size={2}
          speed={0.4}
          opacity={0.5}
          color="#ec4899"
        />

        {/* Floating Lock/Security Icon */}
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <group>
            {/* Lock Body with gradient effect */}
            <mesh position={[0, -0.3, 0]} castShadow>
              <boxGeometry args={[1.5, 1.5, 0.8]} />
              <meshStandardMaterial 
                color="#ec4899" 
                metalness={0.5} 
                roughness={0.3}
                emissive="#ec4899"
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Lock Shackle with metallic finish */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI]} />
              <meshStandardMaterial 
                color="#ec4899" 
                metalness={0.7} 
                roughness={0.2}
              />
            </mesh>

            {/* Keyhole with depth */}
            <mesh position={[0, -0.3, 0.41]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Keyhole detail */}
            <mesh position={[0, -0.5, 0.41]}>
              <boxGeometry args={[0.1, 0.3, 0.05]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Security shield behind lock */}
            <mesh position={[0, 0, -0.5]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[2, 2, 0.1]} />
              <meshStandardMaterial 
                color="#a855f7" 
                metalness={0.3}
                roughness={0.5}
                opacity={0.3}
                transparent
              />
            </mesh>
          </group>
        </Float>

        {/* Floating Coins with better positioning */}
        <Coin position={[-2.5, 1.5, -1]} />
        <Coin position={[2.5, -1.2, -1]} />
        <Coin position={[-1.8, -1.8, 0]} />

        {/* Floating key element */}
        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.7}>
          <mesh position={[2, 1.5, 0.5]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Enhanced Registration Illustration
export function RegisterIllustration3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} castShadow />
        <pointLight position={[-4, -4, -4]} intensity={0.6} color="#06b6d4" />
        <pointLight position={[4, -2, 2]} intensity={0.4} color="#a855f7" />

        {/* Sparkles */}
        <Sparkles
          count={20}
          scale={8}
          size={2}
          speed={0.3}
          opacity={0.4}
          color="#a855f7"
        />

        {/* User Profile Card */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.7}>
          <group>
            {/* Card Background with shadow */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.5, 3, 0.2]} />
              <meshStandardMaterial 
                color="#ffffff"
                metalness={0.1}
                roughness={0.7}
              />
            </mesh>

            {/* Profile Picture Circle with gradient */}
            <mesh position={[0, 0.8, 0.11]} castShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
              <meshStandardMaterial 
                color="#a855f7"
                metalness={0.3}
                roughness={0.4}
                emissive="#a855f7"
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Avatar icon on profile pic */}
            <mesh position={[0, 0.9, 0.14]}>
              <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Info Lines with varying colors */}
            {[
              { y: 0.2, width: 1.8, color: '#3b82f6' },
              { y: -0.1, width: 1.5, color: '#e2e8f0' },
              { y: -0.4, width: 1.8, color: '#e2e8f0' },
              { y: -0.7, width: 1.3, color: '#e2e8f0' },
              { y: -1, width: 1.6, color: '#e2e8f0' }
            ].map((line, i) => (
              <mesh key={i} position={[0, line.y, 0.11]} castShadow>
                <boxGeometry args={[line.width, 0.12, 0.02]} />
                <meshStandardMaterial color={line.color} />
              </mesh>
            ))}

            {/* Card corner accent */}
            <mesh position={[1.1, 1.4, 0.11]}>
              <boxGeometry args={[0.3, 0.3, 0.02]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          </group>
        </Float>

        {/* Enhanced Checkmark Symbol */}
        <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
          <group position={[2.5, 2, 0]}>
            {/* Check circle background */}
            <mesh castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
              <meshStandardMaterial 
                color="#22c55e"
                metalness={0.3}
                roughness={0.4}
                emissive="#22c55e"
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Checkmark */}
            <mesh position={[-0.1, 0, 0.08]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.1, 0.4, 0.05]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.15, 0.1, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.1, 0.25, 0.05]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </Float>

        {/* Floating pen/pencil */}
        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
          <group position={[-2.5, 2, 0.5]} rotation={[0, 0, Math.PI / 3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.5, 16]} />
              <meshStandardMaterial color="#ec4899" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <coneGeometry args={[0.08, 0.2, 16]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        </Float>

        {/* Documents */}
        <Document position={[-2.8, -1.5, -1]} />
        <Coin position={[2.8, -1.5, 0]} />
        <Coin position={[-1.5, -2, -0.5]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
