import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Thermometer, RotateCcw } from 'lucide-react';

interface Rescue3DSceneProps {
  className?: string;
}

export const Rescue3DScene: React.FC<Rescue3DSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    // 1. WebGL Support Detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Scene, Camera, & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    // 3. Studio Balanced Lighting (Natural daylight & soft contact warmth)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.0);
    keyLight.position.set(3, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0fdf4, 1.1);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xddebdd, 0.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 4. Object Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Disc Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.45, 0.06, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f0,
      roughness: 0.4,
      metalness: 0.1,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.65;
    pedestal.receiveShadow = true;
    rootGroup.add(pedestal);

    // Subtle Pedestal Rim Ring in Brand Green
    const ringGeo = new THREE.TorusGeometry(1.42, 0.015, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x287653,
      roughness: 0.3,
      metalness: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.62;
    rootGroup.add(ring);

    // 5. INSULATED THERMAL CARRIER BOX (Art-directed model)
    const carrierGroup = new THREE.Group();
    carrierGroup.position.y = -0.15;
    rootGroup.add(carrierGroup);

    // Main Outer Insulated Body
    const bodyGeo = new THREE.BoxGeometry(1.3, 0.75, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    carrierGroup.add(bodyMesh);

    // Protective Top Lid
    const lidGeo = new THREE.BoxGeometry(1.34, 0.1, 0.94);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x287653,
      roughness: 0.3,
      metalness: 0.2,
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 0.42;
    lidMesh.castShadow = true;
    carrierGroup.add(lidMesh);

    // Top Folding Handle
    const handleBarGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 16);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.2,
      metalness: 0.85,
    });
    const handleBar = new THREE.Mesh(handleBarGeo, metalMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, 0.53, 0);
    carrierGroup.add(handleBar);

    // Stainless Steel Dual Front Latches
    const latchGeo = new THREE.BoxGeometry(0.08, 0.16, 0.03);
    const latchL = new THREE.Mesh(latchGeo, metalMat);
    latchL.position.set(-0.35, 0.32, 0.47);
    carrierGroup.add(latchL);

    const latchR = new THREE.Mesh(latchGeo, metalMat);
    latchR.position.set(0.35, 0.32, 0.47);
    carrierGroup.add(latchR);

    // Front Thermal Display Bezel
    const bezelGeo = new THREE.BoxGeometry(0.32, 0.14, 0.02);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.2,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 0.08, 0.46);
    carrierGroup.add(bezel);

    // Status Indicator Light (Soft glowing green)
    const ledGeo = new THREE.SphereGeometry(0.02, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.1, 0.08, 0.475);
    carrierGroup.add(led);

    // 6. Interactive Mouse Drag & Parallax
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0.4;
    let currentRotationY = 0.4;
    let targetRotationX = 0.1;
    let currentRotationX = 0.1;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      prevMouseX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMouseX;
      prevMouseX = clientX;
      targetRotationY += deltaX * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);

    // 7. Render Loop with Smooth Damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!prefersReducedMotion && !isDragging) {
        targetRotationY += delta * 0.25; // Gentle constant rotation
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      rootGroup.rotation.y = currentRotationY;
      rootGroup.rotation.x = currentRotationX;

      // Gentle floating breathing animation
      if (!prefersReducedMotion) {
        carrierGroup.position.y = -0.15 + Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Dispose Three.js objects
      [pedestalGeo, ringGeo, bodyGeo, lidGeo, handleBarGeo, latchGeo, bezelGeo, ledGeo].forEach(
        (g) => g.dispose()
      );
      [pedestalMat, ringMat, bodyMat, lidMat, metalMat, bezelMat, ledMat].forEach((m) =>
        m.dispose()
      );
      renderer.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-white border border-[#E7E8E1] shadow-xs ${className}`}>
        <img
          src="/assets/community_rescue.jpg"
          alt="Insulated food carrier unit"
          className="w-full h-64 object-cover"
        />
        <div className="p-3 bg-white border-t border-[#E7E8E1] text-xs text-[#667067]">
          Insulated Catering Transport Carrier
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Interactive 3D Canvas */}
      <div
        ref={mountRef}
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center"
        title="Click and drag to rotate the food carrier unit"
      />

      {/* Subtle Caption & Inspection Helper */}
      <div className="w-full px-4 py-2.5 bg-[#F0F4EE] rounded-xl border border-[#E7E8E1] flex items-center justify-between text-xs text-[#667067]">
        <div className="flex items-center gap-1.5 font-medium text-[#202820]">
          <Thermometer className="w-3.5 h-3.5 text-[#287653]" />
          <span>Insulated Carrier Vessel (4h+ thermal hold)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#287653] font-semibold">
          <RotateCcw className="w-3 h-3" />
          <span>{isInteracting ? 'Rotating' : 'Drag to inspect'}</span>
        </div>
      </div>
    </div>
  );
};
export default Rescue3DScene;
