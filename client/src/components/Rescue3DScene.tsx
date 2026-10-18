import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Thermometer, Clock, Sparkles } from 'lucide-react';

interface Rescue3DSceneProps {
  onStageChange?: (stage: number) => void;
}

export const Rescue3DScene: React.FC<Rescue3DSceneProps> = ({ onStageChange }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<number>(1);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    // Check WebGL availability
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

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 480;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e8, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimEmeraldLight = new THREE.DirectionalLight(0x2d8061, 2.0);
    rimEmeraldLight.position.set(-5, 2, -3);
    scene.add(rimEmeraldLight);

    const softFillLight = new THREE.PointLight(0xdcefe2, 1.2, 10);
    softFillLight.position.set(0, -2, 3);
    scene.add(softFillLight);

    // ROOT 3D OBJECT (allows unified rotation & float)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. ELEVATED FLOATING BASE PLATFORM
    const platformGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.12, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.1,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.1;
    platform.receiveShadow = true;
    worldGroup.add(platform);

    // Platform accent ring
    const ringGeo = new THREE.TorusGeometry(2.45, 0.025, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x2d8061,
      roughness: 0.3,
      metalness: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.04;
    worldGroup.add(ring);

    // 2. INSULATED RESCUE CARRIER CRATE (Main 3D hero model)
    const carrierGroup = new THREE.Group();
    worldGroup.add(carrierGroup);

    // Main Box Body (Deep forest green)
    const boxGeo = new THREE.BoxGeometry(1.6, 1.1, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x174c3c,
      roughness: 0.35,
      metalness: 0.2,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    carrierGroup.add(boxMesh);

    // Box Lid (Subtle emerald contrast)
    const lidGeo = new THREE.BoxGeometry(1.68, 0.18, 1.28);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x2d8061,
      roughness: 0.2,
      metalness: 0.3,
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 0.62;
    lidMesh.castShadow = true;
    carrierGroup.add(lidMesh);

    // Corner Protectors (4 polished aluminum brackets)
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0xdcefe2,
      metalness: 0.85,
      roughness: 0.2,
    });
    const bracketGeo = new THREE.BoxGeometry(0.12, 1.14, 0.12);
    [
      [-0.8, 0, -0.6],
      [0.8, 0, -0.6],
      [-0.8, 0, 0.6],
      [0.8, 0, 0.6],
    ].forEach(([x, y, z]) => {
      const b = new THREE.Mesh(bracketGeo, bracketMat);
      b.position.set(x, y, z);
      carrierGroup.add(b);
    });

    // Thermal Insulation Badge / Emblem on front
    const badgeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 32);
    const badgeMat = new THREE.MeshStandardMaterial({
      color: 0xe9b76a, // Warm amber accent
      metalness: 0.7,
      roughness: 0.3,
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, 0.05, 0.62);
    carrierGroup.add(badge);

    // Side Handles
    const handleGeo = new THREE.TorusGeometry(0.18, 0.03, 16, 32, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x66756b, metalness: 0.7 });
    const handleL = new THREE.Mesh(handleGeo, handleMat);
    handleL.rotation.y = Math.PI / 2;
    handleL.rotation.z = Math.PI;
    handleL.position.set(-0.83, 0.1, 0);
    carrierGroup.add(handleL);

    const handleR = new THREE.Mesh(handleGeo, handleMat);
    handleR.rotation.y = -Math.PI / 2;
    handleR.rotation.z = Math.PI;
    handleR.position.set(0.83, 0.1, 0);
    carrierGroup.add(handleR);

    // 3. FLOATING SURPLUS BANQUET SERVING DISH (Warm Brass Accents)
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 0.95, 0);
    worldGroup.add(dishGroup);

    const dishGeo = new THREE.CylinderGeometry(0.65, 0.5, 0.18, 36);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe9b76a,
      roughness: 0.2,
      metalness: 0.85,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.castShadow = true;
    dishGroup.add(dish);

    // Nourishing meal surface (warm amber glow)
    const mealGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.06, 32);
    const mealMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.6,
      emissive: 0x92400e,
      emissiveIntensity: 0.2,
    });
    const meal = new THREE.Mesh(mealGeo, mealMat);
    meal.position.y = 0.08;
    dishGroup.add(meal);

    // 4. CURVED GLOWING DELIVERY ROUTE (3D Spline ribbon)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, -0.6, 1.2), // Donor Banquet
      new THREE.Vector3(-0.9, 0.2, 1.6),
      new THREE.Vector3(0.3, 0.6, 1.1),   // In Transit Insulated
      new THREE.Vector3(1.4, 0.1, 0.8),
      new THREE.Vector3(1.9, -0.5, -0.4), // Community Kitchen
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.035, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x2d8061,
      emissive: 0x174c3c,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.4,
    });
    const routeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    worldGroup.add(routeMesh);

    // Waypoint Sphere Markers
    const waypointsData = [
      { pos: new THREE.Vector3(-1.8, -0.6, 1.2), color: 0x174c3c, label: 'Banquet Close' },
      { pos: new THREE.Vector3(0.3, 0.6, 1.1), color: 0x2d8061, label: 'Insulated Transit' },
      { pos: new THREE.Vector3(1.9, -0.5, -0.4), color: 0xe9b76a, label: 'Community Dining' },
    ];

    const waypointMeshes: THREE.Mesh[] = [];
    waypointsData.forEach((wp) => {
      const wpGeo = new THREE.SphereGeometry(0.12, 24, 24);
      const wpMat = new THREE.MeshStandardMaterial({
        color: wp.color,
        emissive: wp.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.6,
      });
      const wpMesh = new THREE.Mesh(wpGeo, wpMat);
      wpMesh.position.copy(wp.pos);
      worldGroup.add(wpMesh);
      waypointMeshes.push(wpMesh);

      // Surrounding pulse halo
      const haloGeo = new THREE.TorusGeometry(0.18, 0.015, 12, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: wp.color, transparent: true, opacity: 0.6 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(wp.pos);
      halo.rotation.x = Math.PI / 3;
      worldGroup.add(halo);
    });

    // 5. AMBIENT PARTICLES (floating mint specks)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = Math.random() * 3 - 1;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x2d8061,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // MOUSE PARALLAX & ROTATION STATE
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0.35;
    let targetRotationX = 0.15;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = 0.35 + mouseX * 0.45;
      targetRotationX = 0.15 - mouseY * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / world group damping
      worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.05;
      worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.05;

      // Floating oscillation
      carrierGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      dishGroup.position.y = 0.95 + Math.sin(elapsedTime * 1.5 + 0.6) * 0.06;
      dishGroup.rotation.y = elapsedTime * 0.2;

      // Pulse waypoint marker halos
      waypointMeshes.forEach((mesh, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 3 + idx * 2) * 0.12;
        mesh.scale.set(scale, scale, scale);
      });

      // Particle subtle drift
      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 540;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] flex items-center justify-center select-none"
    >
      {/* 3D FLOATING TELEMETRY HUD (Layered glass cards) */}
      <div className="absolute top-4 left-2 sm:left-4 z-10 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md border border-[#E3E8E0] px-3.5 py-2.5 rounded-2xl shadow-xs transition-transform duration-200 hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D8061] animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#174C3C]">
              Active Rescue Mission
            </span>
          </div>
          <div className="text-xs font-semibold text-[#18372D] mt-0.5">
            140 Meals • Insulated Transit
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-2 sm:left-6 z-10 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md border border-[#E3E8E0] px-3.5 py-2 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#DCEFE2] text-[#174C3C]">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#66756B]">Thermal Verification</div>
            <div className="text-xs font-bold text-[#18372D]">68°C Hot Chafing Held</div>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-2 sm:right-6 z-10 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md border border-[#E3E8E0] px-3.5 py-2 rounded-2xl shadow-xs flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#E9B76A]/20 text-[#174C3C]">
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#66756B]">Safe Window</div>
            <div className="text-xs font-bold text-[#18372D]">T-minus 2h 45m</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-2 sm:right-6 z-10 pointer-events-auto">
        <div className="bg-[#EEF4ED] border border-[#E3E8E0] px-3 py-1.5 rounded-xl text-[11px] font-medium text-[#174C3C] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2D8061]" />
          Interactive 3D Stage • Move cursor to inspect
        </div>
      </div>

      {/* FALLBACK FOR UNSUPPORTED WEBGL */}
      {!webglSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#EEF4ED] rounded-3xl border border-[#E3E8E0] text-center">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#174C3C] shadow-sm mb-3">
            <ShieldCheck className="w-8 h-8 text-[#2D8061]" />
          </div>
          <h3 className="text-base font-bold text-[#18372D]">Real-Time Surplus Recovery</h3>
          <p className="text-xs text-[#66756B] max-w-xs mt-1">
            Tracking insulated food containers from banquet closure to dignified community delivery.
          </p>
        </div>
      )}
    </div>
  );
};
