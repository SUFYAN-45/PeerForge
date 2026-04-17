"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Shield({ isPulsing = true }: { isPulsing?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05
    }
    
    if (glowRef.current && isPulsing) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      glowRef.current.scale.set(scale, scale, scale)
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15
    }
  })

  // Shield shape
  const shieldShape = new THREE.Shape()
  shieldShape.moveTo(0, 1.2)
  shieldShape.bezierCurveTo(0.8, 1.1, 1, 0.6, 1, 0)
  shieldShape.bezierCurveTo(1, -0.8, 0.5, -1.2, 0, -1.4)
  shieldShape.bezierCurveTo(-0.5, -1.2, -1, -0.8, -1, 0)
  shieldShape.bezierCurveTo(-1, 0.6, -0.8, 1.1, 0, 1.2)

  const extrudeSettings = {
    steps: 1,
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 3
  }

  return (
    <group ref={groupRef}>
      {/* Main shield */}
      <mesh position={[0, 0, 0]}>
        <extrudeGeometry args={[shieldShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.6}
          roughness={0.3}
          emissive="#10b981"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Inner shield detail */}
      <mesh position={[0, 0, 0.1]} scale={0.7}>
        <extrudeGeometry args={[shieldShape, { ...extrudeSettings, depth: 0.1 }]} />
        <meshStandardMaterial
          color="#059669"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Cross symbol */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.15, 0.8, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0.2]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <extrudeGeometry args={[shieldShape, { ...extrudeSettings, depth: 0.01 }]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

interface Shield3DProps {
  size?: number
  isPulsing?: boolean
}

export function Shield3D({ size = 120, isPulsing = true }: Shield3DProps) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#10b981" />
        <Shield isPulsing={isPulsing} />
      </Canvas>
    </div>
  )
}
