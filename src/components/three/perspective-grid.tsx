'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface PerspectiveGridProps {
  className?: string
}

export function PerspectiveGrid({ className = '' }: PerspectiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x05030a, 0.0018)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 15, 65)
    camera.lookAt(0, 4, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // Grid Floor
    const gridHelper = new THREE.GridHelper(180, 45, 0x7060f9, 0x1e1045)
    gridHelper.position.y = -22
    if (gridHelper.material instanceof THREE.Material) {
      gridHelper.material.opacity = 0.35
      gridHelper.material.transparent = true
    }
    scene.add(gridHelper)

    // Ambient spore particles
    const sporeCount = 80
    const sporeGeo = new THREE.BufferGeometry()
    const sporePos = new Float32Array(sporeCount * 3)
    for (let i = 0; i < sporeCount; i++) {
      sporePos[i * 3] = (Math.random() - 0.5) * 120
      sporePos[i * 3 + 1] = (Math.random() - 0.5) * 60 + 5
      sporePos[i * 3 + 2] = (Math.random() - 0.5) * 90
    }
    sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3))
    const sporeMat = new THREE.PointsMaterial({
      color: 0x9d8cf3,
      size: 0.4,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const spores = new THREE.Points(sporeGeo, sporeMat)
    scene.add(spores)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      spores.rotation.y = time * 0.015
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
    />
  )
}
