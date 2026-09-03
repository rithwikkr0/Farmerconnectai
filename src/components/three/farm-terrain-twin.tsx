'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface FarmTerrainTwinProps {
  className?: string
  height?: number | string
  cropName?: string
}

export function FarmTerrainTwin({
  className = '',
  height = 380,
  cropName = 'Tomato',
}: FarmTerrainTwinProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const h = typeof height === 'number' ? height : container.clientHeight || 380

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080414, 0.0035)

    const camera = new THREE.PerspectiveCamera(40, width / h, 0.1, 1000)
    camera.position.set(0, 24, 38)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.35
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // Lighting
    const ambient = new THREE.AmbientLight(0x1b0e3e, 2.5)
    scene.add(ambient)

    const keyLight = new THREE.PointLight(0x7060f9, 4.2, 100)
    keyLight.position.set(16, 20, 20)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0x9d8cf3, 3.2, 80)
    rimLight.position.set(-20, 15, -10)
    scene.add(rimLight)

    // Digital Twin Farm Group
    const farmTwin = new THREE.Group()
    scene.add(farmTwin)

    // 1. Terraced Platform
    const topSlabGeo = new THREE.CylinderGeometry(18, 19.5, 2.2, 6)
    const topSlabMat = new THREE.MeshPhongMaterial({
      color: 0x180e34,
      emissive: 0x0e0624,
      specular: 0x7060f9,
      shininess: 35,
      flatShading: true,
    })
    const topSlab = new THREE.Mesh(topSlabGeo, topSlabMat)
    topSlab.position.y = 0.5
    farmTwin.add(topSlab)

    // Wireframe Contour Perimeter
    const wireGeo = new THREE.CylinderGeometry(18.1, 19.6, 2.25, 6)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7060f9,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    farmTwin.add(new THREE.Mesh(wireGeo, wireMat))

    // Subsurface Layer
    const subSlabGeo = new THREE.CylinderGeometry(19.5, 21, 2.8, 6)
    const subSlabMat = new THREE.MeshPhongMaterial({
      color: 0x0e0620,
      emissive: 0x1a0b47,
      emissiveIntensity: 0.45,
      flatShading: true,
    })
    const subSlab = new THREE.Mesh(subSlabGeo, subSlabMat)
    subSlab.position.y = -2.0
    farmTwin.add(subSlab)

    // 2. Field Grid
    const fieldGrid = new THREE.GridHelper(24, 12, 0x9d8cf3, 0x3e2786)
    fieldGrid.position.y = 1.62
    fieldGrid.material.opacity = 0.6
    fieldGrid.material.transparent = true
    farmTwin.add(fieldGrid)

    // Canal
    const canalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12, 1.65, -6),
      new THREE.Vector3(-5, 1.65, -1),
      new THREE.Vector3(2, 1.65, -4),
      new THREE.Vector3(8, 1.65, 3),
      new THREE.Vector3(13, 1.65, 8),
    ])
    const canalGeo = new THREE.TubeGeometry(canalCurve, 28, 0.4, 8, false)
    const canalMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.85 })
    farmTwin.add(new THREE.Mesh(canalGeo, canalMat))

    // 3. Crops
    const stalkMat = new THREE.MeshPhongMaterial({ color: 0x7060f9, emissive: 0x3f2196, shininess: 70 })
    const fruitMat = new THREE.MeshPhongMaterial({ color: 0xe0a7fd, emissive: 0x8249f5, emissiveIntensity: 0.8, shininess: 100 })

    const cropRows = [
      { x: -7, z: 3, n: 4 },
      { x: -4, z: 6, n: 3 },
      { x: 4, z: -6, n: 4 },
      { x: 8, z: -2, n: 4 },
    ]

    cropRows.forEach((r) => {
      for (let i = 0; i < r.n; i++) {
        const plant = new THREE.Group()
        plant.position.set(r.x, 1.6, r.z + (i * 2.0 - r.n))
        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 1.2, 5), stalkMat)
        stalk.position.y = 0.6
        plant.add(stalk)

        const fruit = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 1), fruitMat)
        fruit.position.y = 1.25
        plant.add(fruit)
        farmTwin.add(plant)
      }
    })

    // 4. Pin Beacon
    const pinGroup = new THREE.Group()
    pinGroup.position.set(2, 2.0, -1)
    farmTwin.add(pinGroup)

    const pinHead = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshPhongMaterial({ color: 0x7060f9, emissive: 0x5b38ea, emissiveIntensity: 0.9, shininess: 90 })
    )
    pinHead.position.y = 3.2
    pinGroup.add(pinHead)

    const pinCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.0, 2.2, 16),
      new THREE.MeshPhongMaterial({ color: 0x7060f9, emissive: 0x5b38ea })
    )
    pinCone.rotation.x = Math.PI
    pinCone.position.y = 1.7
    pinGroup.add(pinCone)

    const radarRing = new THREE.Mesh(
      new THREE.RingGeometry(1.0, 1.3, 32),
      new THREE.MeshBasicMaterial({ color: 0xd8b4fe, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    )
    radarRing.rotation.x = -Math.PI / 2
    radarRing.position.y = 0.05
    pinGroup.add(radarRing)

    // 5. Rain particles
    const rainCount = 60
    const rainGeo = new THREE.BufferGeometry()
    const rainPos = new Float32Array(rainCount * 3)
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 22
      rainPos[i * 3 + 1] = Math.random() * 14 + 2
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 22
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3))
    const rainMat = new THREE.PointsMaterial({
      color: 0x9d8cf3,
      size: 0.28,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
    const rainPoints = new THREE.Points(rainGeo, rainMat)
    scene.add(rainPoints)

    // Parallax
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      farmTwin.rotation.y = t * 0.04
      farmTwin.position.y = Math.sin(t * 0.8) * 0.35

      pinGroup.position.y = 2.0 + Math.sin(t * 2.2) * 0.25
      radarRing.scale.setScalar(1 + (Math.sin(t * 3.2) + 1) * 0.3)

      const rArray = rainPoints.geometry.attributes.position?.array as Float32Array | undefined
      if (rArray) {
        for (let i = 0; i < rainCount; i++) {
          const yIdx = i * 3 + 1
          rArray[yIdx] = (rArray[yIdx] ?? 0) - 0.1
          if ((rArray[yIdx] ?? 0) < 1.5) {
            rArray[yIdx] = 15
          }
        }
        rainPoints.geometry.attributes.position.needsUpdate = true
      }

      camera.position.x += (mouseX * 3.5 - camera.position.x) * 0.03
      camera.position.y += (24 + mouseY * 2.5 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || 800
      const newH = typeof height === 'number' ? height : container.clientHeight || 380
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
  }, [height, cropName])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ height }}
    />
  )
}
