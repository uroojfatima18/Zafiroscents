'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface Perfume3DCanvasProps {
  scentName?: string
  scentColor?: string
  accentColor?: string
}

export function Perfume3DCanvas({
  scentName = 'Noir Absolut',
  scentColor = '#C36F43',
  accentColor = '#D4AF37',
}: Perfume3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Scene setup
    const scene = new THREE.Scene()

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0.4, 7.5)

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 4. Lighting setup for Luxury Glass & Liquid
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2)
    scene.add(ambientLight)

    // Warm peach key light
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5)
    keyLight.position.set(5, 6, 5)
    scene.add(keyLight)

    // Golden rim light to accentuate crystal edges
    const rimLight = new THREE.DirectionalLight(0xf4b393, 2.0)
    rimLight.position.set(-5, 4, -3)
    scene.add(rimLight)

    // Internal caustic back light
    const backGlow = new THREE.PointLight(0xff9955, 2.2, 10)
    backGlow.position.set(0, 0, -1.5)
    scene.add(backGlow)

    // Soft top fill
    const topLight = new THREE.DirectionalLight(0xffffff, 1.0)
    topLight.position.set(0, 8, 2)
    scene.add(topLight)

    // 5. Build Perfume Bottle Group
    const bottleGroup = new THREE.Group()
    scene.add(bottleGroup)

    // --- Label Texture Generation on Canvas ---
    const labelCanvas = document.createElement('canvas')
    labelCanvas.width = 512
    labelCanvas.height = 512
    const ctx = labelCanvas.getContext('2d')
    if (ctx) {
      // Warm ivory label background
      ctx.fillStyle = '#FAF4EE'
      ctx.fillRect(0, 0, 512, 512)

      // Gold border
      ctx.strokeStyle = '#C9934E'
      ctx.lineWidth = 10
      ctx.strokeRect(20, 20, 472, 472)

      // Inner thin border
      ctx.lineWidth = 2
      ctx.strokeRect(32, 32, 448, 448)

      // Brand Text
      ctx.fillStyle = '#2D1F17'
      ctx.font = 'bold 44px "Cinzel", "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.letterSpacing = '6px'
      ctx.fillText('ZAFIRO', 256, 170)

      // Thin separator
      ctx.strokeStyle = '#C36F43'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(160, 220)
      ctx.lineTo(352, 220)
      ctx.stroke()

      // Fragrance Name
      ctx.fillStyle = '#C36F43'
      ctx.font = '600 24px "Inter", sans-serif'
      ctx.letterSpacing = '3px'
      ctx.fillText(scentName.toUpperCase(), 256, 265)

      // Subtitle
      ctx.fillStyle = '#7C675B'
      ctx.font = '500 16px "Inter", sans-serif'
      ctx.letterSpacing = '4px'
      ctx.fillText('EXTRAIT DE PARFUM', 256, 325)

      ctx.font = 'italic 15px serif'
      ctx.fillText('100 ML • 3.4 FL. OZ', 256, 365)
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas)

    // Materials
    // Glass Outer Flacon
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      transmission: 0.9,
      roughness: 0.05,
      ior: 1.5,
      reflectivity: 0.9,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })

    // Fragrance Liquid Core
    const liquidColor = new THREE.Color(scentColor)
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: liquidColor,
      transparent: true,
      opacity: 0.88,
      transmission: 0.5,
      roughness: 0.1,
      ior: 1.35,
      attenuationColor: liquidColor,
      attenuationDistance: 1.5,
    })

    // Gold Metal Collar & Atomizer
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      metalness: 0.92,
      roughness: 0.22,
    })

    // Matte Black / Dark Espresso Accents
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x221711,
      roughness: 0.4,
      metalness: 0.2,
    })

    // Label Material
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.5,
      metalness: 0.1,
    })

    // --- Geometries ---
    // 1. Crystal Bottle Body (Chamfered Rectangle / Box)
    const bottleWidth = 2.4
    const bottleHeight = 3.2
    const bottleDepth = 1.3

    const glassBody = new THREE.Mesh(
      new THREE.BoxGeometry(bottleWidth, bottleHeight, bottleDepth, 4, 4, 4),
      glassMaterial
    )
    glassBody.position.y = 0
    bottleGroup.add(glassBody)

    // 2. Inner Fragrance Liquid Core
    const liquidBody = new THREE.Mesh(
      new THREE.BoxGeometry(bottleWidth * 0.86, bottleHeight * 0.82, bottleDepth * 0.84),
      liquidMaterial
    )
    liquidBody.position.y = -0.15
    bottleGroup.add(liquidBody)

    // 3. Thick Crystal Base
    const baseGlass = new THREE.Mesh(
      new THREE.BoxGeometry(bottleWidth * 0.96, 0.4, bottleDepth * 0.96),
      glassMaterial
    )
    baseGlass.position.y = -(bottleHeight / 2) + 0.2
    bottleGroup.add(baseGlass)

    // 4. Front Label Plaque
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.65, 1.8),
      labelMaterial
    )
    labelMesh.position.set(0, 0, (bottleDepth / 2) + 0.005)
    bottleGroup.add(labelMesh)

    // 5. Golden Bottle Shoulder Plate
    const shoulderPlate = new THREE.Mesh(
      new THREE.BoxGeometry(bottleWidth * 0.8, 0.12, bottleDepth * 0.8),
      goldMaterial
    )
    shoulderPlate.position.y = (bottleHeight / 2) + 0.06
    bottleGroup.add(shoulderPlate)

    // 6. Golden Neck / Atomizer Collar
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.42, 0.65, 32),
      goldMaterial
    )
    neckMesh.position.y = (bottleHeight / 2) + 0.4
    bottleGroup.add(neckMesh)

    // 7. Spray Atomizer Nozzle
    const nozzleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 0.45, 32),
      darkMaterial
    )
    nozzleMesh.position.y = (bottleHeight / 2) + 0.8
    bottleGroup.add(nozzleMesh)

    // 8. Heavy Faceted Glass / Gold Cap
    const capGoldBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.2, 32),
      goldMaterial
    )
    capGoldBand.position.y = (bottleHeight / 2) + 0.85
    bottleGroup.add(capGoldBand)

    const mainCap = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.25, 0.95),
      darkMaterial
    )
    mainCap.position.y = (bottleHeight / 2) + 1.45
    bottleGroup.add(mainCap)

    // Cap Golden Top Inset Plate
    const capTopPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.05, 0.75),
      goldMaterial
    )
    capTopPlate.position.y = (bottleHeight / 2) + 2.08
    bottleGroup.add(capTopPlate)

    // --- Ambient Scent Aura Floating Particles ---
    const particleCount = 75
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleScales = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6 + 0.5
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5
      particleScales[i] = Math.random() * 0.06 + 0.02
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf4c29e,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Initial Rotation
    bottleGroup.rotation.y = -0.35
    bottleGroup.rotation.x = 0.08

    // Mouse Tracking / Interaction
    let targetRotationY = -0.35
    let targetRotationX = 0.08
    let isDragging = false
    let previousMouseX = 0
    let previousMouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (!isDragging) {
        targetRotationY = -0.35 + x * 0.65
        targetRotationX = 0.08 - y * 0.35
      } else {
        const deltaX = e.clientX - previousMouseX
        const deltaY = e.clientY - previousMouseY
        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.008
        previousMouseX = e.clientX
        previousMouseY = e.clientY
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      setIsInteracting(true)
      previousMouseX = e.clientX
      previousMouseY = e.clientY
    }

    const onMouseUp = () => {
      isDragging = false
      setIsInteracting(false)
    }

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        setIsInteracting(true)
        previousMouseX = e.touches[0].clientX
        previousMouseY = e.touches[0].clientY
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMouseX
        const deltaY = e.touches[0].clientY - previousMouseY
        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.008
        previousMouseX = e.touches[0].clientX
        previousMouseY = e.touches[0].clientY
      }
    }

    const onTouchEnd = () => {
      isDragging = false
      setIsInteracting(false)
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Smooth floating breathing motion
      bottleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12

      // Gentle continuous ambient rotation if not dragging
      if (!isDragging) {
        targetRotationY += 0.002
      }

      // Smooth lerp interpolation for rotation
      bottleGroup.rotation.y += (targetRotationY - bottleGroup.rotation.y) * 0.06
      bottleGroup.rotation.x += (targetRotationX - bottleGroup.rotation.x) * 0.06

      // Float particles
      const positions = particleGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.003
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = -2.5
        }
      }
      particleGeometry.attributes.position.needsUpdate = true
      particleSystem.rotation.y = elapsedTime * 0.05

      // Light pulsate
      backGlow.intensity = 2.2 + Math.sin(elapsedTime * 2) * 0.4

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      renderer.dispose()
      labelTexture.dispose()
      glassMaterial.dispose()
      liquidMaterial.dispose()
      goldMaterial.dispose()
      darkMaterial.dispose()
      labelMaterial.dispose()
      particleMaterial.dispose()
      particleGeometry.dispose()
    }
  }, [scentName, scentColor, accentColor])

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[580px] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Interactive Helper Badge */}
      <div
        className={`absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-20 px-3 py-1.5 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md border border-white/40 dark:border-white/10 text-[10px] uppercase tracking-widest text-[var(--text)] transition-opacity duration-300 pointer-events-none flex items-center gap-1.5 shadow-xs ${
          isInteracting ? 'opacity-0' : 'opacity-85'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        <span>Drag to rotate 3D bottle</span>
      </div>
    </div>
  )
}
