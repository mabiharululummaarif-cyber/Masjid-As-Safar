import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HotspotItem, MosqueConfig } from '../types';

interface MosqueCanvas3DProps {
  hotspots: HotspotItem[];
  config: MosqueConfig;
  isInterior: boolean;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: HotspotItem | null) => void;
  isPlacingHotspot?: boolean;
  onPlaceCoordinates?: (pos: [number, number, number]) => void;
  focusPosition?: [number, number, number] | null;
}

export const MosqueCanvas3D: React.FC<MosqueCanvas3DProps> = ({
  hotspots,
  config,
  isInterior,
  selectedHotspotId,
  onSelectHotspot,
  isPlacingHotspot,
  onPlaceCoordinates,
  focusPosition,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Dynamic 3D groups and meshes
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const roofMeshesRef = useRef<THREE.Mesh[]>([]);
  const fanBladesRef = useRef<THREE.Group[]>([]);
  const markersRef = useRef<{ mesh: THREE.Mesh; halo: THREE.Mesh; hotspotId: string; pos: THREE.Vector3 }[]>([]);
  const qiblaGroupRef = useRef<THREE.Group | null>(null);
  const skyCompassRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    sun: THREE.DirectionalLight;
    ambient: THREE.AmbientLight;
    fill: THREE.DirectionalLight;
    hemi: THREE.HemisphereLight;
    indoorLights: THREE.PointLight[];
  } | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);

  // Hotspots and config refs for event handlers without closure staling
  const hotspotsRef = useRef(hotspots);
  hotspotsRef.current = hotspots;
  const isInteriorRef = useRef(isInterior);
  isInteriorRef.current = isInterior;
  const isPlacingRef = useRef(isPlacingHotspot);
  isPlacingRef.current = isPlacingHotspot;
  const configRef = useRef(config);
  configRef.current = config;

  // Camera spherical & first-person interior state with Smooth Damping
  const isPortraitInit = (typeof window !== 'undefined' ? window.innerWidth / Math.max(window.innerHeight, 1) : 1) < 1.0;
  const initialRadius = isPortraitInit ? 46 : 30;

  const camState = useRef({
    // Current smoothed values (used for 60/120fps fluid rendering)
    target: new THREE.Vector3(0, 2.5, 0),
    radius: initialRadius,
    theta: Math.PI / 3.8,
    phi: Math.PI / 2.8,
    fov: 45,
    interiorYaw: 0, // 0 = looking forward towards Mihrab (+Z)
    interiorPitch: 0.05, // 0 = eye level, + = look up at dome/ceiling, - = look down at floor

    // Destination target values (damping target)
    destTarget: new THREE.Vector3(0, 2.5, 0),
    destRadius: initialRadius,
    destTheta: Math.PI / 3.8,
    destPhi: Math.PI / 2.8,
    destFov: 45,
    destInteriorYaw: 0,
    destInteriorPitch: 0.05,

    // Smooth transition animations between presets
    animating: false,
    animStart: 0,
    animDuration: 600,
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
    fromRadius: initialRadius,
    toRadius: initialRadius,
    fromPhi: Math.PI / 2.8,
    toPhi: Math.PI / 2.8,
    fromTheta: Math.PI / 3.8,
    toTheta: Math.PI / 3.8,
    fromYaw: 0,
    toYaw: 0,
    fromPitch: 0.05,
    toPitch: 0.05,
    fromFov: 45,
    toFov: 45,
  });

  // Initialize Scene & Renderer
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xD8DEE4);
    scene.fog = new THREE.Fog(0xD8DEE4, 55, 140);

    // Camera (near = 0.05 to prevent close polygon clipping)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 300);
    cameraRef.current = camera;

    // Renderer (High-Performance Hardware-Accelerated WebGL)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'highp',
      stencil: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Enhanced High-Clarity Lighting (Daylight default: bright, clear, high contrast)
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffaee, 1.40);
    sun.position.set(22, 36, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 28;
    sun.shadow.camera.bottom = -28;
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xeef5f2, 0.65);
    fill.position.set(-20, 18, -18);
    scene.add(fill);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.60);
    scene.add(hemi);

    // 6 Indoor Chandeliers + Mihrab Spotlight for uniform bright interior
    const indoorLights: THREE.PointLight[] = [];
    const lightCoords = [
      [-4.0, 5.2, 6.0],
      [4.0, 5.2, 6.0],
      [-4.0, 5.2, 0],
      [4.0, 5.2, 0],
      [-4.0, 5.2, -6.0],
      [4.0, 5.2, -6.0],
    ];

    lightCoords.forEach(([lx, ly, lz]) => {
      const pl = new THREE.PointLight(0xffecc2, 1.25, 22, 1.2);
      pl.position.set(lx, ly, lz);
      scene.add(pl);
      indoorLights.push(pl);
    });

    const mihrabGlow = new THREE.PointLight(0xffdf88, 1.4, 12, 1.2);
    mihrabGlow.position.set(0, 3.2, 10.5);
    scene.add(mihrabGlow);
    indoorLights.push(mihrabGlow);

    lightsRef.current = { sun, ambient, fill, hemi, indoorLights };

    // Dynamic Root Group
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Helper to generate Canvas Texture Sprite Badges for Compass & Qibla
    const createCompassBadge = (
      mainText: string,
      isQibla = false,
      subText = ''
    ) => {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 100;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, c.width, c.height);

        // Background pill
        ctx.fillStyle = isQibla ? 'rgba(15, 42, 37, 0.96)' : 'rgba(22, 56, 50, 0.90)';
        ctx.beginPath();
        ctx.roundRect(8, 8, 384, 84, 20);
        ctx.fill();

        // Border
        ctx.strokeStyle = isQibla ? '#C9A227' : 'rgba(232, 220, 192, 0.7)';
        ctx.lineWidth = isQibla ? 4.5 : 2.5;
        ctx.stroke();

        if (isQibla) {
          // Double inner gold glow
          ctx.strokeStyle = '#FFEAA7';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(14, 14, 372, 72, 16);
          ctx.stroke();
        }

        // Text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (isQibla) {
          ctx.fillStyle = '#FFEAA7';
          ctx.font = 'bold 30px Georgia, serif';
          ctx.fillText(mainText, 200, subText ? 38 : 50);
          if (subText) {
            ctx.fillStyle = '#E8DCC0';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(subText, 200, 70);
          }
        } else {
          ctx.fillStyle = '#F7F3E8';
          ctx.font = 'bold 26px Georgia, serif';
          ctx.fillText(mainText, 200, subText ? 38 : 50);
          if (subText) {
            ctx.fillStyle = '#C9A227';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(subText, 200, 68);
          }
        }
      }
      const texture = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(mat);
      return sprite;
    };

    // =========================================================================
    // COMPASS & QIBLA 3D NAVIGATION SYSTEM
    // =========================================================================
    const qiblaGroup = new THREE.Group();
    qiblaGroup.visible = false;
    scene.add(qiblaGroup);
    qiblaGroupRef.current = qiblaGroup;

    // Pre-allocated Vector3 objects to prevent GC spikes during 60fps rendering
    const tempLookTarget = new THREE.Vector3();

    // Camera update function with smooth interior look-around & exterior bounds
    const updateCameraPos = () => {
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      const { target, radius, theta, phi, interiorYaw, interiorPitch } = camState.current;

      if (isInteriorRef.current) {
        // Interior: Camera is located at eye-level inside the hall
        cam.position.copy(target);

        // Smooth 360 First-Person / Panoramic look vector (reusing pre-allocated vector)
        const cosPitch = Math.cos(interiorPitch);
        const lookDirX = Math.sin(interiorYaw) * cosPitch;
        const lookDirY = Math.sin(interiorPitch);
        const lookDirZ = Math.cos(interiorYaw) * cosPitch;

        tempLookTarget.set(
          target.x + lookDirX * 10.0,
          target.y + lookDirY * 10.0,
          target.z + lookDirZ * 10.0
        );
        cam.lookAt(tempLookTarget);
      } else {
        // Exterior: Camera orbits around entire building, radius kept >= 16.0m so it NEVER clips into the walls
        const safeRadius = THREE.MathUtils.clamp(radius, 16.0, 70.0);
        const sinPhi = Math.sin(phi);
        cam.position.x = target.x + safeRadius * sinPhi * Math.sin(theta);
        cam.position.y = target.y + safeRadius * Math.cos(phi);
        cam.position.z = target.z + safeRadius * sinPhi * Math.cos(theta);
        cam.lookAt(target);
      }
    };
    updateCameraPos();

    // Mouse / Touch Orbit Controls with Smooth Damping (Ultra-fluid, zero lag/stutter)
    let dragging = false;
    let lastX = 0, lastY = 0;
    let downX = 0, downY = 0;
    let lastHoverCheck = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) {
        // Throttled hover check for cursor pointer (max once every 60ms, non-blocking)
        const now = performance.now();
        if (now - lastHoverCheck > 60 && (markersRef.current.length > 0 || isPlacingRef.current)) {
          lastHoverCheck = now;
          const rect = renderer.domElement.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const visibleMarkerMeshes = markersRef.current
              .filter(m => m.mesh.visible)
              .map(m => m.mesh);

            const hits = raycaster.intersectObjects(visibleMarkerMeshes);
            if (hits.length > 0) {
              renderer.domElement.style.cursor = 'pointer';
            } else if (isPlacingRef.current) {
              renderer.domElement.style.cursor = 'crosshair';
            } else {
              renderer.domElement.style.cursor = 'grab';
            }
          }
        }
        return;
      }

      // Smooth camera drag delta calculation (Lightweight, 0 GC overhead)
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (isInteriorRef.current) {
        // Interior 360 Look:
        // Dragging left (dx < 0) turns camera right (yaw increases)
        // Dragging right (dx > 0) turns camera left (yaw decreases)
        // Dragging up (dy < 0) tilts camera down to floor/carpet (pitch decreases)
        // Dragging down (dy > 0) tilts camera up to chandelier/dome (pitch increases)
        camState.current.destInteriorYaw -= dx * 0.0042;
        camState.current.destInteriorPitch = THREE.MathUtils.clamp(
          camState.current.destInteriorPitch + dy * 0.0042,
          -1.35, // Looking down at carpet
          1.35   // Looking up at dome/ceiling
        );
      } else {
        // Exterior Orbit:
        const minPhi = 0.12;
        const maxPhi = Math.PI / 2 - 0.01;
        camState.current.destTheta -= dx * 0.0042;
        camState.current.destPhi = THREE.MathUtils.clamp(
          camState.current.destPhi - dy * 0.0042,
          minPhi,
          maxPhi
        );
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (moved > 6) return; // Ignore drag release

      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // If in coordinate placing mode
      if (isPlacingRef.current && floorMeshRef.current && onPlaceCoordinates) {
        const floorHits = raycaster.intersectObject(floorMeshRef.current);
        if (floorHits.length > 0) {
          const p = floorHits[0].point;
          onPlaceCoordinates([Number(p.x.toFixed(2)), Number(Math.max(p.y, 0.3).toFixed(2)), Number(p.z.toFixed(2))]);
          return;
        }
      }

      // Check Hotspot Marker click
      const visibleMarkerMeshes = markersRef.current
        .filter(m => m.mesh.visible)
        .map(m => m.mesh);
      const hits = raycaster.intersectObjects(visibleMarkerMeshes);

      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        const hotspotId = hitMesh.userData.hotspotId;
        const found = hotspotsRef.current.find(h => h.id === hotspotId);
        if (found) {
          onSelectHotspot(found);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;

      if (isInteriorRef.current) {
        // Interior Zoom: Smooth field of view (FOV) between 24 deg (close-up) and 72 deg (wide room)
        camState.current.destFov = THREE.MathUtils.clamp(
          camState.current.destFov + e.deltaY * 0.025,
          24,
          72
        );
      } else {
        // Exterior Zoom: Smooth orbit radius
        camState.current.destRadius = THREE.MathUtils.clamp(
          camState.current.destRadius + e.deltaY * 0.016,
          16.0,
          70.0
        );
      }
    };

    // Dedicated Mobile Touch Events (1-finger orbit, 2-finger pinch-to-zoom)
    let touchStartDist = 0;
    let initialTouchRadius = 0;
    let initialTouchFov = 45;
    let touchDragging = false;
    let lastTouchX = 0, lastTouchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchDragging = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        touchDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
        initialTouchRadius = camState.current.destRadius;
        initialTouchFov = camState.current.destFov;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && touchDragging) {
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;

        if (isInteriorRef.current) {
          camState.current.destInteriorYaw -= dx * 0.0048;
          camState.current.destInteriorPitch = THREE.MathUtils.clamp(
            camState.current.destInteriorPitch + dy * 0.0048,
            -1.35,
            1.35
          );
        } else {
          const minPhi = 0.12;
          const maxPhi = Math.PI / 2 - 0.01;
          camState.current.destTheta -= dx * 0.0048;
          camState.current.destPhi = THREE.MathUtils.clamp(
            camState.current.destPhi - dy * 0.0048,
            minPhi,
            maxPhi
          );
        }
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const scale = touchStartDist / Math.max(currentDist, 1);

        if (isInteriorRef.current) {
          camState.current.destFov = THREE.MathUtils.clamp(initialTouchFov * scale, 24, 72);
        } else {
          camState.current.destRadius = THREE.MathUtils.clamp(initialTouchRadius * scale, 16.0, 70.0);
        }
      }
    };

    const onTouchEnd = () => {
      touchDragging = false;
      touchStartDist = 0;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: false });
    dom.addEventListener('touchend', onTouchEnd, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth || window.innerWidth;
      const h = mountRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop with Real-Time Smooth Inertial Interpolation (60/120fps Butter-Smooth)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Camera smooth damping and lerp animation
      if (camState.current.animating) {
        const now = performance.now();
        const progress = Math.min((now - camState.current.animStart) / camState.current.animDuration, 1);
        const t = progress * progress * (3 - 2 * progress); // Hermite cubic smooth easing

        const s = camState.current;
        s.target.lerpVectors(s.fromTarget, s.toTarget, t);
        s.radius = s.fromRadius + (s.toRadius - s.fromRadius) * t;
        s.phi = s.fromPhi + (s.toPhi - s.fromPhi) * t;
        s.theta = s.fromTheta + (s.toTheta - s.fromTheta) * t;
        s.interiorPitch = s.fromPitch + (s.toPitch - s.fromPitch) * t;
        s.interiorYaw = s.fromYaw + (s.toYaw - s.fromYaw) * t;
        s.fov = s.fromFov + (s.toFov - s.fromFov) * t;

        // Keep destinations in sync
        s.destTarget.copy(s.target);
        s.destRadius = s.radius;
        s.destPhi = s.phi;
        s.destTheta = s.theta;
        s.destInteriorPitch = s.interiorPitch;
        s.destInteriorYaw = s.interiorYaw;
        s.destFov = s.fov;

        if (progress >= 1) {
          s.animating = false;
        }
      } else {
        if (configRef.current.autoRotate && !dragging && !touchDragging) {
          // Smooth architectural auto-orbit
          if (isInteriorRef.current) {
            camState.current.destInteriorYaw += 0.0025;
          } else {
            camState.current.destTheta += 0.003;
          }
        }

        // Frame-rate independent exponential damping for ultra-responsive, fluid gliding
        const damp = 1 - Math.exp(-22 * delta);
        const s = camState.current;
        s.target.lerp(s.destTarget, damp);
        s.radius += (s.destRadius - s.radius) * damp;
        s.theta += (s.destTheta - s.theta) * damp;
        s.phi += (s.destPhi - s.phi) * damp;
        s.interiorYaw += (s.destInteriorYaw - s.interiorYaw) * damp;
        s.interiorPitch += (s.destInteriorPitch - s.interiorPitch) * damp;
        s.fov += (s.destFov - s.fov) * damp;
      }

      if (cameraRef.current) {
        if (Math.abs(cameraRef.current.fov - camState.current.fov) > 0.01) {
          cameraRef.current.fov = camState.current.fov;
          cameraRef.current.updateProjectionMatrix();
        }
      }

      updateCameraPos();

      // Static rendering without background moving animations for maximum 60/120fps smoothness
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Handle Time of Day & Lighting (Enhanced brightness across all modes)
  useEffect(() => {
    if (!lightsRef.current || !sceneRef.current) return;
    const { sun, ambient, fill, hemi, indoorLights } = lightsRef.current;
    const scene = sceneRef.current;

    if (config.timeOfDay === 'night') {
      scene.background = new THREE.Color(0x0a1614);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0x0a1614);
      }
      sun.color.setHex(0x7391b0);
      sun.intensity = 0.35;
      ambient.color.setHex(0x223631);
      ambient.intensity = 0.50;
      fill.intensity = 0.30;
      if (hemi) hemi.intensity = 0.35;
      indoorLights.forEach(l => {
        l.intensity = 1.70;
        l.distance = 24;
      });
    } else if (config.timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0x231a24);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0x231a24);
      }
      sun.color.setHex(0xffaa5e);
      sun.intensity = 1.15;
      ambient.color.setHex(0xe8bb97);
      ambient.intensity = 0.65;
      fill.intensity = 0.50;
      if (hemi) hemi.intensity = 0.50;
      indoorLights.forEach(l => {
        l.intensity = 1.40;
        l.distance = 22;
      });
    } else {
      // Day (Comfortable soft studio light grey background)
      scene.background = new THREE.Color(0xD8DEE4);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0xD8DEE4);
      }
      sun.color.setHex(0xfffaee);
      sun.intensity = 1.40;
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.85;
      fill.intensity = 0.65;
      if (hemi) hemi.intensity = 0.60;
      indoorLights.forEach(l => {
        l.intensity = 1.25;
        l.distance = 22;
      });
    }
  }, [config.timeOfDay]);

  // Handle 3D Geometry Rebuilding when Config / Hotspots change
  useEffect(() => {
    if (!dynamicGroupRef.current) return;
    const group = dynamicGroupRef.current;
    // Clear previous children
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }
    roofMeshesRef.current = [];
    fanBladesRef.current = [];
    markersRef.current = [];

    const W = config.width;      // 16
    const D = config.depth;      // 24
    const H = config.height;     // 6.5
    const doorGap = config.doorGap; // 3.6

    // Update point lights positions to match current building scale
    if (lightsRef.current) {
      const lights = lightsRef.current.indoorLights;
      const quarterW = W / 4;
      const quarterD = D / 4;
      const candCoords = [
        [-quarterW, H - 1.2, quarterD],
        [quarterW, H - 1.2, quarterD],
        [-quarterW, H - 1.2, 0],
        [quarterW, H - 1.2, 0],
        [-quarterW, H - 1.2, -quarterD],
        [quarterW, H - 1.2, -quarterD],
      ];
      candCoords.forEach((coord, i) => {
        if (lights[i]) lights[i].position.set(coord[0], coord[1], coord[2]);
      });
      if (lights[6]) lights[6].position.set(0, 3.2, D / 2 - 1.0);
    }

    // Determine roof opacity based on roofMode & isInterior
    let roofOpacity = 1.0;
    if (config.roofMode === 'hidden') {
      roofOpacity = 0.0;
    } else if (config.roofMode === 'transparent') {
      roofOpacity = 0.22;
    } else if (isInterior) {
      roofOpacity = 0.06;
    }

    // ---------- Materials (Warna: Interior Putih Polos, Eksterior Hijau Tua, Hijau Muda & Putih) ----------
    // Interior Putih Polos
    const matInteriorWhite = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.9,
      metalness: 0.02
    });

    // Alias for existing references
    const matSand = matInteriorWhite;

    // Eksterior Hijau Tua
    const matDarkGreen = new THREE.MeshStandardMaterial({
      color: 0x1B4332,
      roughness: 0.5,
      metalness: 0.15,
      transparent: true,
      opacity: roofOpacity,
      side: THREE.DoubleSide
    });

    // Eksterior Hijau Muda
    const matLightGreen = new THREE.MeshStandardMaterial({
      color: 0x40916C,
      roughness: 0.45,
      metalness: 0.15,
      transparent: true,
      opacity: roofOpacity,
      side: THREE.DoubleSide
    });

    const matRoof = matDarkGreen;

    // Aksen Emas & Kuningan
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xC9A227,
      metalness: 0.65,
      roughness: 0.35,
    });

    // Kayu Jati Alami untuk Mimbar & Lemari
    const matDarkWood = new THREE.MeshStandardMaterial({
      color: 0x4A2E18,
      roughness: 0.65,
      metalness: 0.1
    });

    // Kaca Transparan Bersih (High-performance clean glass, depthWrite: false for zero overdraw thrashing)
    const matGlass = new THREE.MeshStandardMaterial({
      color: 0xE8F4F8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.1,
      depthWrite: false,
    });

    // Lantai Keramik Interior Putih Polos
    const matFloor = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Floor Base (Spacious main hall)
    const floorGeo = new THREE.PlaneGeometry(W, D);
    const floor = new THREE.Mesh(floorGeo, matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);
    floorMeshRef.current = floor;

    // =========================================================================
    // ALAS TANAH & PODIUM DASAR BANGUNAN (Solid Pure White Ground & Foundation)
    // =========================================================================
    // 1. Teras / Podium Trap 1 (Pelataran Keliling Masjid - Putih Padat)
    const matPodiumWhite = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.45,
      metalness: 0.02,
    });

    const podium1Geo = new THREE.BoxGeometry(W + 5.0, 0.20, D + 5.0);
    const podium1 = new THREE.Mesh(podium1Geo, matPodiumWhite);
    podium1.position.set(0, -0.10, 0);
    podium1.receiveShadow = true;
    podium1.castShadow = true;
    group.add(podium1);

    // 2. Teras / Podium Trap 2 (Tangga Trap Bawah - Putih Padat)
    const podium2Geo = new THREE.BoxGeometry(W + 7.0, 0.20, D + 7.0);
    const podium2 = new THREE.Mesh(podium2Geo, matPodiumWhite);
    podium2.position.set(0, -0.30, 0);
    podium2.receiveShadow = true;
    podium2.castShadow = true;
    group.add(podium2);

    // 3. Pelataran Plaza Luas / Courtyard (Plaza Pelataran Terang)
    const matPlazaWhite = new THREE.MeshStandardMaterial({
      color: 0xEEF2F5,
      roughness: 0.55,
      metalness: 0.02,
    });
    const plazaGeo = new THREE.BoxGeometry(W + 16.0, 0.20, D + 16.0);
    const plaza = new THREE.Mesh(plazaGeo, matPlazaWhite);
    plaza.position.set(0, -0.50, 0);
    plaza.receiveShadow = true;
    plaza.castShadow = true;
    group.add(plaza);

    // 4. Alas Tanah Luas (Expansive Soft Neutral Studio Ground Base)
    const matGroundEarth = new THREE.MeshStandardMaterial({
      color: 0xD8DEE4,
      roughness: 0.75,
      metalness: 0.0,
    });
    const groundBaseGeo = new THREE.BoxGeometry(160, 0.50, 160);
    const groundBase = new THREE.Mesh(groundBaseGeo, matGroundEarth);
    groundBase.position.set(0, -0.85, 0);
    groundBase.receiveShadow = true;
    group.add(groundBase);

    // 5. Contact Shadow Overlay (Memastikan bayangan jatuh tegas di atas alas tanah putih)
    const shadowPlaneGeo = new THREE.PlaneGeometry(160, 160);
    const matShadow = new THREE.ShadowMaterial({ opacity: 0.22, depthWrite: false });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, matShadow);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.59;
    shadowPlane.receiveShadow = true;
    group.add(shadowPlane);

    // Mosque Structural Frames & Materials (Kusen Putih & Aksen Hijau)
    const matDoorFrame = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      metalness: 0.1,
    });

    const matWhiteFrame = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      metalness: 0.1,
    });

    const matStainless = new THREE.MeshStandardMaterial({
      color: 0xDEE2E6,
      metalness: 0.9,
      roughness: 0.15,
    });

    const matWhiteCeramic = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.25,
      metalness: 0.08,
    });

    const matCeramicGrout = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.8,
    });

    const matPartitionGlass = new THREE.MeshStandardMaterial({
      color: 0xb5e0f2,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Helper to create a Glass Curtain Wall (Dinding Kaca Transparan dengan Kusen & Mullion Modern)
    const createCurtainWall = (
      length: number,
      height: number,
      x: number,
      y: number,
      z: number,
      ry = 0,
      bays = Math.max(1, Math.round(length / 2.0))
    ) => {
      const wallGroup = new THREE.Group();
      const wallThickness = 0.20;
      const curbH = 0.32;
      const topBeamH = 0.32;
      const glassH = height - curbH - topBeamH;
      const bayW = length / bays;

      // 1. Bottom Structural Base Curb (Dado / Plinth - Eksterior Putih Bersih dengan Lis Hijau)
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(length, curbH, wallThickness),
        matInteriorWhite
      );
      curb.position.set(0, curbH / 2, 0);
      curb.castShadow = true;
      curb.receiveShadow = true;
      wallGroup.add(curb);

      // Bottom green accent runner (Hijau Tua)
      const curbGreen = new THREE.Mesh(
        new THREE.BoxGeometry(length + 0.02, 0.06, wallThickness + 0.02),
        matDarkGreen
      );
      curbGreen.position.set(0, curbH + 0.03, 0);
      wallGroup.add(curbGreen);

      // 2. Top Structural Transom Header Beam (Putih Bersih)
      const topBeam = new THREE.Mesh(
        new THREE.BoxGeometry(length, topBeamH, wallThickness),
        matWhiteFrame
      );
      topBeam.position.set(0, height - topBeamH / 2, 0);
      topBeam.castShadow = true;
      wallGroup.add(topBeam);

      // Top green fascia trim (Hijau Muda)
      const topGreen = new THREE.Mesh(
        new THREE.BoxGeometry(length + 0.02, 0.06, wallThickness + 0.02),
        matLightGreen
      );
      topGreen.position.set(0, height - topBeamH - 0.03, 0);
      wallGroup.add(topGreen);

      // 3. Glass Panes & Mullion Grid for each Bay
      const glassY = curbH + glassH / 2;

      for (let i = 0; i < bays; i++) {
        const bayCenterX = -length / 2 + (i + 0.5) * bayW;

        // Large Transparent Glass Panel
        const glassPane = new THREE.Mesh(
          new THREE.BoxGeometry(bayW - 0.08, glassH, 0.04),
          matGlass
        );
        glassPane.position.set(bayCenterX, glassY, 0);
        wallGroup.add(glassPane);

        // Horizontal mid-transom rails
        const midRail1 = new THREE.Mesh(
          new THREE.BoxGeometry(bayW - 0.08, 0.06, 0.08),
          matDoorFrame
        );
        midRail1.position.set(bayCenterX, curbH + glassH * 0.35, 0);
        wallGroup.add(midRail1);

        const midRail2 = new THREE.Mesh(
          new THREE.BoxGeometry(bayW - 0.08, 0.06, 0.08),
          matDoorFrame
        );
        midRail2.position.set(bayCenterX, curbH + glassH * 0.70, 0);
        wallGroup.add(midRail2);
      }

      // Vertical Mullions between bays and at ends
      for (let j = 0; j <= bays; j++) {
        const mullionX = -length / 2 + j * bayW;
        const mullion = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, glassH, wallThickness + 0.04),
          matDoorFrame
        );
        mullion.position.set(mullionX, glassY, 0);
        mullion.castShadow = true;
        wallGroup.add(mullion);

        // Gold vertical pinstripe accent on mullion
        const pinstripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, glassH, wallThickness + 0.06),
          matGold
        );
        pinstripe.position.set(mullionX, glassY, 0);
        wallGroup.add(pinstripe);
      }

      wallGroup.position.set(x, y, z);
      wallGroup.rotation.y = ry;
      group.add(wallGroup);
      return wallGroup;
    };

    // =========================================================================
    // PINTU KACA MODEL AYUN / ENGSEL (DOUBLE SWING HINGED GLASS DOOR)
    // =========================================================================
    // Setiap pintu:
    // - 2 daun kaca ayun dengan engsel di pinggir
    // - Gagang tarik (pull handle) stainless vertikal di tengah tiap daun
    // - Di kiri-kanan pintu ada panel kaca tetap (fixed) dari lantai s/d bawah transom
    // - Di atas pintu ada jendela transom kaca terbagi 4 panel horizontal
    // - Frame keseluruhan berwarna PUTIH
    const createSwingDoor = (
      x: number,
      z: number,
      totalPortalW: number,
      orientation: 'x' | 'z'
    ) => {
      const doorPortalGroup = new THREE.Group();
      const doorH = 2.45; // Height of swing doors & fixed side panels
      const transomH = 0.85; // Height of 4-panel horizontal transom
      const frameT = 0.16; // Thickness of white frame

      // Dimensions breakdown:
      // Center opening for 2 swing doors = 1.80m (0.90m per leaf)
      const centerDoorOpeningW = 1.80;
      const leafW = 0.88;
      const leafH = doorH - 0.06;
      const fixedPanelW = (totalPortalW - centerDoorOpeningW) / 2; // Fixed glass on left & right

      const subGroup = new THREE.Group();

      // 1. Outer White Perimeter Jamb & Base/Top Beams
      // Base threshold
      const baseCurb = new THREE.Mesh(new THREE.BoxGeometry(totalPortalW, 0.08, frameT), matWhiteFrame);
      baseCurb.position.set(0, 0.04, 0);
      subGroup.add(baseCurb);

      // Transom Mid-Beam (Horizontal beam dividing doors from transom)
      const transomBeam = new THREE.Mesh(new THREE.BoxGeometry(totalPortalW, 0.10, frameT + 0.02), matWhiteFrame);
      transomBeam.position.set(0, doorH + 0.05, 0);
      transomBeam.castShadow = true;
      subGroup.add(transomBeam);

      // Top Portal Header Beam
      const topPortalBeam = new THREE.Mesh(new THREE.BoxGeometry(totalPortalW, 0.12, frameT + 0.02), matWhiteFrame);
      topPortalBeam.position.set(0, doorH + transomH + 0.06, 0);
      topPortalBeam.castShadow = true;
      subGroup.add(topPortalBeam);

      // Left & Right Outer Vertical Jambs
      const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.12, doorH + transomH + 0.12, frameT), matWhiteFrame);
      jambL.position.set(-totalPortalW / 2 + 0.06, (doorH + transomH + 0.12) / 2, 0);
      subGroup.add(jambL);

      const jambR = new THREE.Mesh(new THREE.BoxGeometry(0.12, doorH + transomH + 0.12, frameT), matWhiteFrame);
      jambR.position.set(totalPortalW / 2 - 0.06, (doorH + transomH + 0.12) / 2, 0);
      subGroup.add(jambR);

      // Inner Vertical Mullions separating Fixed Side Panels from Swing Door Opening
      const mullionL = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, frameT), matWhiteFrame);
      mullionL.position.set(-centerDoorOpeningW / 2, doorH / 2, 0);
      subGroup.add(mullionL);

      const mullionR = new THREE.Mesh(new THREE.BoxGeometry(0.08, doorH, frameT), matWhiteFrame);
      mullionR.position.set(centerDoorOpeningW / 2, doorH / 2, 0);
      subGroup.add(mullionR);

      // 2. FIXED GLASS SIDE PANELS (Kiri & Kanan Pintu dari lantai s/d bawah transom)
      // Left Fixed Glass Panel
      const fixedGlassL = new THREE.Mesh(
        new THREE.BoxGeometry(fixedPanelW - 0.10, doorH - 0.12, 0.04),
        matGlass
      );
      fixedGlassL.position.set(-totalPortalW / 2 + fixedPanelW / 2, doorH / 2, 0);
      subGroup.add(fixedGlassL);

      // Right Fixed Glass Panel
      const fixedGlassR = new THREE.Mesh(
        new THREE.BoxGeometry(fixedPanelW - 0.10, doorH - 0.12, 0.04),
        matGlass
      );
      fixedGlassR.position.set(totalPortalW / 2 - fixedPanelW / 2, doorH / 2, 0);
      subGroup.add(fixedGlassR);

      // 3. JENDELA TRANSOM KACA TERBAGI 4 PANEL HORIZONTAL (Di atas pintu)
      const transomGlassY = doorH + 0.10 + (transomH - 0.10) / 2;
      const transomBayW = totalPortalW / 4;
      for (let tp = 0; tp < 4; tp++) {
        const transCenterX = -totalPortalW / 2 + (tp + 0.5) * transomBayW;
        const transGlass = new THREE.Mesh(
          new THREE.BoxGeometry(transomBayW - 0.06, transomH - 0.12, 0.035),
          matGlass
        );
        transGlass.position.set(transCenterX, transomGlassY, 0);
        subGroup.add(transGlass);

        // Vertical transom divider mullion
        if (tp < 3) {
          const transDiv = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, transomH - 0.04, frameT),
            matWhiteFrame
          );
          transDiv.position.set(-totalPortalW / 2 + (tp + 1) * transomBayW, transomGlassY, 0);
          subGroup.add(transDiv);
        }
      }

      // 4. DUA DAUN PINTU KACA AYUN / ENGSEL (DOUBLE SWING LEAVES)
      // A. Daun Pintu Kiri (Hinged on Left edge)
      const leafGroupL = new THREE.Group();
      // Glass Pane
      const leafGlassL = new THREE.Mesh(new THREE.BoxGeometry(leafW - 0.08, leafH - 0.08, 0.04), matGlass);
      leafGlassL.position.set(leafW / 2, leafH / 2, 0);
      leafGroupL.add(leafGlassL);

      // White perimeter frame for Leaf Left
      const leafTopL = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.06, 0.06), matWhiteFrame);
      leafTopL.position.set(leafW / 2, leafH - 0.03, 0);
      leafGroupL.add(leafTopL);
      const leafBotL = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.10, 0.06), matWhiteFrame);
      leafBotL.position.set(leafW / 2, 0.05, 0);
      leafGroupL.add(leafBotL);
      const leafStileL1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, 0.06), matWhiteFrame);
      leafStileL1.position.set(0.03, leafH / 2, 0);
      leafGroupL.add(leafStileL1);
      const leafStileL2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, 0.06), matWhiteFrame);
      leafStileL2.position.set(leafW - 0.03, leafH / 2, 0);
      leafGroupL.add(leafStileL2);

      // 3 Stainless Steel Hinges on Left Edge
      for (let hg = 0; hg < 3; hg++) {
        const hingeY = 0.35 + hg * 0.82;
        const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.10, 10), matStainless);
        hinge.position.set(0.01, hingeY, 0);
        leafGroupL.add(hinge);
      }

      // Vertical Stainless Pull Handle (Gagang Tarik Model Stainless Vertikal)
      const handleL = new THREE.Group();
      const hBarL = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.05, 12), matStainless);
      hBarL.position.set(0, 0, 0.06);
      handleL.add(hBarL);
      // Top & Bottom Standoffs
      const standOffT_L = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffT_L.rotation.x = Math.PI / 2;
      standOffT_L.position.set(0, 0.42, 0.03);
      handleL.add(standOffT_L);
      const standOffB_L = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffB_L.rotation.x = Math.PI / 2;
      standOffB_L.position.set(0, -0.42, 0.03);
      handleL.add(standOffB_L);
      // Double sided (inner handle)
      const hBarL_In = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.05, 12), matStainless);
      hBarL_In.position.set(0, 0, -0.06);
      handleL.add(hBarL_In);
      const standOffT_L_In = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffT_L_In.rotation.x = Math.PI / 2;
      standOffT_L_In.position.set(0, 0.42, -0.03);
      handleL.add(standOffT_L_In);
      const standOffB_L_In = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffB_L_In.rotation.x = Math.PI / 2;
      standOffB_L_In.position.set(0, -0.42, -0.03);
      handleL.add(standOffB_L_In);

      handleL.position.set(leafW - 0.12, 1.15, 0);
      leafGroupL.add(handleL);

      // Position Left Leaf at hinge pivot
      leafGroupL.position.set(-centerDoorOpeningW / 2 + 0.01, 0.04, 0);
      subGroup.add(leafGroupL);

      // B. Daun Pintu Kanan (Hinged on Right edge)
      const leafGroupR = new THREE.Group();
      // Glass Pane
      const leafGlassR = new THREE.Mesh(new THREE.BoxGeometry(leafW - 0.08, leafH - 0.08, 0.04), matGlass);
      leafGlassR.position.set(-leafW / 2, leafH / 2, 0);
      leafGroupR.add(leafGlassR);

      // White perimeter frame for Leaf Right
      const leafTopR = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.06, 0.06), matWhiteFrame);
      leafTopR.position.set(-leafW / 2, leafH - 0.03, 0);
      leafGroupR.add(leafTopR);
      const leafBotR = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.10, 0.06), matWhiteFrame);
      leafBotR.position.set(-leafW / 2, 0.05, 0);
      leafGroupR.add(leafBotR);
      const leafStileR1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, 0.06), matWhiteFrame);
      leafStileR1.position.set(-0.03, leafH / 2, 0);
      leafGroupR.add(leafStileR1);
      const leafStileR2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, 0.06), matWhiteFrame);
      leafStileR2.position.set(-leafW + 0.03, leafH / 2, 0);
      leafGroupR.add(leafStileR2);

      // 3 Stainless Steel Hinges on Right Edge
      for (let hg = 0; hg < 3; hg++) {
        const hingeY = 0.35 + hg * 0.82;
        const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.10, 10), matStainless);
        hinge.position.set(-0.01, hingeY, 0);
        leafGroupR.add(hinge);
      }

      // Vertical Stainless Pull Handle
      const handleR = new THREE.Group();
      const hBarR = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.05, 12), matStainless);
      hBarR.position.set(0, 0, 0.06);
      handleR.add(hBarR);
      const standOffT_R = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffT_R.rotation.x = Math.PI / 2;
      standOffT_R.position.set(0, 0.42, 0.03);
      handleR.add(standOffT_R);
      const standOffB_R = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffB_R.rotation.x = Math.PI / 2;
      standOffB_R.position.set(0, -0.42, 0.03);
      handleR.add(standOffB_R);
      // Double sided (inner handle)
      const hBarR_In = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.05, 12), matStainless);
      hBarR_In.position.set(0, 0, -0.06);
      handleR.add(hBarR_In);
      const standOffT_R_In = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffT_R_In.rotation.x = Math.PI / 2;
      standOffT_R_In.position.set(0, 0.42, -0.03);
      handleR.add(standOffT_R_In);
      const standOffB_R_In = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), matStainless);
      standOffB_R_In.rotation.x = Math.PI / 2;
      standOffB_R_In.position.set(0, -0.42, -0.03);
      handleR.add(standOffB_R_In);

      handleR.position.set(-leafW + 0.12, 1.15, 0);
      leafGroupR.add(handleR);

      // Position Right Leaf at hinge pivot
      leafGroupR.position.set(centerDoorOpeningW / 2 - 0.01, 0.04, 0);
      subGroup.add(leafGroupR);

      // 5. Wall segment above the transom (Curtain glass header up to roof H)
      const upperWallH = H - (doorH + transomH + 0.12);
      if (upperWallH > 0.1) {
        const upperGlass = new THREE.Mesh(
          new THREE.BoxGeometry(totalPortalW - 0.16, upperWallH - 0.08, 0.04),
          matGlass
        );
        upperGlass.position.set(0, doorH + transomH + 0.12 + upperWallH / 2, 0);
        subGroup.add(upperGlass);

        const upperBeam = new THREE.Mesh(new THREE.BoxGeometry(totalPortalW, 0.12, frameT), matWhiteFrame);
        upperBeam.position.set(0, H - 0.06, 0);
        subGroup.add(upperBeam);
      }

      if (orientation === 'z') {
        subGroup.rotation.y = Math.PI / 2;
      }

      doorPortalGroup.add(subGroup);
      doorPortalGroup.position.set(x, 0, z);
      group.add(doorPortalGroup);
      return doorPortalGroup;
    };

    // =========================================================================
    // POSISI 3 PINTU KACA AYUN SESUAI ARSITEKTUR FINAL:
    // 1. Pintu samping KIRI — di dinding kiri (X = -W/2), area belakang-tengah (Z = -3.5)
    // 2. Pintu samping KANAN — di dinding kanan (X = +W/2), area belakang-tengah (Z = -3.5)
    // 3. Pintu BELAKANG TENGAH — di tengah dinding belakang (Z = -D/2, X = 0)
    // DINDING DEPAN (+Z) TIDAK ADA PINTU!
    // =========================================================================
    const doorPortalW = 3.6;
    const doorSideZ = -3.5; // Area belakang-tengah

    // 1. Back Wall (-Z) with Center Swing Glass Door
    const backWallSegW = (W - doorPortalW) / 2;
    createCurtainWall(backWallSegW, H, -W / 2 + backWallSegW / 2, 0, -D / 2, 0, Math.max(1, Math.round(backWallSegW / 2.0)));
    createCurtainWall(backWallSegW, H, W / 2 - backWallSegW / 2, 0, -D / 2, 0, Math.max(1, Math.round(backWallSegW / 2.0)));
    createSwingDoor(0, -D / 2, doorPortalW, 'x');

    // 2. Left Wall (-X) with Swing Glass Door at Z = -3.5
    // Front segment: from Z = +D/2 to (doorSideZ + doorPortalW/2)
    const leftFrontSegLen = D / 2 - (doorSideZ + doorPortalW / 2);
    const leftFrontSegCenterZ = (D / 2 + (doorSideZ + doorPortalW / 2)) / 2;
    createCurtainWall(leftFrontSegLen, H, -W / 2, 0, leftFrontSegCenterZ, Math.PI / 2, Math.max(1, Math.round(leftFrontSegLen / 2.0)));

    // Back segment: from (doorSideZ - doorPortalW/2) to -D/2
    const leftBackSegLen = (doorSideZ - doorPortalW / 2) - (-D / 2);
    const leftBackSegCenterZ = ((doorSideZ - doorPortalW / 2) + (-D / 2)) / 2;
    createCurtainWall(leftBackSegLen, H, -W / 2, 0, leftBackSegCenterZ, Math.PI / 2, Math.max(1, Math.round(leftBackSegLen / 2.0)));

    // Left Door
    createSwingDoor(-W / 2, doorSideZ, doorPortalW, 'z');

    // 3. Right Wall (+X) with Swing Glass Door at Z = -3.5 (Symmetrical)
    createCurtainWall(leftFrontSegLen, H, W / 2, 0, leftFrontSegCenterZ, Math.PI / 2, Math.max(1, Math.round(leftFrontSegLen / 2.0)));
    createCurtainWall(leftBackSegLen, H, W / 2, 0, leftBackSegCenterZ, Math.PI / 2, Math.max(1, Math.round(leftBackSegLen / 2.0)));
    createSwingDoor(W / 2, doorSideZ, doorPortalW, 'z');

    // 4. Front Wall (+Z, Mihrab/Front side) - Full Glass Curtain Wall (NO DOOR!)
    createCurtainWall(W, H, 0, 0, D / 2, 0, Math.round(W / 2.0));

    // ==========================================
    // 5. DUA RUANGAN TAMBAHAN SIMETRIS DI DEPAN
    // ==========================================
    const roomW = 3.4;
    const roomD = 3.6;
    const roomH = 3.4;
    const roomCenterZ = D / 2 - roomD / 2 - 0.15;
    const roomRightX = W / 2 - roomW / 2 - 0.15;
    const roomLeftX = -W / 2 + roomW / 2 + 0.15;

    // Helper to build a front room (Ruang Imam di Kanan & Ruang Marbot di Kiri)
    const createFrontRoom = (centerX: number, isRightSide: boolean) => {
      const rGroup = new THREE.Group();

      // Back partition wall facing main hall
      const innerWallZ = -roomD / 2;
      const backPartition = new THREE.Mesh(
        new THREE.BoxGeometry(roomW, roomH, 0.10),
        matSand
      );
      backPartition.position.set(0, roomH / 2, innerWallZ);
      backPartition.castShadow = true;
      rGroup.add(backPartition);

      // Glass window in back partition
      const backWin = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.2, 0.04),
        matPartitionGlass
      );
      backWin.position.set(isRightSide ? -0.6 : 0.6, 1.8, innerWallZ);
      rGroup.add(backWin);

      // Inner side partition facing center
      const innerSideX = isRightSide ? -roomW / 2 : roomW / 2;
      const sidePartition = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, roomH, roomD),
        matSand
      );
      sidePartition.position.set(innerSideX, roomH / 2, 0);
      sidePartition.castShadow = true;
      rGroup.add(sidePartition);

      // Door opening in inner partition wall with door frame & wooden door
      const doorLeafW = 0.9;
      const doorLeafH = 2.3;
      const doorZ = 0.4;
      const roomDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, doorLeafH, doorLeafW),
        matDarkWood
      );
      roomDoor.position.set(innerSideX, doorLeafH / 2, doorZ);
      rGroup.add(roomDoor);

      // Room door gold handle
      const roomDoorHandle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12),
        matGold
      );
      roomDoorHandle.position.set(innerSideX + (isRightSide ? 0.06 : -0.06), 1.1, doorZ + 0.32);
      rGroup.add(roomDoorHandle);

      // Room Ceiling / Roof Cap (Putih Polos)
      const roomCeiling = new THREE.Mesh(
        new THREE.BoxGeometry(roomW, 0.12, roomD),
        matInteriorWhite
      );
      roomCeiling.position.set(0, roomH + 0.06, 0);
      rGroup.add(roomCeiling);

      // Gold Trim around ceiling
      const ceilingGold = new THREE.Mesh(new THREE.BoxGeometry(roomW + 0.08, 0.05, roomD + 0.08), matGold);
      ceilingGold.position.set(0, roomH + 0.12, 0);
      rGroup.add(ceilingGold);

      // Interior Furniture for the room
      if (isRightSide) {
        // Ruang Imam & Sound System: Central Audio Rack + Desk
        const soundRack = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 1.3, 0.6),
          new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 })
        );
        soundRack.position.set(0.6, 0.65, 0.8);
        rGroup.add(soundRack);

        // Glowing LED display meters on sound rack
        const ledMeter = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4, 0.2),
          new THREE.MeshBasicMaterial({ color: 0x38ef7d })
        );
        ledMeter.position.set(0.6, 1.0, 0.49);
        rGroup.add(ledMeter);

        // Desk
        const desk = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 0.75, 0.7),
          matDarkWood
        );
        desk.position.set(-0.5, 0.375, 0.8);
        rGroup.add(desk);
      } else {
        // Ruang Marbot & Khazanah: Storage Wardrobe & Shelf
        const storageCabinet = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 2.0, 0.55),
          matDarkWood
        );
        storageCabinet.position.set(-0.4, 1.0, 0.8);
        rGroup.add(storageCabinet);

        // Shelving unit for mukena & sarung
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 1.5, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.7 })
        );
        shelf.position.set(0.7, 0.75, 0.8);
        rGroup.add(shelf);
      }

      rGroup.position.set(centerX, 0, roomCenterZ);
      group.add(rGroup);
      return rGroup;
    };

    // Build Right Front Room (Ruang Imam & Sound System)
    createFrontRoom(roomRightX, true);

    // Build Left Front Room (Ruang Marbot & Khazanah Inventaris)
    createFrontRoom(roomLeftX, false);

    // ==========================================
    // 6. ROOF STRUCTURE & DUAL DOMES
    // "Di dalam putih polos, di luar hijau tua, hijau muda dan putih"
    // ==========================================
    // Dak Atap Utama - Hijau Tua
    const roofBase = new THREE.Mesh(new THREE.BoxGeometry(W + 0.8, 0.45, D + 0.8), matDarkGreen);
    roofBase.position.set(0, H + 0.225, 0);
    roofBase.castShadow = true;
    group.add(roofBase);
    roofMeshesRef.current.push(roofBase);

    // Lis Profil Atap Keliling - Hijau Muda
    const roofCornice = new THREE.Mesh(new THREE.BoxGeometry(W + 0.95, 0.12, D + 0.95), matLightGreen);
    roofCornice.position.set(0, H + 0.45 + 0.06, 0);
    group.add(roofCornice);
    roofMeshesRef.current.push(roofCornice);

    // A. GRAND CENTRAL DOME (Kubah Utama Tengah)
    const centralDomeRadius = 3.6;
    // Drum Kubah Tengah - Putih Bersih dengan Cincin Lis Hijau Muda
    const centralDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(centralDomeRadius + 0.2, centralDomeRadius + 0.3, 0.6, 32),
      matInteriorWhite
    );
    centralDrum.position.set(0, H + 0.45 + 0.3, 0);
    group.add(centralDrum);
    roofMeshesRef.current.push(centralDrum);

    const centralDrumRing = new THREE.Mesh(
      new THREE.CylinderGeometry(centralDomeRadius + 0.32, centralDomeRadius + 0.32, 0.08, 32),
      matLightGreen
    );
    centralDrumRing.position.set(0, H + 0.45 + 0.1, 0);
    group.add(centralDrumRing);
    roofMeshesRef.current.push(centralDrumRing);

    // Kubah Utama Tengah - Hijau Tua
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(centralDomeRadius, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2),
      matDarkGreen
    );
    dome.position.set(0, H + 0.45 + 0.6, 0);
    dome.castShadow = true;
    group.add(dome);
    roofMeshesRef.current.push(dome);

    // Cincin Dasar Kubah Tengah - Lis Hijau Muda
    const centralDomeBaseRing = new THREE.Mesh(
      new THREE.TorusGeometry(centralDomeRadius + 0.02, 0.05, 10, 36),
      matLightGreen
    );
    centralDomeBaseRing.rotation.x = Math.PI / 2;
    centralDomeBaseRing.position.set(0, H + 0.45 + 0.6, 0);
    group.add(centralDomeBaseRing);
    roofMeshesRef.current.push(centralDomeBaseRing);

    // Rusuk Kubah Tengah - Lis Hijau Muda Vertikal (Meridian Arches)
    for (let r = 0; r < 8; r++) {
      const ribAngle = (r / 8) * Math.PI;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(centralDomeRadius + 0.02, 0.035, 8, 32, Math.PI),
        matLightGreen
      );
      rib.rotation.y = ribAngle;
      rib.position.set(0, H + 0.45 + 0.6, 0);
      group.add(rib);
      roofMeshesRef.current.push(rib);
    }

    const finialPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12), matGold);
    finialPole.position.set(0, H + 0.45 + 0.6 + centralDomeRadius + 0.9, 0);
    group.add(finialPole);
    roofMeshesRef.current.push(finialPole);

    const finialCone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.1, 12), matGold);
    finialCone.position.set(0, H + 0.45 + 0.6 + centralDomeRadius + 0.8, 0);
    group.add(finialCone);
    roofMeshesRef.current.push(finialCone);

    const crescentGeo = new THREE.TorusGeometry(0.42, 0.07, 12, 24, Math.PI * 1.5);
    const crescent = new THREE.Mesh(crescentGeo, matGold);
    crescent.position.set(0, H + 0.45 + 0.6 + centralDomeRadius + 1.8, 0);
    crescent.rotation.z = Math.PI * 0.25;
    group.add(crescent);
    roofMeshesRef.current.push(crescent);

    // B. FRONT DOME ABOVE MIMBAR/MIHRAB (Kubah Depan Penanda Mimbar & Arah Kiblat)
    const frontDomeZ = D / 2 - 3.2;
    const frontDomeRadius = 2.4;

    // Front Dome Base Drum - Putih Bersih dengan Cincin Lis Hijau Muda
    const frontDomeDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(frontDomeRadius + 0.2, frontDomeRadius + 0.3, 0.55, 24),
      matInteriorWhite
    );
    frontDomeDrum.position.set(0, H + 0.45 + 0.275, frontDomeZ);
    group.add(frontDomeDrum);
    roofMeshesRef.current.push(frontDomeDrum);

    const frontDrumRing = new THREE.Mesh(
      new THREE.CylinderGeometry(frontDomeRadius + 0.32, frontDomeRadius + 0.32, 0.08, 24),
      matLightGreen
    );
    frontDrumRing.position.set(0, H + 0.45 + 0.08, frontDomeZ);
    group.add(frontDrumRing);
    roofMeshesRef.current.push(frontDrumRing);

    // Front Dome Hemisphere - Hijau Tua
    const frontDome = new THREE.Mesh(
      new THREE.SphereGeometry(frontDomeRadius, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      matDarkGreen
    );
    frontDome.position.set(0, H + 0.45 + 0.55, frontDomeZ);
    frontDome.castShadow = true;
    group.add(frontDome);
    roofMeshesRef.current.push(frontDome);

    // Cincin Dasar Kubah Depan - Lis Hijau Muda
    const frontDomeBaseRing = new THREE.Mesh(
      new THREE.TorusGeometry(frontDomeRadius + 0.02, 0.04, 10, 28),
      matLightGreen
    );
    frontDomeBaseRing.rotation.x = Math.PI / 2;
    frontDomeBaseRing.position.set(0, H + 0.45 + 0.55, frontDomeZ);
    group.add(frontDomeBaseRing);
    roofMeshesRef.current.push(frontDomeBaseRing);

    // Front Dome Meridian Ribs - Lis Hijau Muda Vertikal
    for (let fr = 0; fr < 6; fr++) {
      const fAngle = (fr / 6) * Math.PI;
      const fRib = new THREE.Mesh(
        new THREE.TorusGeometry(frontDomeRadius + 0.02, 0.03, 8, 24, Math.PI),
        matLightGreen
      );
      fRib.rotation.y = fAngle;
      fRib.position.set(0, H + 0.45 + 0.55, frontDomeZ);
      group.add(fRib);
      roofMeshesRef.current.push(fRib);
    }

    // Front Dome Finial & Crescent
    const fFinialPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 10), matGold);
    fFinialPole.position.set(0, H + 0.45 + 0.55 + frontDomeRadius + 0.7, frontDomeZ);
    group.add(fFinialPole);
    roofMeshesRef.current.push(fFinialPole);

    const fFinialCone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 10), matGold);
    fFinialCone.position.set(0, H + 0.45 + 0.55 + frontDomeRadius + 0.65, frontDomeZ);
    group.add(fFinialCone);
    roofMeshesRef.current.push(fFinialCone);

    const fCrescent = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.055, 10, 20, Math.PI * 1.5), matGold);
    fCrescent.position.set(0, H + 0.45 + 0.55 + frontDomeRadius + 1.4, frontDomeZ);
    fCrescent.rotation.z = Math.PI * 0.25;
    group.add(fCrescent);
    roofMeshesRef.current.push(fCrescent);

    // ==========================================
    // 7. MIMBAR, STEPPED WALL NICHE & DIGITAL JAM
    // ==========================================
    // Digital Jam Sholat Running Text Board
    const jamBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.65, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.6 })
    );
    jamBoard.position.set(0, 4.8, D / 2 - 0.22);
    group.add(jamBoard);

    // Stepped Decorative Wall Niche & Mihrab Framing (Lis/perbedaan ketinggian dinding mimbar)
    const mihrabWallGroup = new THREE.Group();
    // Layer 1 (Outer stepped arch tier)
    const stepArch1 = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 5.0, 0.12),
      matSand
    );
    stepArch1.position.set(-1.3, 2.5, D / 2 - 0.12);
    mihrabWallGroup.add(stepArch1);

    // Gold outer molding trim
    const trim1 = new THREE.Mesh(new THREE.BoxGeometry(5.26, 0.08, 0.16), matGold);
    trim1.position.set(-1.3, 5.04, D / 2 - 0.12);
    mihrabWallGroup.add(trim1);

    // Layer 2 (Middle stepped arch tier - Putih Polos)
    const stepArch2 = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 4.4, 0.14),
      matInteriorWhite
    );
    stepArch2.position.set(-1.3, 2.2, D / 2 - 0.16);
    mihrabWallGroup.add(stepArch2);

    const trim2 = new THREE.Mesh(new THREE.BoxGeometry(3.86, 0.08, 0.18), matGold);
    trim2.position.set(-1.3, 4.44, D / 2 - 0.16);
    mihrabWallGroup.add(trim2);

    // Layer 3 (Inner stepped niche backpanel with gold calligraphy arch)
    const stepArch3 = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.8, 0.16),
      matDarkWood
    );
    stepArch3.position.set(-1.3, 1.9, D / 2 - 0.20);
    mihrabWallGroup.add(stepArch3);

    const innerArchMolding = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.05, 8, 24, Math.PI),
      matGold
    );
    innerArchMolding.position.set(-1.3, 3.2, D / 2 - 0.28);
    mihrabWallGroup.add(innerArchMolding);

    group.add(mihrabWallGroup);

    // MIMBAR JATI UKIR
    // Posisi: "agak ke kolom kiri-tengah dari sudut pandang orang menghadap kiblat" (X = -1.3, Z = D/2 - 2.8)
    const mimbarX = -1.3;
    const mimbarZ = D / 2 - 2.8;
    const mimbarGroup = new THREE.Group();

    // 3 Stepped Wooden Tiers (Trap Tangga Mimbar)
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.6 - i * 0.22, 0.26, 1.3 - i * 0.24),
        matDarkWood
      );
      step.position.set(0, 0.13 + i * 0.26, -i * 0.12);
      step.castShadow = true;
      mimbarGroup.add(step);

      // Gold step edge pinstripe
      const stepPinstripe = new THREE.Mesh(
        new THREE.BoxGeometry(1.62 - i * 0.22, 0.03, 1.32 - i * 0.24),
        matGold
      );
      stepPinstripe.position.set(0, 0.26 + i * 0.26, -i * 0.12);
      mimbarGroup.add(stepPinstripe);
    }

    // Mimbar podium railing & carved lattice screen
    const podiumRailing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 0.12), matDarkWood);
    podiumRailing.position.set(0, 1.25, -0.36);
    mimbarGroup.add(podiumRailing);

    const podiumRailingGold = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.06, 0.14), matGold);
    podiumRailingGold.position.set(0, 1.68, -0.36);
    mimbarGroup.add(podiumRailingGold);

    // Microphone Gooseneck Condenser & Rehal
    const micPole = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.45, 8), matGold);
    micPole.position.set(-0.25, 1.85, -0.36);
    micPole.rotation.z = -0.2;
    mimbarGroup.add(micPole);

    const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matGold);
    micHead.position.set(-0.20, 2.05, -0.36);
    mimbarGroup.add(micHead);

    mimbarGroup.position.set(mimbarX, 0, mimbarZ);
    group.add(mimbarGroup);

    // 6 Chandelier Fixtures hanging from the ceiling
    const quarterW = W / 4;
    const quarterD = D / 4;
    const chandelierPositions = [
      [-quarterW, H - 0.8, quarterD],
      [quarterW, H - 0.8, quarterD],
      [-quarterW, H - 0.8, 0],
      [quarterW, H - 0.8, 0],
      [-quarterW, H - 0.8, -quarterD],
      [quarterW, H - 0.8, -quarterD],
    ];

    chandelierPositions.forEach(([cx, cy, cz]) => {
      const chGroup = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 10, 24), matGold);
      ring.rotation.x = Math.PI / 2;
      chGroup.add(ring);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xfff4cc,
          emissive: 0xffdf88,
          emissiveIntensity: 0.9,
          roughness: 0.2,
        })
      );
      chGroup.add(bulb);

      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), matGold);
      rod.position.set(0, 0.4, 0);
      chGroup.add(rod);

      chGroup.position.set(cx, cy, cz);
      group.add(chGroup);
    });

    // =========================================================================
    // 8. AREA LANTAI KERAMIK PUTIH DI SEKITAR PINTU & SIRKULASI
    // "Area lantai di sekitar tiap pintu menggunakan keramik putih (bukan karpet),
    // dengan karpet hijau di kiri-kanan jalur keramik tersebut."
    // =========================================================================
    const floorGroup = new THREE.Group();

    // A. White Ceramic Central Walkway from Back Door to Front Mihrab (Lebar 2.4m)
    const centralAisleW = 2.4;
    const centralWalkway = new THREE.Mesh(
      new THREE.PlaneGeometry(centralAisleW, D - 0.4),
      matWhiteCeramic
    );
    centralWalkway.rotation.x = -Math.PI / 2;
    centralWalkway.position.set(0, 0.015, 0);
    centralWalkway.receiveShadow = true;
    floorGroup.add(centralWalkway);

    // Ceramic tile divider lines for central walkway
    for (let t = -D / 2 + 1.2; t <= D / 2 - 1.2; t += 1.2) {
      const lineT = new THREE.Mesh(new THREE.PlaneGeometry(centralAisleW, 0.02), matCeramicGrout);
      lineT.rotation.x = -Math.PI / 2;
      lineT.position.set(0, 0.018, t);
      floorGroup.add(lineT);
    }

    // B. White Ceramic Cross Walkway connecting Left Door & Right Door (at Z = -3.5, Lebar 2.4m)
    const crossAisleW = 2.4;
    const crossWalkway = new THREE.Mesh(
      new THREE.PlaneGeometry(W - 0.4, crossAisleW),
      matWhiteCeramic
    );
    crossWalkway.rotation.x = -Math.PI / 2;
    crossWalkway.position.set(0, 0.016, doorSideZ);
    crossWalkway.receiveShadow = true;
    floorGroup.add(crossWalkway);

    // C. White Ceramic Aprons around Left Door, Right Door & Back Door
    const backFoyer = new THREE.Mesh(new THREE.PlaneGeometry(doorPortalW + 0.8, 2.2), matWhiteCeramic);
    backFoyer.rotation.x = -Math.PI / 2;
    backFoyer.position.set(0, 0.017, -D / 2 + 1.1);
    floorGroup.add(backFoyer);

    const leftFoyer = new THREE.Mesh(new THREE.PlaneGeometry(2.2, doorPortalW + 0.8), matWhiteCeramic);
    leftFoyer.rotation.x = -Math.PI / 2;
    leftFoyer.position.set(-W / 2 + 1.1, 0.017, doorSideZ);
    floorGroup.add(leftFoyer);

    const rightFoyer = new THREE.Mesh(new THREE.PlaneGeometry(2.2, doorPortalW + 0.8), matWhiteCeramic);
    rightFoyer.rotation.x = -Math.PI / 2;
    rightFoyer.position.set(W / 2 - 1.1, 0.017, doorSideZ);
    floorGroup.add(rightFoyer);

    // Front Mihrab & Rooms Ceramic Apron
    const frontApron = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.4, 2.2), matWhiteCeramic);
    frontApron.rotation.x = -Math.PI / 2;
    frontApron.position.set(0, 0.017, D / 2 - 1.1);
    floorGroup.add(frontApron);

    group.add(floorGroup);

    // =========================================================================
    // 9. SAF KARPET (4 SAF DEPAN LAKI-LAKI + 5 SAF BELAKANG PEREMPUAN = TOTAL 9 SAF)
    // Karpet hijau membentang di kiri-kanan jalur keramik putih
    // =========================================================================
    const matCarpetA = new THREE.MeshStandardMaterial({ color: 0x255b41, roughness: 0.88 }); // Male (Hijau Lumut)
    const matCarpetB = new THREE.MeshStandardMaterial({ color: 0x7a2d24, roughness: 0.88 }); // Female (Burgundy / Hijau)
    const matCarpetBorder = new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.5 });

    const carpetWingW = (W - centralAisleW - 0.8) / 2; // Width of carpet wing on left and right
    const wingCenterX_L = -centralAisleW / 2 - carpetWingW / 2;
    const wingCenterX_R = centralAisleW / 2 + carpetWingW / 2;
    const rowDepth = 1.2;

    // Helper to add Saf row with left & right wings flanking central ceramic walkway
    const addSafRow = (zPos: number, isMale: boolean) => {
      const mat = isMale ? matCarpetA : matCarpetB;

      // Left Wing Carpet
      const rowL = new THREE.Mesh(new THREE.PlaneGeometry(carpetWingW, rowDepth - 0.16), mat);
      rowL.rotation.x = -Math.PI / 2;
      rowL.position.set(wingCenterX_L, 0.022, zPos);
      rowL.receiveShadow = true;
      group.add(rowL);

      const lineL = new THREE.Mesh(new THREE.PlaneGeometry(carpetWingW, 0.04), matCarpetBorder);
      lineL.rotation.x = -Math.PI / 2;
      lineL.position.set(wingCenterX_L, 0.024, zPos + (rowDepth - 0.16) / 2 - 0.02);
      group.add(lineL);

      // Right Wing Carpet
      const rowR = new THREE.Mesh(new THREE.PlaneGeometry(carpetWingW, rowDepth - 0.16), mat);
      rowR.rotation.x = -Math.PI / 2;
      rowR.position.set(wingCenterX_R, 0.022, zPos);
      rowR.receiveShadow = true;
      group.add(rowR);

      const lineR = new THREE.Mesh(new THREE.PlaneGeometry(carpetWingW, 0.04), matCarpetBorder);
      lineR.rotation.x = -Math.PI / 2;
      lineR.position.set(wingCenterX_R, 0.024, zPos + (rowDepth - 0.16) / 2 - 0.02);
      group.add(lineR);
    };

    // A. 4 Saf Depan (Jamaah Laki-laki)
    const maleSafPositions = [7.5, 6.3, 5.1, 3.9];
    const actualMaleSafCount = Math.min(config.safMale, maleSafPositions.length);
    for (let m = 0; m < actualMaleSafCount; m++) {
      addSafRow(maleSafPositions[m], true);
    }

    // B. Tabir / Hijab Pembatas Saf
    const tabirZ = 1.8;
    if (config.showTabir) {
      const matTabir = new THREE.MeshStandardMaterial({
        color: 0x2F6B4F,
        roughness: 0.6,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const tabirPoleMat = new THREE.MeshStandardMaterial({ color: 0xC9A227, metalness: 0.7 });

      // Left & Right Tabir Screen Panels (Leaving central ceramic aisle open for walking)
      const tabirL = new THREE.Mesh(new THREE.BoxGeometry(carpetWingW, 1.6, 0.05), matTabir);
      tabirL.position.set(wingCenterX_L, 0.95, tabirZ);
      group.add(tabirL);

      const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, carpetWingW + 0.1, 8), tabirPoleMat);
      railL.rotation.z = Math.PI / 2;
      railL.position.set(wingCenterX_L, 1.8, tabirZ);
      group.add(railL);

      const tabirR = new THREE.Mesh(new THREE.BoxGeometry(carpetWingW, 1.6, 0.05), matTabir);
      tabirR.position.set(wingCenterX_R, 0.95, tabirZ);
      group.add(tabirR);

      const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, carpetWingW + 0.1, 8), tabirPoleMat);
      railR.rotation.z = Math.PI / 2;
      railR.position.set(wingCenterX_R, 1.8, tabirZ);
      group.add(railR);
    }

    // C. 5 Saf Belakang (Jamaah Perempuan)
    // Sesuai denah: 5 baris saf belakang (Total 4 + 5 = 9 Saf)
    const femaleSafPositions = [0.6, -0.6, -6.0, -7.2, -8.4];
    const actualFemaleSafCount = Math.min(config.safFemale, femaleSafPositions.length);
    for (let f = 0; f < actualFemaleSafCount; f++) {
      addSafRow(femaleSafPositions[f], false);
    }

    // =========================================================================
    // 10. REVISI POSISI TOA / SPEAKER (TOTAL 2 UNIT)
    // - 1 unit di dinding kiri, area tengah bangunan (menempel tinggi dekat langit-langit, kabel menjuntai)
    // - 1 unit di area depan / dekat mimbar (menempel tinggi dekat langit-langit, kabel menjuntai)
    // =========================================================================
    const matToaSpeaker = new THREE.MeshStandardMaterial({
      color: 0xE8ECF0,
      roughness: 0.35,
      metalness: 0.3,
    });
    const matAudioCable = new THREE.MeshStandardMaterial({
      color: 0x1A1A1A,
      roughness: 0.8,
    });

    const createToaSpeaker = (x: number, y: number, z: number, ry: number, rx: number) => {
      const spkGroup = new THREE.Group();

      // Horn Speaker Flare Cone
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.65, 16), matToaSpeaker);
      cone.rotation.x = rx;
      cone.rotation.y = ry;
      spkGroup.add(cone);

      // Back Driver Housing
      const driver = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.25, 14), matToaSpeaker);
      driver.rotation.x = rx;
      driver.rotation.y = ry;
      spkGroup.add(driver);

      // Mounting Wall Bracket
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.15), matStainless);
      spkGroup.add(bracket);

      // Audio Cable Dangling Downward (Kabel Menjuntai ke Bawah)
      const cableH = 3.6;
      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, cableH, 8),
        matAudioCable
      );
      cable.position.set(0, -cableH / 2, 0);
      spkGroup.add(cable);

      spkGroup.position.set(x, y, z);
      group.add(spkGroup);
      return spkGroup;
    };

    // TOA Unit 1: Dinding kiri area tengah (X = -W/2 + 0.35, Y = H - 0.75, Z = 0)
    createToaSpeaker(-W / 2 + 0.35, H - 0.75, 0, Math.PI / 2, -Math.PI * 0.15);

    // TOA Unit 2: Area depan dekat mimbar (X = -2.5, Y = H - 0.75, Z = D/2 - 2.5)
    createToaSpeaker(-2.5, H - 0.75, D / 2 - 2.5, 0, Math.PI * 0.85);

    // If user configured extra toa units (e.g. 4 or 6)
    if (config.toaCount >= 4) {
      createToaSpeaker(W / 2 - 0.35, H - 0.75, 0, -Math.PI / 2, -Math.PI * 0.15);
      createToaSpeaker(2.5, H - 0.75, D / 2 - 2.5, 0, Math.PI * 0.85);
    }
    if (config.toaCount >= 6) {
      createToaSpeaker(0, H - 0.75, -D / 2 + 1.2, Math.PI, -Math.PI * 0.15);
      createToaSpeaker(0, H - 0.75, 0, 0, -Math.PI * 0.15);
    }

    // =========================================================================
    // 11. KIPAS ANGIN DINDING (WALL FAN 3 UNIT - BUKAN AC)
    // 3 Unit: Posisi depan (dekat mimbar), Posisi tengah (dinding kiri), Posisi samping (dinding kanan)
    // =========================================================================
    const matFanBody = new THREE.MeshStandardMaterial({
      color: 0xF5F6F8,
      roughness: 0.3,
      metalness: 0.2,
    });
    const matFanGrill = new THREE.MeshStandardMaterial({
      color: 0xD0D6DC,
      roughness: 0.4,
      metalness: 0.7,
      wireframe: false,
    });
    const matFanBlades = new THREE.MeshPhysicalMaterial({
      color: 0x2F6B4F,
      roughness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75,
    });

    const createWallFan = (x: number, y: number, z: number, ry: number, tilt = 0.22) => {
      const fanGroup = new THREE.Group();

      // 1. Wall Base Bracket with Speed Switch Dial
      const baseBracket = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.08), matFanBody);
      fanGroup.add(baseBracket);

      // Speed Dial Knob
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), matGold);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, -0.04, 0.045);
      fanGroup.add(dial);

      // Pull String / Cord (Tali Tarikan Kipas)
      const pullCord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 0.65, 6),
        matWhiteFrame
      );
      pullCord.position.set(0.03, -0.42, 0.04);
      fanGroup.add(pullCord);

      const pullBead = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), matGold);
      pullBead.position.set(0.03, -0.74, 0.04);
      fanGroup.add(pullBead);

      // 2. Articulated Neck & Motor Housing
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8), matStainless);
      neck.rotation.x = Math.PI / 3;
      neck.position.set(0, 0.12, 0.12);
      fanGroup.add(neck);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.24, 0.24);
      headGroup.rotation.x = tilt;

      // Motor Pod
      const motorPod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.18, 14), matFanBody);
      motorPod.rotation.x = Math.PI / 2;
      headGroup.add(motorPod);

      // 3. Circular Wire Cage Guard (Diameter 0.65m)
      const cageRim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.012, 8, 32), matFanGrill);
      cageRim.position.set(0, 0, 0.10);
      headGroup.add(cageRim);

      const cageInnerRim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.008, 8, 24), matFanGrill);
      cageInnerRim.position.set(0, 0, 0.11);
      headGroup.add(cageInnerRim);

      // 8 Radial Wire Spokes
      for (let s = 0; s < 8; s++) {
        const spokeAng = (s / 8) * Math.PI * 2;
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.64, 6), matFanGrill);
        spoke.rotation.z = spokeAng;
        spoke.position.set(0, 0, 0.10);
        headGroup.add(spoke);
      }

      // 4. Aerodynamic Fan Blades (3 Blades attached to rotating spinner group)
      const bladeSpinner = new THREE.Group();
      bladeSpinner.position.set(0, 0, 0.10);

      const bladeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12), matFanBody);
      bladeHub.rotation.x = Math.PI / 2;
      bladeSpinner.add(bladeHub);

      for (let b = 0; b < 3; b++) {
        const bladeAngle = (b / 3) * Math.PI * 2;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.26, 0.015), matFanBlades);
        blade.position.set(Math.sin(bladeAngle) * 0.14, Math.cos(bladeAngle) * 0.14, 0);
        blade.rotation.z = -bladeAngle;
        blade.rotation.y = 0.2;
        bladeSpinner.add(blade);
      }

      // Center Emblem Badge
      const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.015, 12), matGold);
      emblem.rotation.x = Math.PI / 2;
      emblem.position.set(0, 0, 0.03);
      bladeSpinner.add(emblem);

      headGroup.add(bladeSpinner);
      fanBladesRef.current.push(bladeSpinner);

      fanGroup.add(headGroup);
      fanGroup.rotation.y = ry;
      fanGroup.position.set(x, y, z);
      group.add(fanGroup);
      return fanGroup;
    };

    // Unit 1: Posisi Depan (Front wall dekat mimbar / mihrab)
    createWallFan(2.6, 3.4, D / 2 - 0.22, Math.PI, 0.25);

    // Unit 2: Posisi Tengah (Dinding kiri tengah)
    createWallFan(-W / 2 + 0.22, 3.4, 3.0, Math.PI / 2, 0.22);

    // Unit 3: Posisi Samping (Dinding kanan samping belakang/tengah)
    createWallFan(W / 2 - 0.22, 3.4, -0.5, -Math.PI / 2, 0.22);

    // If config has 4 or 6 units
    if (config.acCount >= 4) {
      createWallFan(-W / 2 + 0.22, 3.4, -7.0, Math.PI / 2, 0.22);
    }
    if (config.acCount >= 6) {
      createWallFan(W / 2 - 0.22, 3.4, -7.0, -Math.PI / 2, 0.22);
      createWallFan(0, 3.4, -D / 2 + 0.22, 0, 0.22);
    }

    // Rak Al-Quran (Dinding Kiri)
    const rakGroup = new THREE.Group();
    const rakBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.6, 2.2), matDarkWood);
    rakGroup.add(rakBody);
    rakGroup.position.set(-W / 2 + 0.35, 0.8, 4.5);
    group.add(rakGroup);

    // Kotak Infaq Tromol Stainless (Dekat Pintu Belakang)
    const tromol = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.9, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xd0d4d8, metalness: 0.85, roughness: 0.2 })
    );
    tromol.position.set(2.2, 0.45, -9.5);
    group.add(tromol);

    // Menara / Minaret (Optional 3D Mesh)
    if (config.minaretVisible) {
      const minaretGroup = new THREE.Group();
      const minX = W / 2 + 3.5;
      const minZ = -D / 2 + 2.5;
      const minH = 17.5;

      // Base pedestal (Putih Bersih)
      const mBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.5, 3.0), matInteriorWhite);
      mBase.position.set(0, 0.75, 0);
      minaretGroup.add(mBase);

      // Shaft octagonal/cylinder (Putih Bersih)
      const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, minH, 16), matInteriorWhite);
      mShaft.position.set(0, minH / 2 + 1.5, 0);
      minaretGroup.add(mShaft);

      // Balcony (Balkon adzan - Hijau Tua dengan Lis Hijau Muda)
      const mBalcony = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 0.6, 16), matDarkGreen);
      mBalcony.position.set(0, minH + 1.5, 0);
      minaretGroup.add(mBalcony);

      const mBalconyRing = new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.04, 8, 24), matLightGreen);
      mBalconyRing.rotation.x = Math.PI / 2;
      mBalconyRing.position.set(0, minH + 1.8, 0);
      minaretGroup.add(mBalconyRing);

      // Upper Pavilion Columns (Putih Bersih)
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8), matInteriorWhite);
        col.position.set(Math.sin(ang) * 1.2, minH + 1.5 + 1.1, Math.cos(ang) * 1.2);
        minaretGroup.add(col);
      }

      // Minaret Small Dome (Kubah Menara - Hijau Muda)
      const mDome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), matLightGreen);
      mDome.position.set(0, minH + 1.5 + 2.2, 0);
      minaretGroup.add(mDome);

      // Minaret Finial
      const mFinial = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.1, 8), matGold);
      mFinial.position.set(0, minH + 1.5 + 2.2 + 1.4, 0);
      minaretGroup.add(mFinial);

      minaretGroup.position.set(minX, 0, minZ);
      group.add(minaretGroup);
    }

    // ---------- Hotspot Interactive Markers ----------
    if (config.showHotspots) {
      const markerGeo = new THREE.SphereGeometry(0.20, 20, 20);

      hotspots.forEach(h => {
        const isSelected = selectedHotspotId === h.id;
        const markerMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xffea78 : 0xC9A227,
          emissive: isSelected ? 0xc9a227 : 0x4a3b0e,
          emissiveIntensity: isSelected ? 0.75 : 0.30,
          metalness: 0.6,
          roughness: 0.25,
        });

        const markerMesh = new THREE.Mesh(markerGeo, markerMat);
        markerMesh.position.set(h.pos[0], h.pos[1], h.pos[2]);
        markerMesh.userData = { hotspotId: h.id };
        markerMesh.visible = isInterior ? true : !h.interiorOnly;
        group.add(markerMesh);

        // Pulsing Ring Halo
        const haloGeo = new THREE.RingGeometry(0.28, 0.38, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0xffea78 : 0xC9A227,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: isSelected ? 0.85 : 0.45,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.rotation.x = Math.PI / 2;
        haloMesh.position.copy(markerMesh.position);
        haloMesh.visible = markerMesh.visible;
        group.add(haloMesh);

        markersRef.current.push({
          mesh: markerMesh,
          halo: haloMesh,
          hotspotId: h.id,
          pos: new THREE.Vector3(h.pos[0], h.pos[1], h.pos[2]),
        });
      });
    }

    // Kiblat & Compass Visibility (Visible in both Exterior and Interior!)
    if (qiblaGroupRef.current) {
      qiblaGroupRef.current.visible = config.showQibla;
    }
  }, [config, hotspots, isInterior, selectedHotspotId]);

  // Handle Mode Change ("Masuk ke Dalam" / "Keluar") Transition & Roof Mode Changes
  useEffect(() => {
    if (!cameraRef.current) return;

    // Determine target roof opacity based on roofMode & isInterior
    let toOpacity = 1.0;
    let isVisible = true;
    if (config.roofMode === 'hidden') {
      toOpacity = 0.0;
      isVisible = false;
    } else if (config.roofMode === 'transparent') {
      toOpacity = 0.22;
      isVisible = true;
    } else if (isInterior) {
      toOpacity = 0.06;
      isVisible = true;
    }

    roofMeshesRef.current.forEach(mesh => {
      mesh.visible = isVisible;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => {
          m.transparent = true;
          m.opacity = toOpacity;
        });
      } else {
        mesh.material.transparent = true;
        mesh.material.opacity = toOpacity;
      }
    });

    // Animate camera target and radius inside room boundary
    const isPortrait = (typeof window !== 'undefined' ? window.innerWidth / Math.max(window.innerHeight, 1) : 1) < 1.0;
    const newTarget = isInterior ? new THREE.Vector3(0, 1.6, 0.5) : new THREE.Vector3(0, 2.5, 0);
    const newRadius = isInterior ? 2.8 : (isPortrait ? 46.0 : 30.0);
    const newPhi = isInterior ? 0.05 : Math.PI / 2.8;
    const newTheta = isInterior ? 0 : Math.PI / 3.8;
    const newFov = isInterior ? 55 : 45;
    const newYaw = 0;
    const newPitch = 0.05;

    camState.current.fromTarget.copy(camState.current.target);
    camState.current.toTarget.copy(newTarget);
    camState.current.fromRadius = camState.current.radius;
    camState.current.toRadius = newRadius;
    camState.current.fromPhi = camState.current.phi;
    camState.current.toPhi = newPhi;
    camState.current.fromTheta = camState.current.theta;
    camState.current.toTheta = newTheta;
    camState.current.fromYaw = camState.current.interiorYaw;
    camState.current.toYaw = newYaw;
    camState.current.fromPitch = camState.current.interiorPitch;
    camState.current.toPitch = newPitch;
    camState.current.fromFov = camState.current.fov;
    camState.current.toFov = newFov;
    camState.current.animStart = performance.now();
    camState.current.animDuration = 650;
    camState.current.animating = true;

    // Update marker visibility
    markersRef.current.forEach(m => {
      const h = hotspotsRef.current.find(item => item.id === m.hotspotId);
      const isVis = isInterior ? true : !h?.interiorOnly;
      m.mesh.visible = isVis && Boolean(config.showHotspots);
      if (m.halo) m.halo.visible = isVis && Boolean(config.showHotspots);
    });

    // Update Kiblat & Compass visibility
    if (qiblaGroupRef.current) {
      qiblaGroupRef.current.visible = config.showQibla;
    }
  }, [isInterior, config.showQibla, config.roofMode, config.showHotspots]);

  // Focus Camera onto a specific position if requested (with interior safety containment)
  useEffect(() => {
    if (!focusPosition) return;
    const cfg = configRef.current;
    const isTop = focusPosition[1] > 20;
    const target = new THREE.Vector3(
      isInterior ? THREE.MathUtils.clamp(focusPosition[0], -cfg.width / 2 + 1.5, cfg.width / 2 - 1.5) : focusPosition[0],
      isInterior ? Math.max(focusPosition[1], 1.5) : Math.max(focusPosition[1], 1.2),
      isInterior ? THREE.MathUtils.clamp(focusPosition[2], -cfg.depth / 2 + 1.5, cfg.depth / 2 - 1.5) : focusPosition[2]
    );
    camState.current.fromTarget.copy(camState.current.target);
    camState.current.toTarget.copy(target);
    camState.current.fromRadius = camState.current.radius;
    camState.current.toRadius = isInterior ? 2.8 : (isTop ? 28 : Math.min(camState.current.radius, 32));
    camState.current.fromPhi = camState.current.phi;
    camState.current.toPhi = isInterior ? 0.05 : (isTop ? 0.15 : 0.65);
    camState.current.fromTheta = camState.current.theta;
    camState.current.toTheta = isInterior ? 0 : camState.current.theta;
    camState.current.fromYaw = camState.current.interiorYaw;
    camState.current.toYaw = 0; // Face forward (+Z Mihrab)
    camState.current.fromPitch = camState.current.interiorPitch;
    camState.current.toPitch = 0.05;
    camState.current.fromFov = camState.current.fov;
    camState.current.toFov = isInterior ? 55 : 45;
    camState.current.animStart = performance.now();
    camState.current.animDuration = 650;
    camState.current.animating = true;
  }, [focusPosition, isInterior]);

  return (
    <div className="relative w-full h-full">
      <div id="canvas-wrap" ref={mountRef} className="w-full h-full" />
      {isPlacingHotspot && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#C9A227] text-[#1B2420] px-4 py-2 rounded-full font-bold text-xs shadow-xl pointer-events-none flex items-center gap-2 animate-bounce">
          <span>📍 Klik pada lantai 3D masjid untuk menentukan posisi fasilitas baru</span>
        </div>
      )}
    </div>
  );
};
