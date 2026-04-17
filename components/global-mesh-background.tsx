"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface MeshNodesProps {
  isHighBurnout: boolean
  mousePosition: { x: number; y: number }
}

function MeshNodes({ isHighBurnout, mousePosition }: MeshNodesProps) {
  const meshRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const nodeCount = 80
  const connectionDistance = 2.5

  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3)
    const origPos = new Float32Array(nodeCount * 3)
    
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 4 - 2
      
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      
      origPos[i * 3] = x
      origPos[i * 3 + 1] = y
      origPos[i * 3 + 2] = z
    }
    
    return { positions: pos, originalPositions: origPos }
  }, [])

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(nodeCount * nodeCount * 6)
    geometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3))
    return geometry
  }, [])

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return

    const time = state.clock.elapsedTime
    const positionsAttr = meshRef.current.geometry.attributes.position
    const array = positionsAttr.array as Float32Array

    // Animate nodes with mouse interaction
    for (let i = 0; i < nodeCount; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      // Base position with subtle floating animation
      array[ix] = originalPositions[ix] + Math.sin(time * 0.5 + i * 0.1) * 0.1
      array[iy] = originalPositions[iy] + Math.cos(time * 0.3 + i * 0.15) * 0.1
      array[iz] = originalPositions[iz] + Math.sin(time * 0.4 + i * 0.2) * 0.05

      // Mouse interaction - nodes move slightly toward mouse
      const dx = mousePosition.x * 5 - array[ix]
      const dy = mousePosition.y * 3 - array[iy]
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 3) {
        const force = (3 - dist) / 3 * 0.3
        array[ix] += dx * force * 0.02
        array[iy] += dy * force * 0.02
      }
    }
    positionsAttr.needsUpdate = true

    // Update connections
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array
    let lineIndex = 0

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = array[i * 3] - array[j * 3]
        const dy = array[i * 3 + 1] - array[j * 3 + 1]
        const dz = array[i * 3 + 2] - array[j * 3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < connectionDistance && lineIndex < linePositions.length - 6) {
          linePositions[lineIndex++] = array[i * 3]
          linePositions[lineIndex++] = array[i * 3 + 1]
          linePositions[lineIndex++] = array[i * 3 + 2]
          linePositions[lineIndex++] = array[j * 3]
          linePositions[lineIndex++] = array[j * 3 + 1]
          linePositions[lineIndex++] = array[j * 3 + 2]
        }
      }
    }

    // Clear remaining positions
    for (let i = lineIndex; i < linePositions.length; i++) {
      linePositions[i] = 0
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true

    // Color transition based on burnout state
    const material = meshRef.current.material as THREE.PointsMaterial
    const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial
    
    const targetColor = isHighBurnout 
      ? new THREE.Color(0.9, 0.2, 0.3) // Crimson
      : new THREE.Color(0.2, 0.85, 0.5) // Emerald
    
    material.color.lerp(targetColor, 0.02)
    lineMaterial.color.lerp(targetColor, 0.02)
    
    // Pulse effect for high burnout
    if (isHighBurnout) {
      const pulse = (Math.sin(time * 3) + 1) / 2 * 0.3 + 0.7
      material.opacity = pulse * 0.8
    } else {
      material.opacity = 0.6
    }
  })

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={isHighBurnout ? "#e53e3e" : "#48bb78"}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={isHighBurnout ? "#e53e3e" : "#48bb78"}
          transparent
          opacity={0.15}
        />
      </lineSegments>
    </>
  )
}

function CameraController() {
  const { camera } = useThree()
  
  useFrame(() => {
    camera.position.z = 5
  })
  
  return null
}

interface GlobalMeshBackgroundProps {
  isHighBurnout?: boolean
}

export function GlobalMeshBackground({ isHighBurnout = false }: GlobalMeshBackgroundProps) {
  const mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePosition.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
  }

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-auto"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <CameraController />
        <ambientLight intensity={0.5} />
        <MeshNodes 
          isHighBurnout={isHighBurnout} 
          mousePosition={mousePosition.current}
        />
      </Canvas>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </div>
  )
}
