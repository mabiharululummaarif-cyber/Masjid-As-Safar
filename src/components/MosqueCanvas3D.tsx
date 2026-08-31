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
  const markersRef = useRef<{ mesh: THREE.Mesh; halo: THREE.Mesh; hotspotId: string; pos: THREE.Vector3 }[]>([]);
  const qiblaGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    sun: THREE.DirectionalLight;
    ambient: THREE.AmbientLight;
    fill: THREE.DirectionalLight;
    indoorLights: THREE.PointLight[];
  } | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);

  // Camera spherical state
  const camState = useRef({
    target: new THREE.Vector3(0, 2, 0),
    radius: 20,
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    animating: false,
    animStart: 0,
    animDuration: 600,
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
    fromRadius: 20,
    toRadius: 20,
    fromPhi: Math.PI / 3.2,
    toPhi: Math.PI / 3.2,
  });

  // Hotspots and config refs for event handlers without closure staling
  const hotspotsRef = useRef(hotspots);
  hotspotsRef.current = hotspots;
  const isInteriorRef = useRef(isInterior);
  isInteriorRef.current = isInterior;
  const isPlacingRef = useRef(isPlacingHotspot);
  isPlacingRef.current = isPlacingHotspot;

  // Initialize Scene & Renderer
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x163832);
    scene.fog = new THREE.Fog(0x163832, 28, 65);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff4da, 0.95);
    sun.position.set(14, 24, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x9fd6c2, 0.3);
    fill.position.set(-12, 10, -10);
    scene.add(fill);

    // Interior Warm Lights
    const indoorLights: THREE.PointLight[] = [];
    const chandelier1 = new THREE.PointLight(0xffdf99, 0.8, 12);
    chandelier1.position.set(0, 4.2, 3);
    scene.add(chandelier1);
    indoorLights.push(chandelier1);

    const chandelier2 = new THREE.PointLight(0xffdf99, 0.8, 12);
    chandelier2.position.set(0, 4.2, -4);
    scene.add(chandelier2);
    indoorLights.push(chandelier2);

    const mihrabGlow = new THREE.PointLight(0xc9a227, 0.9, 6);
    mihrabGlow.position.set(0, 2.5, 7.2);
    scene.add(mihrabGlow);
    indoorLights.push(mihrabGlow);

    lightsRef.current = { sun, ambient, fill, indoorLights };

    // Dynamic Root Group
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Kiblat Group
    const qiblaGroup = new THREE.Group();
    const qiblaArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0.05, -1.5),
      4.5,
      0xC9A227,
      1.1,
      0.6
    );
    qiblaGroup.add(qiblaArrow);

    // Qibla Label Sprite
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(22, 56, 50, 0.92)';
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 56, 12);
      ctx.fill();
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#F7F3E8';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🕋 ARAH KIBLAT', 128, 33);
    }
    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const qiblaLabel = new THREE.Sprite(spriteMat);
    qiblaLabel.position.set(0, 1.35, 1.5);
    qiblaLabel.scale.set(2.6, 0.65, 1);
    qiblaGroup.add(qiblaLabel);
    qiblaGroup.visible = isInterior;
    scene.add(qiblaGroup);
    qiblaGroupRef.current = qiblaGroup;

    // Camera update function
    const updateCameraPos = () => {
      const { target, radius, theta, phi } = camState.current;
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);
    };
    updateCameraPos();

    // Mouse / Touch Orbit Controls (NO OrbitControls conflict)
    let dragging = false;
    let lastX = 0, lastY = 0;
    let downX = 0, downY = 0;
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
        // Hover raycast for cursor
        const rect = renderer.domElement.getBoundingClientRect();
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
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      camState.current.theta -= dx * 0.005;
      camState.current.phi = Math.min(Math.max(camState.current.phi - dy * 0.005, 0.12), Math.PI / 2 - 0.01);
      updateCameraPos();
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (moved > 6) return; // Ignore drag release

      const rect = renderer.domElement.getBoundingClientRect();
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
      const minR = isInteriorRef.current ? 4.5 : 8;
      const maxR = isInteriorRef.current ? 22 : 38;
      camState.current.radius = Math.min(Math.max(camState.current.radius + e.deltaY * 0.02, minR), maxR);
      updateCameraPos();
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

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

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera lerp animation
      if (camState.current.animating) {
        const now = performance.now();
        const progress = Math.min((now - camState.current.animStart) / camState.current.animDuration, 1);
        // Smooth step easing
        const t = progress * progress * (3 - 2 * progress);

        camState.current.target.lerpVectors(camState.current.fromTarget, camState.current.toTarget, t);
        camState.current.radius = camState.current.fromRadius + (camState.current.toRadius - camState.current.fromRadius) * t;
        camState.current.phi = camState.current.fromPhi + (camState.current.toPhi - camState.current.fromPhi) * t;
        updateCameraPos();

        if (progress >= 1) {
          camState.current.animating = false;
        }
      }

      // Animate hotspot markers (gentle hover float & rotating halo)
      markersRef.current.forEach((item, index) => {
        if (item.mesh.visible) {
          item.mesh.position.y = item.pos.y + Math.sin(elapsedTime * 2.5 + index) * 0.04;
          if (item.halo) {
            item.halo.position.copy(item.mesh.position);
            item.halo.rotation.z = elapsedTime * 1.5 + index;
            item.halo.rotation.x = Math.PI / 2;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Handle Time of Day & Lighting
  useEffect(() => {
    if (!lightsRef.current || !sceneRef.current) return;
    const { sun, ambient, fill, indoorLights } = lightsRef.current;
    const scene = sceneRef.current;

    if (config.timeOfDay === 'night') {
      scene.background = new THREE.Color(0x0a1614);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0x0a1614);
      }
      sun.color.setHex(0x7391b0);
      sun.intensity = 0.25;
      ambient.color.setHex(0x223631);
      ambient.intensity = 0.35;
      fill.intensity = 0.15;
      indoorLights.forEach(l => {
        l.intensity = 1.4;
      });
    } else if (config.timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0x231a24);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0x231a24);
      }
      sun.color.setHex(0xffaa5e);
      sun.intensity = 0.85;
      ambient.color.setHex(0xe8bb97);
      ambient.intensity = 0.45;
      fill.intensity = 0.25;
      indoorLights.forEach(l => {
        l.intensity = 0.9;
      });
    } else {
      // Day
      scene.background = new THREE.Color(0x163832);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0x163832);
      }
      sun.color.setHex(0xfff4da);
      sun.intensity = 0.95;
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.55;
      fill.intensity = 0.3;
      indoorLights.forEach(l => {
        l.intensity = 0.7;
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
    markersRef.current = [];

    const W = config.width;      // 10
    const D = config.depth;      // 16
    const H = config.height;     // 5
    const doorGap = config.doorGap; // 3

    // ---------- Materials ----------
    const matSand = new THREE.MeshStandardMaterial({
      color: 0xE8DCC0,
      roughness: 0.88,
      metalness: 0.05
    });

    const matRoof = new THREE.MeshStandardMaterial({
      color: 0x2F6B4F,
      roughness: 0.55,
      metalness: 0.15,
      transparent: true,
      opacity: isInterior ? 0.06 : 1.0,
      side: THREE.DoubleSide
    });

    const matGold = new THREE.MeshStandardMaterial({
      color: 0xC9A227,
      metalness: 0.65,
      roughness: 0.35,
    });

    const matDarkWood = new THREE.MeshStandardMaterial({
      color: 0x3d2716,
      roughness: 0.7,
      metalness: 0.1
    });

    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0x9fd0e8,
      transparent: true,
      opacity: 0.4,
      roughness: 0.05,
      transmission: 0.7,
      ior: 1.5,
    });

    const matFloor = new THREE.MeshStandardMaterial({
      color: 0xd6cbb0,
      roughness: 0.85,
    });

    // Floor Base
    const floorGeo = new THREE.PlaneGeometry(W, D);
    const floor = new THREE.Mesh(floorGeo, matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);
    floorMeshRef.current = floor;

    // Floor Surrounding Terrace / Courtyard
    const terraceGeo = new THREE.PlaneGeometry(W + 6, D + 6);
    const matTerrace = new THREE.MeshStandardMaterial({ color: 0x1d443c, roughness: 0.95 });
    const terrace = new THREE.Mesh(terraceGeo, matTerrace);
    terrace.rotation.x = -Math.PI / 2;
    terrace.position.y = -0.02;
    terrace.receiveShadow = true;
    group.add(terrace);

    // Wall Helper
    const createWall = (w: number, h: number, x: number, y: number, z: number, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.22), matSand);
      m.position.set(x, y, z);
      m.rotation.y = ry;
      m.castShadow = true;
      m.receiveShadow = true;
      group.add(m);
      return m;
    };

    // Mosque Walls & 3 Sliding Glass Doors (Pintu Kaca Tarik-Dorong)
    const doorH = 3.2;

    // Helper to create a Sliding Glass Door (Pintu Kaca Geser / Tarik-Dorong 2 Panel)
    const createSlidingDoor = (
      x: number,
      z: number,
      width: number,
      orientation: 'x' | 'z'
    ) => {
      const doorGroup = new THREE.Group();
      const halfW = width / 2;
      const leafW = halfW + 0.08; // Slight overlap in center for realistic sliding door
      const leafH = doorH - 0.08;
      const leafThickness = 0.06;
      const trackOffset = 0.035; // Offset between inner and outer sliding tracks

      const matDoorFrame = new THREE.MeshStandardMaterial({
        color: 0x163832,
        roughness: 0.5,
        metalness: 0.4,
      });

      if (orientation === 'z') {
        // Door lies along Z-axis (Right wall X = +W/2 or Left wall X = -W/2)
        // Panel 1 (Outer track: +X offset, covers -Z half)
        const panel1Group = new THREE.Group();
        const glass1 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness, leafH, leafW), matGlass);
        glass1.castShadow = true;
        panel1Group.add(glass1);

        // Frame borders
        const topFrame1 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, 0.06, leafW), matDoorFrame);
        topFrame1.position.set(0, leafH / 2 - 0.03, 0);
        panel1Group.add(topFrame1);
        const botFrame1 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, 0.08, leafW), matDoorFrame);
        botFrame1.position.set(0, -leafH / 2 + 0.04, 0);
        panel1Group.add(botFrame1);
        const sideFrame1A = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, leafH, 0.06), matDoorFrame);
        sideFrame1A.position.set(0, 0, leafW / 2 - 0.03);
        panel1Group.add(sideFrame1A);
        const sideFrame1B = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, leafH, 0.06), matDoorFrame);
        sideFrame1B.position.set(0, 0, -leafW / 2 + 0.03);
        panel1Group.add(sideFrame1B);

        // Vertical sliding handle (Gold bar handle)
        const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 12), matGold);
        handle1.position.set(trackOffset > 0 ? 0.05 : -0.05, 0, leafW / 2 - 0.12);
        panel1Group.add(handle1);

        panel1Group.position.set(trackOffset, doorH / 2, -halfW / 2);
        doorGroup.add(panel1Group);

        // Panel 2 (Inner track: -X offset, covers +Z half)
        const panel2Group = new THREE.Group();
        const glass2 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness, leafH, leafW), matGlass);
        glass2.castShadow = true;
        panel2Group.add(glass2);

        const topFrame2 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, 0.06, leafW), matDoorFrame);
        topFrame2.position.set(0, leafH / 2 - 0.03, 0);
        panel2Group.add(topFrame2);
        const botFrame2 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, 0.08, leafW), matDoorFrame);
        botFrame2.position.set(0, -leafH / 2 + 0.04, 0);
        panel2Group.add(botFrame2);
        const sideFrame2A = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, leafH, 0.06), matDoorFrame);
        sideFrame2A.position.set(0, 0, leafW / 2 - 0.03);
        panel2Group.add(sideFrame2A);
        const sideFrame2B = new THREE.Mesh(new THREE.BoxGeometry(leafThickness + 0.02, leafH, 0.06), matDoorFrame);
        sideFrame2B.position.set(0, 0, -leafW / 2 + 0.03);
        panel2Group.add(sideFrame2B);

        const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 12), matGold);
        handle2.position.set(trackOffset > 0 ? -0.05 : 0.05, 0, -leafW / 2 + 0.12);
        panel2Group.add(handle2);

        panel2Group.position.set(-trackOffset, doorH / 2, halfW / 2);
        doorGroup.add(panel2Group);

        // Top Sliding Rail / Header Casing
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, width + 0.12), matGold);
        topRail.position.set(0, doorH + 0.07, 0);
        doorGroup.add(topRail);

        // Floor threshold runner
        const floorGuide = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.03, width + 0.1), matGold);
        floorGuide.position.set(0, 0.015, 0);
        doorGroup.add(floorGuide);

        // Wall segment above the door
        const wallH = H - doorH - 0.14;
        const wallAbove = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallH, width), matSand);
        wallAbove.position.set(0, doorH + 0.14 + wallH / 2, 0);
        wallAbove.castShadow = true;
        wallAbove.receiveShadow = true;
        doorGroup.add(wallAbove);
      } else {
        // Door lies along X-axis (Front wall Z = +D/2)
        // Panel 1 (Outer track: +Z offset, covers -X half)
        const panel1Group = new THREE.Group();
        const glass1 = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, leafThickness), matGlass);
        glass1.castShadow = true;
        panel1Group.add(glass1);

        const topFrame1 = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.06, leafThickness + 0.02), matDoorFrame);
        topFrame1.position.set(0, leafH / 2 - 0.03, 0);
        panel1Group.add(topFrame1);
        const botFrame1 = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.08, leafThickness + 0.02), matDoorFrame);
        botFrame1.position.set(0, -leafH / 2 + 0.04, 0);
        panel1Group.add(botFrame1);
        const sideFrame1A = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, leafThickness + 0.02), matDoorFrame);
        sideFrame1A.position.set(leafW / 2 - 0.03, 0, 0);
        panel1Group.add(sideFrame1A);
        const sideFrame1B = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, leafThickness + 0.02), matDoorFrame);
        sideFrame1B.position.set(-leafW / 2 + 0.03, 0, 0);
        panel1Group.add(sideFrame1B);

        // Vertical sliding handle
        const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 12), matGold);
        handle1.position.set(leafW / 2 - 0.12, 0, 0.05);
        panel1Group.add(handle1);

        panel1Group.position.set(-halfW / 2, doorH / 2, trackOffset);
        doorGroup.add(panel1Group);

        // Panel 2 (Inner track: -Z offset, covers +X half)
        const panel2Group = new THREE.Group();
        const glass2 = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, leafThickness), matGlass);
        glass2.castShadow = true;
        panel2Group.add(glass2);

        const topFrame2 = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.06, leafThickness + 0.02), matDoorFrame);
        topFrame2.position.set(0, leafH / 2 - 0.03, 0);
        panel2Group.add(topFrame2);
        const botFrame2 = new THREE.Mesh(new THREE.BoxGeometry(leafW, 0.08, leafThickness + 0.02), matDoorFrame);
        botFrame2.position.set(0, -leafH / 2 + 0.04, 0);
        panel2Group.add(botFrame2);
        const sideFrame2A = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, leafThickness + 0.02), matDoorFrame);
        sideFrame2A.position.set(leafW / 2 - 0.03, 0, 0);
        panel2Group.add(sideFrame2A);
        const sideFrame2B = new THREE.Mesh(new THREE.BoxGeometry(0.06, leafH, leafThickness + 0.02), matDoorFrame);
        sideFrame2B.position.set(-leafW / 2 + 0.03, 0, 0);
        panel2Group.add(sideFrame2B);

        const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85, 12), matGold);
        handle2.position.set(-leafW / 2 + 0.12, 0, -0.05);
        panel2Group.add(handle2);

        panel2Group.position.set(halfW / 2, doorH / 2, -trackOffset);
        doorGroup.add(panel2Group);

        // Top Sliding Rail / Header Casing
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.14, 0.24), matGold);
        topRail.position.set(0, doorH + 0.07, 0);
        doorGroup.add(topRail);

        // Floor threshold runner
        const floorGuide = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, 0.03, 0.20), matGold);
        floorGuide.position.set(0, 0.015, 0);
        doorGroup.add(floorGuide);

        // Wall segment above the door
        const wallH = H - doorH - 0.14;
        const wallAbove = new THREE.Mesh(new THREE.BoxGeometry(width, wallH, 0.22), matSand);
        wallAbove.position.set(0, doorH + 0.14 + wallH / 2, 0);
        wallAbove.castShadow = true;
        wallAbove.receiveShadow = true;
        doorGroup.add(wallAbove);
      }

      doorGroup.position.set(x, 0, z);
      group.add(doorGroup);
      return doorGroup;
    };

    // 1. Back Wall (-Z) - Solid Wall
    createWall(W, H, 0, H / 2, -D / 2, 0);

    // 2. Right Wall (+X) with Center Sliding Glass Door
    const segLen = (D - doorGap) / 2;
    createWall(segLen, H, W / 2, H / 2, (doorGap / 2 + segLen / 2), Math.PI / 2);
    createWall(segLen, H, W / 2, H / 2, -(doorGap / 2 + segLen / 2), Math.PI / 2);
    createSlidingDoor(W / 2, 0, doorGap, 'z');

    // 3. Left Wall (-X) with Center Sliding Glass Door (Symmetrical to Right Wall)
    createWall(segLen, H, -W / 2, H / 2, (doorGap / 2 + segLen / 2), Math.PI / 2);
    createWall(segLen, H, -W / 2, H / 2, -(doorGap / 2 + segLen / 2), Math.PI / 2);
    createSlidingDoor(-W / 2, 0, doorGap, 'z');

    // 4. Front Wall (+Z, Mihrab/Kiblat side) with Front Sliding Glass Door (Beside Mimbar)
    const frontDoorW = 2.4;
    const frontDoorX = -3.1; // Positioned left of mimbar (open space X from -4.3 to -1.9)
    // Leftmost front corner wall (X from -5.0 to -4.3)
    createWall(0.7, H, -4.65, H / 2, D / 2, 0);
    // Main front wall covering mihrab (X = 0) and ruang imam (X = 3.5) (X from -1.9 to +5.0)
    createWall(6.9, H, 1.55, H / 2, D / 2, 0);
    createSlidingDoor(frontDoorX, D / 2, frontDoorW, 'x');

    // Roof Base & Dome
    const roofBase = new THREE.Mesh(new THREE.BoxGeometry(W + 0.6, 0.4, D + 0.6), matRoof);
    roofBase.position.set(0, H + 0.2, 0);
    roofBase.castShadow = true;
    group.add(roofBase);
    roofMeshesRef.current.push(roofBase);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), matRoof);
    dome.position.set(0, H + 0.4, 0);
    dome.castShadow = true;
    group.add(dome);
    roofMeshesRef.current.push(dome);

    const finialPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), matGold);
    finialPole.position.set(0, H + 0.4 + 2.6 + 0.6, 0);
    group.add(finialPole);
    roofMeshesRef.current.push(finialPole);

    const finialCone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 12), matGold);
    finialCone.position.set(0, H + 0.4 + 2.6 + 0.5, 0);
    group.add(finialCone);
    roofMeshesRef.current.push(finialCone);

    // Crescent Top (Bulan Sabit)
    const crescentGeo = new THREE.TorusGeometry(0.3, 0.05, 12, 24, Math.PI * 1.5);
    const crescent = new THREE.Mesh(crescentGeo, matGold);
    crescent.position.set(0, H + 0.4 + 2.6 + 1.25, 0);
    crescent.rotation.z = Math.PI * 0.25;
    group.add(crescent);
    roofMeshesRef.current.push(crescent);

    // Mihrab Niche Arc
    const mihrabNiche = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.6), matGold);
    mihrabNiche.position.set(0, 1.7, D / 2 - 0.1);
    group.add(mihrabNiche);

    // Mimbar Steps (depan tengah, dekat mihrab)
    const mimbarZ = D / 2 - 1.2;
    const mimbarGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.3 - i * 0.25, 0.26, 0.95 - i * 0.2),
        i === 2 ? matDarkWood : matGold
      );
      step.position.set(0, 0.13 + i * 0.26, -i * 0.06);
      step.castShadow = true;
      mimbarGroup.add(step);
    }
    // Mimbar podium arch
    const podiumRailing = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.1), matGold);
    podiumRailing.position.set(0, 1.05, -0.2);
    mimbarGroup.add(podiumRailing);
    mimbarGroup.position.set(0, 0, mimbarZ);
    group.add(mimbarGroup);

    // Ruang Imam (samping mimbar)
    const ruangImamPos = new THREE.Vector3(3.5, 1.2, D / 2 - 1.5);
    const matRoom = new THREE.MeshStandardMaterial({
      color: 0xcfc19a,
      roughness: 0.9,
      transparent: true,
      opacity: isInterior ? 0.75 : 0.95,
    });
    const ruangImam = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 2.6), matRoom);
    ruangImam.position.copy(ruangImamPos);
    ruangImam.castShadow = true;
    group.add(ruangImam);

    // Carpet Colors
    const matCarpetA = new THREE.MeshStandardMaterial({ color: 0x255b41, roughness: 0.88 }); // Male (Green)
    const matCarpetB = new THREE.MeshStandardMaterial({ color: 0x7a2d24, roughness: 0.88 }); // Female (Burgundy)
    const matCarpetBorder = new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.5 });

    // Male Saf Carpets (Depan)
    const rowDepth = 1.1;
    let zF = mimbarZ - 0.6;
    for (let i = 0; i < config.safMale; i++) {
      const z = zF - i * rowDepth;
      const row = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.2, rowDepth - 0.16), matCarpetA);
      row.rotation.x = -Math.PI / 2;
      row.position.set(0, 0.02, z);
      row.receiveShadow = true;
      group.add(row);

      // Gold saf line divider
      const line = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.2, 0.04), matCarpetBorder);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.022, z + (rowDepth - 0.16) / 2 - 0.02);
      group.add(line);
    }

    // Female Saf Carpets (Belakang)
    let zB = -doorGap / 2 - 0.45;
    for (let i = 0; i < config.safFemale; i++) {
      const z = zB - i * rowDepth;
      // Prevent exceeding back wall
      if (z < -D / 2 + 0.7) break;
      const row = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.2, rowDepth - 0.16), matCarpetB);
      row.rotation.x = -Math.PI / 2;
      row.position.set(0, 0.02, z);
      row.receiveShadow = true;
      group.add(row);

      const line = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.2, 0.04), matCarpetBorder);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.022, z + (rowDepth - 0.16) / 2 - 0.02);
      group.add(line);
    }

    // Tabir / Hijab Divider (between Male & Female saf)
    if (config.showTabir) {
      const tabirZ = -doorGap / 2 + 0.1;
      const matTabir = new THREE.MeshStandardMaterial({
        color: 0x2F6B4F,
        roughness: 0.6,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const tabirPoleMat = new THREE.MeshStandardMaterial({ color: 0xC9A227, metalness: 0.7 });

      // Tabir curtain panel
      const tabirMesh = new THREE.Mesh(new THREE.BoxGeometry(W - 1.6, 1.4, 0.04), matTabir);
      tabirMesh.position.set(0, 0.85, tabirZ);
      group.add(tabirMesh);

      // Tabir Top Rail
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, W - 1.4, 8), tabirPoleMat);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, 1.6, tabirZ);
      group.add(rail);
    }

    // Horn Speakers / Toa (Configurable Count)
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 });
    const toaZ = zF - 1.1;
    const toaPositions: [number, number, number][] = [];
    if (config.toaCount >= 2) {
      toaPositions.push([-3.6, H - 0.5, toaZ]);
      toaPositions.push([3.6, H - 0.5, toaZ]);
    }
    if (config.toaCount >= 4) {
      toaPositions.push([-3.6, H - 0.5, -4.5]);
      toaPositions.push([3.6, H - 0.5, -4.5]);
    }
    if (config.toaCount >= 6) {
      toaPositions.push([0, H - 0.5, 0]);
      toaPositions.push([0, H - 0.5, 6.0]);
    }

    toaPositions.forEach(([tx, ty, tz]) => {
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), matWhite);
      body.rotation.x = Math.PI * 0.9;
      body.position.set(tx, ty, tz);
      group.add(body);
    });

    // AC Units (Configurable Count)
    const acPositions: [number, number, number][] = [];
    if (config.acCount >= 1) acPositions.push([-W / 2 + 0.25, H - 1.2, -2]);
    if (config.acCount >= 2) acPositions.push([-W / 2 + 0.25, H - 1.2, 3]);
    if (config.acCount >= 3) acPositions.push([-W / 2 + 0.25, H - 1.2, -6]);
    if (config.acCount >= 4) acPositions.push([W / 2 - 0.25, H - 1.2, 5]);
    if (config.acCount >= 5) acPositions.push([W / 2 - 0.25, H - 1.2, -5]);
    if (config.acCount >= 6) acPositions.push([0, H - 1.2, -D / 2 + 0.25]);

    acPositions.forEach(([ax, ay, az]) => {
      const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.32), matWhite);
      acUnit.position.set(ax, ay, az);
      if (Math.abs(ax) > 3) {
        acUnit.rotation.y = ax > 0 ? -Math.PI / 2 : Math.PI / 2;
      }
      group.add(acUnit);

      // AC Grill detail
      const grill = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.08),
        new THREE.MeshBasicMaterial({ color: 0x333333 })
      );
      grill.position.set(0, -0.12, 0.17);
      acUnit.add(grill);
    });

    // Menara / Minaret (Optional 3D Mesh)
    if (config.minaretVisible) {
      const minaretGroup = new THREE.Group();
      const minX = W / 2 + 2.2;
      const minZ = -D / 2 + 1.5;
      const minH = 13.5;

      // Base pedestal
      const mBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), matSand);
      mBase.position.set(0, 0.6, 0);
      minaretGroup.add(mBase);

      // Shaft octagonal/cylinder
      const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, minH, 16), matSand);
      mShaft.position.set(0, minH / 2 + 1.2, 0);
      minaretGroup.add(mShaft);

      // Balcony (Balkon adzan)
      const mBalcony = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 0.5, 16), matGold);
      mBalcony.position.set(0, minH + 1.2, 0);
      minaretGroup.add(mBalcony);

      // Upper Pavilion Columns
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8), matSand);
        col.position.set(Math.sin(ang) * 0.9, minH + 1.2 + 0.9, Math.cos(ang) * 0.9);
        minaretGroup.add(col);
      }

      // Minaret Small Dome
      const mDome = new THREE.Mesh(new THREE.SphereGeometry(1.0, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), matRoof);
      mDome.position.set(0, minH + 1.2 + 1.8, 0);
      minaretGroup.add(mDome);

      // Minaret Finial
      const mFinial = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 8), matGold);
      mFinial.position.set(0, minH + 1.2 + 1.8 + 1.1, 0);
      minaretGroup.add(mFinial);

      minaretGroup.position.set(minX, 0, minZ);
      group.add(minaretGroup);
    }

    // ---------- Hotspot Interactive Markers ----------
    if (config.showHotspots) {
      const markerGeo = new THREE.SphereGeometry(0.18, 20, 20);

      hotspots.forEach(h => {
        const isSelected = selectedHotspotId === h.id;
        const markerMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xffea78 : 0xC9A227,
          emissive: isSelected ? 0xc9a227 : 0x4a3b0e,
          emissiveIntensity: isSelected ? 0.7 : 0.25,
          metalness: 0.6,
          roughness: 0.25,
        });

        const markerMesh = new THREE.Mesh(markerGeo, markerMat);
        markerMesh.position.set(h.pos[0], h.pos[1], h.pos[2]);
        markerMesh.userData = { hotspotId: h.id };
        markerMesh.visible = isInterior ? true : !h.interiorOnly;
        group.add(markerMesh);

        // Pulsing Ring Halo
        const haloGeo = new THREE.RingGeometry(0.24, 0.32, 24);
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

    // Kiblat Visibility
    if (qiblaGroupRef.current) {
      qiblaGroupRef.current.visible = config.showQibla && isInterior;
    }
  }, [config, hotspots, isInterior, selectedHotspotId]);

  // Handle Mode Change ("Masuk ke Dalam" / "Keluar") Transition
  useEffect(() => {
    if (!cameraRef.current) return;

    // Fade roof opacity
    const toOpacity = isInterior ? 0.06 : 1.0;
    roofMeshesRef.current.forEach(mesh => {
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

    // Animate camera target and radius
    const newTarget = isInterior ? new THREE.Vector3(0, 2.3, 0.6) : new THREE.Vector3(0, 2.0, 0);
    const newRadius = isInterior ? 12.5 : 20.5;
    const newPhi = isInterior ? 0.52 : Math.PI / 3.2;

    camState.current.fromTarget.copy(camState.current.target);
    camState.current.toTarget.copy(newTarget);
    camState.current.fromRadius = camState.current.radius;
    camState.current.toRadius = newRadius;
    camState.current.fromPhi = camState.current.phi;
    camState.current.toPhi = newPhi;
    camState.current.animStart = performance.now();
    camState.current.animDuration = 650;
    camState.current.animating = true;

    // Update marker visibility
    markersRef.current.forEach(m => {
      const h = hotspotsRef.current.find(item => item.id === m.hotspotId);
      const isVisible = isInterior ? true : !h?.interiorOnly;
      m.mesh.visible = isVisible;
      if (m.halo) m.halo.visible = isVisible;
    });

    // Update Kiblat helper visibility
    if (qiblaGroupRef.current) {
      qiblaGroupRef.current.visible = config.showQibla && isInterior;
    }
  }, [isInterior]);

  // Focus Camera onto a specific position if requested
  useEffect(() => {
    if (!focusPosition) return;
    const target = new THREE.Vector3(focusPosition[0], Math.max(focusPosition[1], 1.2), focusPosition[2]);
    camState.current.fromTarget.copy(camState.current.target);
    camState.current.toTarget.copy(target);
    camState.current.fromRadius = camState.current.radius;
    camState.current.toRadius = Math.min(camState.current.radius, 10);
    camState.current.fromPhi = camState.current.phi;
    camState.current.toPhi = 0.65;
    camState.current.animStart = performance.now();
    camState.current.animDuration = 700;
    camState.current.animating = true;
  }, [focusPosition]);

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
