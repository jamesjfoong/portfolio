'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Sphere,
  Box,
  Torus,
  MeshDistortMaterial,
  Float,
} from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function AnimatedSphere({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
        position={position}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function AnimatedBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={1}>
      <Box
        ref={meshRef}
        args={[1.5, 1.5, 1.5]}
        position={position}
        scale={hovered ? 1.1 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </Box>
    </Float>
  )
}

function AnimatedTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={3}>
      <Torus
        ref={meshRef}
        args={[1, 0.3, 16, 32]}
        position={position}
        scale={hovered ? 1.3 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </Torus>
    </Float>
  )
}

export default function Interactive3D(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-[400px] md:h-[500px] relative"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        className="bg-transparent"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#3b82f6"
        />

        <AnimatedSphere position={[-3, 2, 0]} color="#ef4444" />
        <AnimatedSphere position={[3, -1, 0]} color="#10b981" />
        <AnimatedBox position={[0, 0, 0]} />
        <AnimatedTorus position={[2, 2, -2]} />
        <AnimatedTorus position={[-2, -2, 2]} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </motion.div>
  )
}
