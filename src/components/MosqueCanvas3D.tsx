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

  // Camera spherical state
  const camState = useRef({
    target: new THREE.Vector3(0, 2, 0),
    radius: 28,
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    animating: false,
    animStart: 0,
    animDuration: 600,
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
    fromRadius: 28,
    toRadius: 28,
    fromPhi: Math.PI / 3.2,
    toPhi: Math.PI / 3.2,
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
    scene.background = new THREE.Color(0x163832);
    scene.fog = new THREE.Fog(0x163832, 38, 90);

    // Camera (near = 0.05 to prevent close polygon clipping)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 300);
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

    // Enhanced High-Clarity Lighting (Daylight default: bright, clear, no dark spots)
    const ambient = new THREE.AmbientLight(0xffffff, 0.90);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff8ea, 1.45);
    sun.position.set(22, 36, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 28;
    sun.shadow.camera.bottom = -28;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xd5ede4, 0.70);
    fill.position.set(-20, 18, -18);
    scene.add(fill);

    const hemi = new THREE.HemisphereLight(0xfffaee, 0x163832, 0.55);
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
    // COMPASS & QIBLA 3D NAVIGATION SYSTEM (Exterior & Interior)
    // =========================================================================
    const qiblaGroup = new THREE.Group();

    // 1. Materials for Compass
    const matGoldCompass = new THREE.MeshStandardMaterial({
      color: 0xC9A227,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x5a4610,
      emissiveIntensity: 0.35,
    });

    const matCreamCardinal = new THREE.MeshStandardMaterial({
      color: 0xE8DCC0,
      metalness: 0.3,
      roughness: 0.6,
    });

    const matDarkGreenCompass = new THREE.MeshStandardMaterial({
      color: 0x163832,
      metalness: 0.4,
      roughness: 0.5,
    });

    // 2. Ground Compass Rose (Around Mosque Perimeter)
    const groundCompassRadius = 16.5;

    // Outer Ground Ring
    const groundRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(groundCompassRadius, 0.09, 8, 64),
      matGoldCompass
    );
    groundRing1.rotation.x = Math.PI / 2;
    groundRing1.position.set(0, 0.08, 0);
    qiblaGroup.add(groundRing1);

    // Inner Concentric Ring
    const groundRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(groundCompassRadius - 1.4, 0.05, 8, 64),
      matCreamCardinal
    );
    groundRing2.rotation.x = Math.PI / 2;
    groundRing2.position.set(0, 0.08, 0);
    qiblaGroup.add(groundRing2);

    // 12 Radial Dial Ticks on Ground
    for (let d = 0; d < 12; d++) {
      const angle = (d / 12) * Math.PI * 2;
      const isMajor = d % 3 === 0;
      const tickLen = isMajor ? 1.6 : 0.8;
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(isMajor ? 0.12 : 0.06, 0.04, tickLen),
        isMajor ? matGoldCompass : matCreamCardinal
      );
      const tickDist = groundCompassRadius - tickLen / 2;
      tick.position.set(Math.sin(angle) * tickDist, 0.09, Math.cos(angle) * tickDist);
      tick.rotation.y = -angle;
      qiblaGroup.add(tick);
    }

    // 3. Cardinal Direction Markers on Ground (Utara, Selatan, Timur, Barat)
    // UTARA (U / North) -> -X axis
    const arrowNorth = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 4), matCreamCardinal);
    arrowNorth.rotation.z = Math.PI / 2;
    arrowNorth.position.set(-groundCompassRadius, 0.12, 0);
    qiblaGroup.add(arrowNorth);
    const badgeNorth = createCompassBadge('🧭 U · UTARA', false, 'NORTH (0° / 360°)');
    badgeNorth.position.set(-groundCompassRadius - 2.0, 1.8, 0);
    badgeNorth.scale.set(4.0, 1.0, 1);
    qiblaGroup.add(badgeNorth);

    // SELATAN (S / South) -> +X axis
    const arrowSouth = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 4), matCreamCardinal);
    arrowSouth.rotation.z = -Math.PI / 2;
    arrowSouth.position.set(groundCompassRadius, 0.12, 0);
    qiblaGroup.add(arrowSouth);
    const badgeSouth = createCompassBadge('🧭 S · SELATAN', false, 'SOUTH (180°)');
    badgeSouth.position.set(groundCompassRadius + 2.0, 1.8, 0);
    badgeSouth.scale.set(4.0, 1.0, 1);
    qiblaGroup.add(badgeSouth);

    // TIMUR (T / East) -> -Z axis
    const arrowEast = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 4), matCreamCardinal);
    arrowEast.rotation.x = -Math.PI / 2;
    arrowEast.position.set(0, 0.12, -groundCompassRadius);
    qiblaGroup.add(arrowEast);
    const badgeEast = createCompassBadge('🧭 T · TIMUR', false, 'EAST (90°)');
    badgeEast.position.set(0, 1.8, -groundCompassRadius - 2.0);
    badgeEast.scale.set(4.0, 1.0, 1);
    qiblaGroup.add(badgeEast);

    // BARAT (B / West) -> +Z axis
    const arrowWest = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 4), matCreamCardinal);
    arrowWest.rotation.x = Math.PI / 2;
    arrowWest.position.set(0, 0.12, groundCompassRadius);
    qiblaGroup.add(arrowWest);
    const badgeWest = createCompassBadge('🧭 B · BARAT', false, 'WEST (270°)');
    badgeWest.position.set(0, 1.8, groundCompassRadius + 2.0);
    badgeWest.scale.set(4.0, 1.0, 1);
    qiblaGroup.add(badgeWest);

    // =========================================================================
    // 4. PROMINENT GOLDEN QIBLA ARROWS & BEACONS (KIBLAT 295° / ARAH KIBLAT)
    // =========================================================================
    // A. Ground & Interior Golden Qibla Runner
    const qiblaArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0.06, -6.0),
      14.0,
      0xC9A227,
      2.2,
      1.1
    );
    qiblaGroup.add(qiblaArrow);

    // Glowing golden ground chevrons along Kiblat axis
    for (let c = -4; c <= 8; c += 3) {
      const chevron = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 1.1, 3, 1, Math.PI * 0.25, Math.PI * 0.5),
        matGoldCompass
      );
      chevron.rotation.x = -Math.PI / 2;
      chevron.rotation.z = -Math.PI / 4;
      chevron.position.set(0, 0.07, c);
      qiblaGroup.add(chevron);
    }

    // B. Interior Floating Qibla Badge (Near Mimbar & Saf)
    const qiblaLabelInterior = createCompassBadge('🕋 ARAH KIBLAT', true, 'Arah Sholat Menghadap Kiblat');
    qiblaLabelInterior.position.set(0, 1.5, 3.0);
    qiblaLabelInterior.scale.set(3.8, 0.95, 1);
    qiblaGroup.add(qiblaLabelInterior);

    // C. Elevated Exterior Floating Qibla Beacon (Visible from high orbit and outside)
    const qiblaLabelExterior = createCompassBadge('🕋 ARAH KIBLAT (QIBLA)', true, '295° BARAT LAUT · KA\'BAH');
    qiblaLabelExterior.position.set(0, 9.4, 13.0);
    qiblaLabelExterior.scale.set(4.8, 1.2, 1);
    qiblaGroup.add(qiblaLabelExterior);

    // Glowing Vertical Beacon Cylinder linking ground to exterior badge
    const beaconBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.08, 9.2, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffea78,
        emissive: 0xc9a227,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.65,
      })
    );
    beaconBeam.position.set(0, 4.7, 13.0);
    qiblaGroup.add(beaconBeam);

    // =========================================================================
    // 5. FLOATING 3D SKY COMPASS (Tactical Map / Game HUD Floating Halo)
    // =========================================================================
    const skyCompassGroup = new THREE.Group();
    const skyCompassY = 10.2;
    const skyCompassR = 7.5;

    // Sky Floating Rings
    const skyRingOuter = new THREE.Mesh(
      new THREE.TorusGeometry(skyCompassR, 0.06, 8, 48),
      matGoldCompass
    );
    skyRingOuter.rotation.x = Math.PI / 2;
    skyCompassGroup.add(skyRingOuter);

    const skyRingInner = new THREE.Mesh(
      new THREE.TorusGeometry(skyCompassR - 1.0, 0.035, 8, 48),
      matDarkGreenCompass
    );
    skyRingInner.rotation.x = Math.PI / 2;
    skyCompassGroup.add(skyRingInner);

    // 4 Directional Cardinal Spoke Arms
    const spokeGeo = new THREE.CylinderGeometry(0.025, 0.025, skyCompassR * 2, 8);
    const spokeNS = new THREE.Mesh(spokeGeo, matCreamCardinal);
    spokeNS.rotation.z = Math.PI / 2;
    skyCompassGroup.add(spokeNS);

    const spokeEW = new THREE.Mesh(spokeGeo, matCreamCardinal);
    spokeEW.rotation.x = Math.PI / 2;
    skyCompassGroup.add(spokeEW);

    // Prominent Golden Qibla Arrow Pointer on Sky Compass (Pointing along +Z)
    const skyQiblaArrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 1.8, 6),
      new THREE.MeshStandardMaterial({
        color: 0xffea78,
        emissive: 0xc9a227,
        emissiveIntensity: 0.85,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    skyQiblaArrow.rotation.x = Math.PI / 2;
    skyQiblaArrow.position.set(0, 0, skyCompassR + 0.9);
    skyCompassGroup.add(skyQiblaArrow);

    // Sky Cardinal Pointer Cones (Utara, Selatan, Timur)
    const skyNorthArrow = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.0, 4), matCreamCardinal);
    skyNorthArrow.rotation.z = Math.PI / 2;
    skyNorthArrow.position.set(-skyCompassR - 0.5, 0, 0);
    skyCompassGroup.add(skyNorthArrow);

    const skySouthArrow = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.0, 4), matCreamCardinal);
    skySouthArrow.rotation.z = -Math.PI / 2;
    skySouthArrow.position.set(skyCompassR + 0.5, 0, 0);
    skyCompassGroup.add(skySouthArrow);

    const skyEastArrow = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.0, 4), matCreamCardinal);
    skyEastArrow.rotation.x = -Math.PI / 2;
    skyEastArrow.position.set(0, 0, -skyCompassR - 0.5);
    skyCompassGroup.add(skyEastArrow);

    skyCompassGroup.position.set(0, skyCompassY, 0);
    qiblaGroup.add(skyCompassGroup);
    skyCompassRef.current = skyCompassGroup;

    // Set initial visibility based on config.showQibla (ALWAYS VISIBLE in both Exterior and Interior!)
    qiblaGroup.visible = config.showQibla;
    scene.add(qiblaGroup);
    qiblaGroupRef.current = qiblaGroup;

    // Camera update function with STRICT INTERIOR WALL/ROOF CLAMPING
    const updateCameraPos = () => {
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      const { target, radius, theta, phi } = camState.current;
      const cfg = configRef.current;
      const W = cfg.width;
      const D = cfg.depth;
      const H = cfg.height;

      if (isInteriorRef.current) {
        // 1. Clamp target to inner room bounds
        const maxTX = Math.max(W / 2 - 3.2, 1.0);
        const maxTZ = Math.max(D / 2 - 3.8, 1.0);
        target.x = THREE.MathUtils.clamp(target.x, -maxTX, maxTX);
        target.y = THREE.MathUtils.clamp(target.y, 1.2, 3.2);
        target.z = THREE.MathUtils.clamp(target.z, -maxTZ, maxTZ);

        // 2. Compute candidate position in spherical coordinates
        const posX = target.x + radius * Math.sin(phi) * Math.sin(theta);
        const posY = target.y + radius * Math.cos(phi);
        const posZ = target.z + radius * Math.sin(phi) * Math.cos(theta);

        // 3. Strict bounding box clamping with safety margins (Camera NEVER penetrates walls or roof!)
        const marginX = 0.65;
        const marginZ = 0.65;
        const marginFloor = 0.60;
        const marginCeiling = 0.70;

        cam.position.x = THREE.MathUtils.clamp(posX, -W / 2 + marginX, W / 2 - marginX);
        cam.position.y = THREE.MathUtils.clamp(posY, marginFloor, H - marginCeiling);
        cam.position.z = THREE.MathUtils.clamp(posZ, -D / 2 + marginZ, D / 2 - marginZ);
      } else {
        cam.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
        cam.position.y = target.y + radius * Math.cos(phi);
        cam.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      }
      cam.lookAt(target);
    };
    updateCameraPos();

    // Mouse / Touch Orbit Controls (No OrbitControls conflict, clamped interior controls)
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

      const minPhi = isInteriorRef.current ? 0.35 : 0.12;
      const maxPhi = isInteriorRef.current ? Math.PI / 2 - 0.08 : Math.PI / 2 - 0.01;

      camState.current.theta -= dx * 0.005;
      camState.current.phi = THREE.MathUtils.clamp(camState.current.phi - dy * 0.005, minPhi, maxPhi);
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
      const cfg = configRef.current;
      const maxInteriorRadius = Math.min(cfg.width, cfg.depth) * 0.44;
      const minR = isInteriorRef.current ? 1.5 : 12;
      const maxR = isInteriorRef.current ? Math.max(maxInteriorRadius, 6.0) : 55;
      camState.current.radius = THREE.MathUtils.clamp(
        camState.current.radius + e.deltaY * 0.015,
        minR,
        maxR
      );
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
        const t = progress * progress * (3 - 2 * progress);

        camState.current.target.lerpVectors(camState.current.fromTarget, camState.current.toTarget, t);
        camState.current.radius = camState.current.fromRadius + (camState.current.toRadius - camState.current.fromRadius) * t;
        camState.current.phi = camState.current.fromPhi + (camState.current.toPhi - camState.current.fromPhi) * t;
        updateCameraPos();

        if (progress >= 1) {
          camState.current.animating = false;
        }
      }

      // Animate sky compass floating effect
      if (skyCompassRef.current) {
        skyCompassRef.current.position.y = 10.2 + Math.sin(elapsedTime * 1.6) * 0.16;
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
      // Day (Crisp, highly clear, beautiful daylight)
      scene.background = new THREE.Color(0x163832);
      if (scene.fog) {
        scene.fog.color = new THREE.Color(0x163832);
      }
      sun.color.setHex(0xfff8ea);
      sun.intensity = 1.45;
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.90;
      fill.intensity = 0.70;
      if (hemi) hemi.intensity = 0.55;
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

    // ---------- Materials ----------
    const matSand = new THREE.MeshStandardMaterial({
      color: 0xE8DCC0,
      roughness: 0.85,
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
      opacity: 0.45,
      roughness: 0.05,
      transmission: 0.75,
      ior: 1.5,
    });

    const matFloor = new THREE.MeshStandardMaterial({
      color: 0xd8ceb3,
      roughness: 0.82,
    });

    // Floor Base (Spacious main hall)
    const floorGeo = new THREE.PlaneGeometry(W, D);
    const floor = new THREE.Mesh(floorGeo, matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);
    floorMeshRef.current = floor;

    // Floor Surrounding Terrace / Courtyard
    const terraceGeo = new THREE.PlaneGeometry(W + 10, D + 10);
    const matTerrace = new THREE.MeshStandardMaterial({ color: 0x1d443c, roughness: 0.95 });
    const terrace = new THREE.Mesh(terraceGeo, matTerrace);
    terrace.rotation.x = -Math.PI / 2;
    terrace.position.y = -0.02;
    terrace.receiveShadow = true;
    group.add(terrace);

    // Mosque Structural Frames & Materials
    const matDoorFrame = new THREE.MeshStandardMaterial({
      color: 0x163832,
      roughness: 0.45,
      metalness: 0.45,
    });

    const matPartitionGlass = new THREE.MeshPhysicalMaterial({
      color: 0xb5e0f2,
      transparent: true,
      opacity: 0.40,
      roughness: 0.08,
      transmission: 0.80,
      ior: 1.5,
      side: THREE.DoubleSide,
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

      // 1. Bottom Structural Base Curb (Dado / Plinth)
      const curb = new THREE.Mesh(
        new THREE.BoxGeometry(length, curbH, wallThickness),
        matSand
      );
      curb.position.set(0, curbH / 2, 0);
      curb.castShadow = true;
      curb.receiveShadow = true;
      wallGroup.add(curb);

      // Bottom gold accent runner
      const curbGold = new THREE.Mesh(
        new THREE.BoxGeometry(length + 0.02, 0.05, wallThickness + 0.02),
        matGold
      );
      curbGold.position.set(0, curbH + 0.025, 0);
      wallGroup.add(curbGold);

      // 2. Top Structural Transom Header Beam
      const topBeam = new THREE.Mesh(
        new THREE.BoxGeometry(length, topBeamH, wallThickness),
        matDoorFrame
      );
      topBeam.position.set(0, height - topBeamH / 2, 0);
      topBeam.castShadow = true;
      wallGroup.add(topBeam);

      // Top gold fascia trim
      const topGold = new THREE.Mesh(
        new THREE.BoxGeometry(length + 0.02, 0.05, wallThickness + 0.02),
        matGold
      );
      topGold.position.set(0, height - topBeamH - 0.025, 0);
      wallGroup.add(topGold);

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
        glassPane.castShadow = true;
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

      wallGroup.position.set(x, 0, z);
      wallGroup.rotation.y = ry;
      group.add(wallGroup);
      return wallGroup;
    };

    // Mosque Walls & 3 Sliding Glass Doors (Pintu Kaca Tarik-Dorong)
    const doorH = 3.4;

    // Helper to create a Sliding Glass Door (Pintu Kaca Geser / Tarik-Dorong 2 Panel)
    const createSlidingDoor = (
      x: number,
      z: number,
      width: number,
      orientation: 'x' | 'z',
      isGrandEntrance = false
    ) => {
      const doorGroup = new THREE.Group();
      const halfW = width / 2;
      const leafW = halfW + 0.08; // Slight overlap in center for realistic sliding door
      const leafH = doorH - 0.08;
      const leafThickness = 0.06;
      const trackOffset = 0.035; // Offset between inner and outer sliding tracks

      if (orientation === 'z') {
        // Door lies along Z-axis (Right wall X = +W/2 or Left wall X = -W/2)
        // Panel 1 (Outer track)
        const panel1Group = new THREE.Group();
        const glass1 = new THREE.Mesh(new THREE.BoxGeometry(leafThickness, leafH, leafW), matGlass);
        glass1.castShadow = true;
        panel1Group.add(glass1);

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
        const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12), matGold);
        handle1.position.set(trackOffset > 0 ? 0.06 : -0.06, 0, leafW / 2 - 0.12);
        panel1Group.add(handle1);

        panel1Group.position.set(trackOffset, doorH / 2, -halfW / 2);
        doorGroup.add(panel1Group);

        // Panel 2 (Inner track)
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

        const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12), matGold);
        handle2.position.set(trackOffset > 0 ? -0.06 : 0.06, 0, -leafW / 2 + 0.12);
        panel2Group.add(handle2);

        panel2Group.position.set(-trackOffset, doorH / 2, halfW / 2);
        doorGroup.add(panel2Group);

        // Top Sliding Rail / Header Casing
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, width + 0.16), matGold);
        topRail.position.set(0, doorH + 0.07, 0);
        doorGroup.add(topRail);

        // Floor threshold runner
        const floorGuide = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, width + 0.12), matGold);
        floorGuide.position.set(0, 0.015, 0);
        doorGroup.add(floorGuide);

        // Wall segment above the door (Glass transom / curtain header)
        const wallH = H - doorH - 0.14;
        const wallAbove = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH - 0.1, width - 0.1), matGlass);
        wallAbove.position.set(0, doorH + 0.14 + wallH / 2, 0);
        doorGroup.add(wallAbove);

        const wallAboveFrame = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, width), matDoorFrame);
        wallAboveFrame.position.set(0, H - 0.05, 0);
        doorGroup.add(wallAboveFrame);
      } else {
        // Door lies along X-axis (Front wall Z = +D/2)
        // Panel 1 (Outer track)
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

        const handle1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12), matGold);
        handle1.position.set(leafW / 2 - 0.12, 0, 0.06);
        panel1Group.add(handle1);

        panel1Group.position.set(-halfW / 2, doorH / 2, trackOffset);
        doorGroup.add(panel1Group);

        // Panel 2 (Inner track)
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

        const handle2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 12), matGold);
        handle2.position.set(-leafW / 2 + 0.12, 0, -0.06);
        panel2Group.add(handle2);

        panel2Group.position.set(halfW / 2, doorH / 2, -trackOffset);
        doorGroup.add(panel2Group);

        // Top Sliding Rail / Header Casing
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(width + 0.20, 0.16, 0.26), matGold);
        topRail.position.set(0, doorH + 0.08, 0);
        doorGroup.add(topRail);

        // Floor threshold runner
        const floorGuide = new THREE.Mesh(new THREE.BoxGeometry(width + 0.16, 0.03, 0.22), matGold);
        floorGuide.position.set(0, 0.015, 0);
        doorGroup.add(floorGuide);

        // Grand Entrance Portal Architrave Frame
        if (isGrandEntrance) {
          const portalPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.24, H, 0.32), matGold);
          portalPillarL.position.set(-halfW - 0.12, H / 2, 0);
          portalPillarL.castShadow = true;
          doorGroup.add(portalPillarL);

          const portalPillarR = new THREE.Mesh(new THREE.BoxGeometry(0.24, H, 0.32), matGold);
          portalPillarR.position.set(halfW + 0.12, H / 2, 0);
          portalPillarR.castShadow = true;
          doorGroup.add(portalPillarR);

          const portalArchitrave = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 0.45, 0.36), matGold);
          portalArchitrave.position.set(0, H - 0.225, 0);
          portalArchitrave.castShadow = true;
          doorGroup.add(portalArchitrave);

          // Front Entrance Portico Canopy (Kanopi Teras Depan)
          const canopyRoof = new THREE.Mesh(
            new THREE.BoxGeometry(width + 1.2, 0.18, 1.8),
            new THREE.MeshStandardMaterial({ color: 0x163832, roughness: 0.5, metalness: 0.3 })
          );
          canopyRoof.position.set(0, doorH + 0.4, 0.9);
          canopyRoof.castShadow = true;
          doorGroup.add(canopyRoof);

          // Canopy Gold Edge
          const canopyGold = new THREE.Mesh(new THREE.BoxGeometry(width + 1.26, 0.08, 1.86), matGold);
          canopyGold.position.set(0, doorH + 0.49, 0.9);
          doorGroup.add(canopyGold);

          // 2 Front Entrance Portico Columns
          const colL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, doorH + 0.35, 16), matGold);
          colL.position.set(-halfW - 0.4, (doorH + 0.35) / 2, 1.65);
          colL.castShadow = true;
          doorGroup.add(colL);

          const colR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, doorH + 0.35, 16), matGold);
          colR.position.set(halfW + 0.4, (doorH + 0.35) / 2, 1.65);
          colR.castShadow = true;
          doorGroup.add(colR);
        }

        // Wall segment above the door (Curtain glass & transom)
        const wallH = H - doorH - 0.16;
        const wallAbove = new THREE.Mesh(new THREE.BoxGeometry(width, wallH - 0.12, 0.08), matGlass);
        wallAbove.position.set(0, doorH + 0.16 + wallH / 2, 0);
        doorGroup.add(wallAbove);
      }

      doorGroup.position.set(x, 0, z);
      group.add(doorGroup);
      return doorGroup;
    };

    // 1. Back Wall (-Z) - Full Panoramic Glass Curtain Wall
    createCurtainWall(W, H, 0, 0, -D / 2, 0, Math.round(W / 2.0));

    // 2. Right Wall (+X) - Glass Curtain Walls with Center Sliding Glass Door
    const segLen = (D - doorGap) / 2;
    createCurtainWall(segLen, H, W / 2, 0, (doorGap / 2 + segLen / 2), Math.PI / 2, Math.round(segLen / 2.0));
    createCurtainWall(segLen, H, W / 2, 0, -(doorGap / 2 + segLen / 2), Math.PI / 2, Math.round(segLen / 2.0));
    createSlidingDoor(W / 2, 0, doorGap, 'z');

    // 3. Left Wall (-X) - Glass Curtain Walls with Center Sliding Glass Door (Symmetrical)
    createCurtainWall(segLen, H, -W / 2, 0, (doorGap / 2 + segLen / 2), Math.PI / 2, Math.round(segLen / 2.0));
    createCurtainWall(segLen, H, -W / 2, 0, -(doorGap / 2 + segLen / 2), Math.PI / 2, Math.round(segLen / 2.0));
    createSlidingDoor(-W / 2, 0, doorGap, 'z');

    // 4. Front Wall (+Z, Mihrab/Entrance side) with Grand Center Front Entrance Door
    const grandDoorW = 3.8;
    createSlidingDoor(0, D / 2, grandDoorW, 'x', true);

    // Front Wall Left & Right Glass Curtain Wall Segments
    const frontSegW = (W - grandDoorW) / 2;
    const frontSegCenterL = -W / 2 + frontSegW / 2;
    const frontSegCenterR = W / 2 - frontSegW / 2;
    createCurtainWall(frontSegW, H, frontSegCenterL, 0, D / 2, 0, Math.max(1, Math.round(frontSegW / 2.0)));
    createCurtainWall(frontSegW, H, frontSegCenterR, 0, D / 2, 0, Math.max(1, Math.round(frontSegW / 2.0)));

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

      // Inner side partition facing central entrance foyer
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

      // Room Ceiling / Roof Cap
      const roomCeiling = new THREE.Mesh(
        new THREE.BoxGeometry(roomW, 0.12, roomD),
        new THREE.MeshStandardMaterial({ color: 0x163832, roughness: 0.6 })
      );
      roomCeiling.position.set(0, roomH + 0.06, 0);
      rGroup.add(roomCeiling);

      // Gold Trim around ceiling
      const ceilingGold = new THREE.Mesh(new THREE.BoxGeometry(roomW + 0.08, 0.05, roomD + 0.08), matGold);
      ceilingGold.position.set(0, roomH + 0.12, 0);
      rGroup.add(ceilingGold);

      // Interior Furniture for the room
      if (isRightSide) {
        // Ruang Imam & Sound System: Sound Central Audio Rack + Desk
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
    // 6. ROOF STRUCTURE & DUAL DOMES (Grand Dome + Front Mihrab Dome)
    // ==========================================
    const roofBase = new THREE.Mesh(new THREE.BoxGeometry(W + 0.8, 0.45, D + 0.8), matRoof);
    roofBase.position.set(0, H + 0.225, 0);
    roofBase.castShadow = true;
    group.add(roofBase);
    roofMeshesRef.current.push(roofBase);

    // Roof perimeter gold cornice
    const roofCornice = new THREE.Mesh(new THREE.BoxGeometry(W + 0.95, 0.12, D + 0.95), matGold);
    roofCornice.position.set(0, H + 0.45 + 0.06, 0);
    group.add(roofCornice);
    roofMeshesRef.current.push(roofCornice);

    // A. GRAND CENTRAL DOME (Kubah Utama Tengah)
    const centralDomeRadius = 3.6;
    const centralDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(centralDomeRadius + 0.2, centralDomeRadius + 0.3, 0.6, 32),
      matGold
    );
    centralDrum.position.set(0, H + 0.45 + 0.3, 0);
    group.add(centralDrum);
    roofMeshesRef.current.push(centralDrum);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(centralDomeRadius, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2),
      matRoof
    );
    dome.position.set(0, H + 0.45 + 0.6, 0);
    dome.castShadow = true;
    group.add(dome);
    roofMeshesRef.current.push(dome);

    // Central Dome Gold Ribs
    for (let r = 0; r < 8; r++) {
      const ribAngle = (r / 8) * Math.PI;
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(centralDomeRadius + 0.02, 0.04, 8, 32, Math.PI),
        matGold
      );
      rib.rotation.y = ribAngle;
      rib.rotation.x = Math.PI / 2;
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

    // Front Dome Base Drum with Gold Arched Clerestory Motifs
    const frontDomeDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(frontDomeRadius + 0.2, frontDomeRadius + 0.3, 0.55, 24),
      matGold
    );
    frontDomeDrum.position.set(0, H + 0.45 + 0.275, frontDomeZ);
    group.add(frontDomeDrum);
    roofMeshesRef.current.push(frontDomeDrum);

    // Front Dome Hemisphere
    const frontDome = new THREE.Mesh(
      new THREE.SphereGeometry(frontDomeRadius, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      matRoof
    );
    frontDome.position.set(0, H + 0.45 + 0.55, frontDomeZ);
    frontDome.castShadow = true;
    group.add(frontDome);
    roofMeshesRef.current.push(frontDome);

    // Front Dome Gold Meridian Ribs
    for (let fr = 0; fr < 6; fr++) {
      const fAngle = (fr / 6) * Math.PI;
      const fRib = new THREE.Mesh(
        new THREE.TorusGeometry(frontDomeRadius + 0.02, 0.035, 8, 24, Math.PI),
        matGold
      );
      fRib.rotation.y = fAngle;
      fRib.rotation.x = Math.PI / 2;
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
    // 7. MIMBAR, MIHRAB & JAM RUNNING TEXT
    // ==========================================
    // Digital Jam Sholat Running Text Board (mounted on the header of the main front portal)
    const jamBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.65, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.6 })
    );
    jamBoard.position.set(0, doorH + 0.8, D / 2 - 0.12);
    group.add(jamBoard);

    // Mimbar Steps & Khutbah Podium (Depan Tengah di bawah Kubah Depan)
    const mimbarZ = D / 2 - 2.8;
    const mimbarGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.6 - i * 0.25, 0.28, 1.2 - i * 0.22),
        i === 2 ? matDarkWood : matGold
      );
      step.position.set(0, 0.14 + i * 0.28, -i * 0.08);
      step.castShadow = true;
      mimbarGroup.add(step);
    }
    // Mimbar podium railing & book stand
    const podiumRailing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 0.12), matGold);
    podiumRailing.position.set(0, 1.25, -0.28);
    mimbarGroup.add(podiumRailing);
    mimbarGroup.position.set(0, 0, mimbarZ);
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
      // Gold Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 10, 24), matGold);
      ring.rotation.x = Math.PI / 2;
      chGroup.add(ring);

      // Center glowing bulb
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

      // Hanging rod
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), matGold);
      rod.position.set(0, 0.4, 0);
      chGroup.add(rod);

      chGroup.position.set(cx, cy, cz);
      group.add(chGroup);
    });

    // Carpet Colors
    const matCarpetA = new THREE.MeshStandardMaterial({ color: 0x255b41, roughness: 0.88 }); // Male (Green)
    const matCarpetB = new THREE.MeshStandardMaterial({ color: 0x7a2d24, roughness: 0.88 }); // Female (Burgundy)
    const matCarpetBorder = new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.5 });

    // Male Saf Carpets (Depan)
    const rowDepth = 1.2;
    const carpetWidth = W - 2.4;
    let zF = mimbarZ - 0.8;
    for (let i = 0; i < config.safMale; i++) {
      const z = zF - i * rowDepth;
      const row = new THREE.Mesh(new THREE.PlaneGeometry(carpetWidth, rowDepth - 0.16), matCarpetA);
      row.rotation.x = -Math.PI / 2;
      row.position.set(0, 0.02, z);
      row.receiveShadow = true;
      group.add(row);

      // Gold saf line divider
      const line = new THREE.Mesh(new THREE.PlaneGeometry(carpetWidth, 0.04), matCarpetBorder);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.022, z + (rowDepth - 0.16) / 2 - 0.02);
      group.add(line);
    }

    // Tabir / Hijab Divider (between Male & Female saf)
    const tabirZ = 0.5;
    if (config.showTabir) {
      const matTabir = new THREE.MeshStandardMaterial({
        color: 0x2F6B4F,
        roughness: 0.6,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const tabirPoleMat = new THREE.MeshStandardMaterial({ color: 0xC9A227, metalness: 0.7 });

      // Tabir curtain panel
      const tabirMesh = new THREE.Mesh(new THREE.BoxGeometry(carpetWidth, 1.6, 0.05), matTabir);
      tabirMesh.position.set(0, 0.95, tabirZ);
      group.add(tabirMesh);

      // Tabir Top Rail
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, carpetWidth + 0.2, 8), tabirPoleMat);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, 1.8, tabirZ);
      group.add(rail);
    }

    // Female Saf Carpets (Belakang)
    let zB = tabirZ - 1.2;
    for (let i = 0; i < config.safFemale; i++) {
      const z = zB - i * rowDepth;
      if (z < -D / 2 + 1.0) break;
      const row = new THREE.Mesh(new THREE.PlaneGeometry(carpetWidth, rowDepth - 0.16), matCarpetB);
      row.rotation.x = -Math.PI / 2;
      row.position.set(0, 0.02, z);
      row.receiveShadow = true;
      group.add(row);

      const line = new THREE.Mesh(new THREE.PlaneGeometry(carpetWidth, 0.04), matCarpetBorder);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.022, z + (rowDepth - 0.16) / 2 - 0.02);
      group.add(line);
    }

    // Rak Al-Quran (Dinding Kiri)
    const rakGroup = new THREE.Group();
    const rakBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.6, 2.2), matDarkWood);
    rakGroup.add(rakBody);
    rakGroup.position.set(-W / 2 + 0.35, 0.8, 3.0);
    group.add(rakGroup);

    // Kotak Infaq Tromol Stainless
    const tromol = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.9, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xd0d4d8, metalness: 0.85, roughness: 0.2 })
    );
    tromol.position.set(W / 2 - 1.2, 0.45, 0);
    group.add(tromol);

    // Horn Speakers / Toa (Configurable Count)
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 });
    const toaPositions: [number, number, number][] = [];
    if (config.toaCount >= 2) {
      toaPositions.push([-6.2, H - 0.6, 7.5]);
      toaPositions.push([6.2, H - 0.6, 7.5]);
    }
    if (config.toaCount >= 4) {
      toaPositions.push([-6.2, H - 0.6, -7.5]);
      toaPositions.push([6.2, H - 0.6, -7.5]);
    }
    if (config.toaCount >= 6) {
      toaPositions.push([0, H - 0.6, 0]);
      toaPositions.push([0, H - 0.6, 9.5]);
    }

    toaPositions.forEach(([tx, ty, tz]) => {
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 16), matWhite);
      body.rotation.x = Math.PI * 0.9;
      body.position.set(tx, ty, tz);
      group.add(body);
    });

    // AC Units (Configurable Count)
    const acPositions: [number, number, number][] = [];
    if (config.acCount >= 1) acPositions.push([-W / 2 + 0.25, H - 1.3, -3.0]);
    if (config.acCount >= 2) acPositions.push([-W / 2 + 0.25, H - 1.3, 5.0]);
    if (config.acCount >= 3) acPositions.push([W / 2 - 0.25, H - 1.3, 5.0]);
    if (config.acCount >= 4) acPositions.push([W / 2 - 0.25, H - 1.3, -3.0]);
    if (config.acCount >= 5) acPositions.push([-W / 2 + 0.25, H - 1.3, -8.0]);
    if (config.acCount >= 6) acPositions.push([0, H - 1.3, -D / 2 + 0.25]);

    acPositions.forEach(([ax, ay, az]) => {
      const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.35), matWhite);
      acUnit.position.set(ax, ay, az);
      if (Math.abs(ax) > 3) {
        acUnit.rotation.y = ax > 0 ? -Math.PI / 2 : Math.PI / 2;
      }
      group.add(acUnit);

      // AC Grill detail
      const grill = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x333333 })
      );
      grill.position.set(0, -0.14, 0.18);
      acUnit.add(grill);
    });

    // Menara / Minaret (Optional 3D Mesh)
    if (config.minaretVisible) {
      const minaretGroup = new THREE.Group();
      const minX = W / 2 + 3.5;
      const minZ = -D / 2 + 2.5;
      const minH = 17.5;

      // Base pedestal
      const mBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.5, 3.0), matSand);
      mBase.position.set(0, 0.75, 0);
      minaretGroup.add(mBase);

      // Shaft octagonal/cylinder
      const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, minH, 16), matSand);
      mShaft.position.set(0, minH / 2 + 1.5, 0);
      minaretGroup.add(mShaft);

      // Balcony (Balkon adzan)
      const mBalcony = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.5, 0.6, 16), matGold);
      mBalcony.position.set(0, minH + 1.5, 0);
      minaretGroup.add(mBalcony);

      // Upper Pavilion Columns
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI * 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8), matSand);
        col.position.set(Math.sin(ang) * 1.2, minH + 1.5 + 1.1, Math.cos(ang) * 1.2);
        minaretGroup.add(col);
      }

      // Minaret Small Dome
      const mDome = new THREE.Mesh(new THREE.SphereGeometry(1.3, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), matRoof);
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

    // Animate camera target and radius inside room boundary
    const newTarget = isInterior ? new THREE.Vector3(0, 1.8, 1.5) : new THREE.Vector3(0, 2.0, 0);
    const newRadius = isInterior ? 5.8 : 28.0;
    const newPhi = isInterior ? 1.15 : Math.PI / 3.2;

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

    // Update Kiblat & Compass visibility
    if (qiblaGroupRef.current) {
      qiblaGroupRef.current.visible = config.showQibla;
    }
  }, [isInterior, config.showQibla]);

  // Focus Camera onto a specific position if requested (with interior safety containment)
  useEffect(() => {
    if (!focusPosition) return;
    const cfg = configRef.current;
    const target = new THREE.Vector3(
      isInterior ? THREE.MathUtils.clamp(focusPosition[0], -cfg.width / 2 + 2.0, cfg.width / 2 - 2.0) : focusPosition[0],
      Math.max(focusPosition[1], 1.2),
      isInterior ? THREE.MathUtils.clamp(focusPosition[2], -cfg.depth / 2 + 2.0, cfg.depth / 2 - 2.0) : focusPosition[2]
    );
    camState.current.fromTarget.copy(camState.current.target);
    camState.current.toTarget.copy(target);
    camState.current.fromRadius = camState.current.radius;
    camState.current.toRadius = isInterior ? 4.5 : Math.min(camState.current.radius, 14);
    camState.current.fromPhi = camState.current.phi;
    camState.current.toPhi = isInterior ? 1.1 : 0.65;
    camState.current.animStart = performance.now();
    camState.current.animDuration = 700;
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
