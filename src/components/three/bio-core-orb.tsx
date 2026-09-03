'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface BioCoreOrbProps {
  className?: string
  height?: number | string
}

export function BioCoreOrb({ className = '', height = 280 }: BioCoreOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 320
    const h = typeof height === 'number' ? height : container.clientHeight || 280

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 100)
    camera.position.set(0, 0, 16)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3
      container.appendChild(renderer.domElement)
    } catch {
      // Graceful fallback if WebGL is unavailable
      return
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x270f6a, 2.5)
    scene.add(ambientLight)

    const pLight1 = new THREE.PointLight(0x7060f9, 4, 30)
    pLight1.position.set(5, 6, 8)
    scene.add(pLight1)

    const pLight2 = new THREE.PointLight(0x9d8cf3, 3, 25)
    pLight2.position.set(-6, -5, 6)
    scene.add(pLight2)

    // Core Group
    const orbGroup = new THREE.Group()
    scene.add(orbGroup)

    // Inner Glowing Nucleus
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 3)
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x1a0b47,
      emissive: 0x7060f9,
      emissiveIntensity: 0.9,
      specular: 0xd8b4fe,
      shininess: 90,
      transparent: true,
      opacity: 0.9,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    orbGroup.add(coreMesh)

    // Wireframe faceted aura
    const wireGeo = new THREE.IcosahedronGeometry(2.8, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x9d8cf3,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    orbGroup.add(wireMesh)

    // Gyro Rings
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x7060f9, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x9d8cf3, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xc4b5fd, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.08, 16, 80), ringMat1)
    ring1.rotation.x = Math.PI / 3
    orbGroup.add(ring1)

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.06, 16, 80), ringMat2)
    ring2.rotation.y = Math.PI / 4
    ring2.rotation.x = -Math.PI / 6
    orbGroup.add(ring2)

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.05, 16, 80), ringMat3)
    ring3.rotation.z = Math.PI / 2.5
    orbGroup.add(ring3)

    // Bio-spore particles
    const particleCount = 50
    const pGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount)
      const theta = Math.sqrt(particleCount * Math.PI) * phi
      const r = 3.6 + Math.random() * 2.5
      pPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi)
      pPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
      pPositions[i * 3 + 2] = r * Math.cos(phi)
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xd8b4fe,
      size: 0.22,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(pGeo, pMat)
    orbGroup.add(particles)

    // Mouse Parallax
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      if (rect.width > 0) {
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      const pulse = 1 + Math.sin(time * 2.4) * 0.05
      coreMesh.scale.set(pulse, pulse, pulse)

      coreMesh.rotation.y = time * 0.25
      coreMesh.rotation.x = time * 0.15
      wireMesh.rotation.y = -time * 0.35

      ring1.rotation.x = time * 0.45
      ring1.rotation.y = time * 0.25
      ring2.rotation.y = -time * 0.55
      ring2.rotation.z = time * 0.35
      ring3.rotation.z = time * 0.4

      particles.rotation.y = time * 0.18

      orbGroup.rotation.x = THREE.MathUtils.lerp(orbGroup.rotation.x, mouseY * 0.3, 0.05)
      orbGroup.rotation.y = THREE.MathUtils.lerp(orbGroup.rotation.y, mouseX * 0.3, 0.05)

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || 320
      const newH = typeof height === 'number' ? height : container.clientHeight || 280
      camera.aspect = w / newH
      camera.updateProjectionMatrix()
      renderer.setSize(w, newH)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [height])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ height }}
    />
  )
}
