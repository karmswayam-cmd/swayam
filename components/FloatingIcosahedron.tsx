'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingIcosahedronProps {
  position: [number, number, number];
  size: number;
  color: string;
  speed: number;
  delay: number;
}

function IcosahedronMesh({ color, speed, delay }: Omit<FloatingIcosahedronProps, 'position' | 'size'>) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const elapsed = clock.getElapsedTime() + delay;
      meshRef.current.rotation.x = elapsed * speed * 0.5;
      meshRef.current.rotation.y = elapsed * speed * 0.7;
      meshRef.current.rotation.z = elapsed * speed * 0.3;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe={false}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const icosahedrons: FloatingIcosahedronProps[] = [
    { position: [-8, 5, -10], size: 2, color: '#00d4ff', speed: 0.5, delay: 0 },
    { position: [8, -5, -15], size: 1.5, color: '#ff006e', speed: 0.7, delay: 1 },
    { position: [0, 0, -8], size: 2.5, color: '#00d4ff', speed: 0.4, delay: 0.5 },
    { position: [-5, -8, -20], size: 1, color: '#ffbe0b', speed: 0.6, delay: 1.5 },
    { position: [10, 5, -12], size: 1.8, color: '#8338ec', speed: 0.5, delay: 0.7 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[0, 0, 5]} intensity={0.6} color="#ff006e" />

      {icosahedrons.map((props, idx) => (
        <group key={idx} position={props.position}>
          <IcosahedronMesh
            color={props.color}
            speed={props.speed}
            delay={props.delay}
          />
        </group>
      ))}
    </>
  );
}

export default function FloatingIcosahedron() {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 50 }}
      style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
