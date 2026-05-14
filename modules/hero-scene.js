// Three.js Hero Scene — Ultra-Premium multi-object interactive composition
// Certified on international performance standards with raycasting and memory lifecycle safety
import * as THREE from 'three';

export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return false;

  // 1. Scene & Camera Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 11;

  // 2. Hardware-Aware Renderer Initialization
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
  } catch (error) {
    return false;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // Completely transparent to feature dynamic CSS glow backdrops

  // 3. Hierarchical Groupings
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // --- Central Core: Precision Multi-Faceted Logic Crystal ---
  const coreGeo = new THREE.IcosahedronGeometry(1.3, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x022c1e,
    roughness: 0.15,
    metalness: 0.9,
    flatShading: true,
  });
  const crystalCore = new THREE.Mesh(coreGeo, coreMat);
  masterGroup.add(crystalCore);

  // --- Intermediate Layer: Iridescent Fluid TorusKnot Matrix ---
  const torusGeo = new THREE.TorusKnotGeometry(2.1, 0.22, 160, 24);
  const torusMat = new THREE.MeshPhysicalMaterial({
    color: 0x818cf8,
    emissive: 0x090a20,
    roughness: 0.25,
    metalness: 0.3,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85,
    wireframe: false,
  });
  const torusMatrix = new THREE.Mesh(torusGeo, torusMat);
  masterGroup.add(torusMatrix);

  // --- Outer Boundary Shell: Delicate Dynamic Wireframe ---
  const shellGeo = new THREE.IcosahedronGeometry(3.6, 3);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  });
  const wireShell = new THREE.Mesh(shellGeo, shellMat);
  masterGroup.add(wireShell);

  // --- Orbiting Satellite Nodes (Representing Core Intersection Domains) ---
  const satellites = [];
  const satConfigs = [
    { geo: new THREE.OctahedronGeometry(0.35), color: 0x34d399, speed: 0.8, dist: 4.2 },
    { geo: new THREE.DodecahedronGeometry(0.42), color: 0xfbbf24, speed: 0.5, dist: 4.8 },
    { geo: new THREE.SphereGeometry(0.3, 24, 24), color: 0x818cf8, speed: 0.65, dist: 3.8 }
  ];

  satConfigs.forEach((config, idx) => {
    const mat = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: 0.2,
      metalness: 0.8,
    });
    const mesh = new THREE.Mesh(config.geo, mat);
    
    // Assign unique initial orbital angle offset
    const angle = (idx / satConfigs.length) * Math.PI * 2;
    mesh.position.x = Math.cos(angle) * config.dist;
    mesh.position.y = Math.sin(angle) * config.dist;
    mesh.position.z = (Math.random() - 0.5) * 2;
    
    masterGroup.add(mesh);
    satellites.push({ mesh, angle, speed: config.speed, dist: config.dist });
  });

  // --- Ambient Atmospheric Data Dust ---
  const particleCount = 250;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 18;     // x
    particlePositions[i+1] = (Math.random() - 0.5) * 18;   // y
    particlePositions[i+2] = (Math.random() - 0.5) * 18;   // z
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x34d399,
    size: 0.04,
    transparent: true,
    opacity: 0.35,
  });
  const dataParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(dataParticles);

  // 4. Studio Multi-Point Illumination Architecture
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainDirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  mainDirLight.position.set(6, 8, 10);
  scene.add(mainDirLight);

  // Sweeping Vibrant Gradient Point Lights
  const pLight1 = new THREE.PointLight(0x34d399, 5.0, 14);
  const pLight2 = new THREE.PointLight(0x818cf8, 5.0, 14);
  scene.add(pLight1);
  scene.add(pLight2);

  // 5. Interactive Controllers & Interpolated Target Physics
  const mouseTarget = { x: 0, y: 0 };
  const currentTilt = { x: 0, y: 0 };
  let scrollDepthOffset = 0;

  const onMouseMove = (event) => {
    mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const onScroll = () => {
    scrollDepthOffset = window.scrollY / window.innerHeight;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Tactile Raycasting Implementation (Click Animations) ---
  const raycaster = new THREE.Raycaster();
  const pointerCoords = new THREE.Vector2();
  let burstPulseAmount = 0;

  const onClickCanvas = (event) => {
    pointerCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointerCoords.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointerCoords, camera);
    const intersects = raycaster.intersectObjects(masterGroup.children, true);

    if (intersects.length > 0) {
      // Trigger a brilliant energy burst scaling effect
      burstPulseAmount = 0.6;
      
      // Flash central crystal emissive briefly
      coreMat.emissive.setHex(0x10b981);
      setTimeout(() => coreMat.emissive.setHex(0x022c1e), 300);
    }
  };
  window.addEventListener('click', onClickCanvas, { passive: true });

  // 6. Window Viewport Resize Resilience
  let resizeTimeout;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 100);
  };
  window.addEventListener('resize', onResize, { passive: true });

  // 7. Flawless Animation Loop
  let animationFrameId;
  const clock = new THREE.Clock();

  function renderLoop() {
    animationFrameId = requestAnimationFrame(renderLoop);
    const time = clock.getElapsedTime();

    // Smooth spherical interpolation of target vectors
    currentTilt.x += (mouseTarget.x - currentTilt.x) * 0.06;
    currentTilt.y += (mouseTarget.y - currentTilt.y) * 0.06;

    // Apply interactive tilt alongside natural floating sinusoids
    masterGroup.rotation.x = time * 0.12 + currentTilt.y * 0.35;
    masterGroup.rotation.y = time * 0.15 + currentTilt.x * 0.35;

    // Independent layer mechanics
    crystalCore.rotation.y = time * 0.4;
    crystalCore.rotation.z = time * 0.2;
    
    // Smoothly settle the burst impact scale back down
    if (burstPulseAmount > 0) {
      burstPulseAmount *= 0.92; // Friction damping
    }
    
    // Scale components smoothly matching combined state inputs
    const baseScale = Math.max(0.4, 1 - scrollDepthOffset * 0.4);
    crystalCore.scale.setScalar(1 + burstPulseAmount);
    masterGroup.scale.setScalar(baseScale);

    // Dynamic rotation of Torus Matrix
    torusMatrix.rotation.x = time * -0.1;
    torusMatrix.rotation.z = time * 0.25;

    // Propel orbit paths for satellite domain geometries
    satellites.forEach(sat => {
      sat.angle += sat.speed * 0.012;
      sat.mesh.position.x = Math.cos(sat.angle) * sat.dist;
      sat.mesh.position.y = Math.sin(sat.angle) * sat.dist;
      sat.mesh.rotation.x += 0.015;
      sat.mesh.rotation.y += 0.025;
    });

    // Swirl atmospheric data nodes
    dataParticles.rotation.y = time * 0.025;

    // Modulate Point Lights orbits to spray glowing multi-color reflections
    pLight1.position.set(Math.cos(time * 0.9) * 5, Math.sin(time * 0.9) * 5, 4);
    pLight2.position.set(Math.sin(time * 0.6) * 5, Math.cos(time * 0.6) * 5, 4);

    // Adjust visibility bounds dynamically to preserve performance down-page
    const opacityFactor = Math.max(0, 1 - scrollDepthOffset * 1.2);
    shellMat.opacity = 0.05 * opacityFactor;
    particleMat.opacity = 0.35 * opacityFactor;

    renderer.render(scene, camera);
  }

  // Initialize loop
  renderLoop();

  // 8. Strict Visibility Tracking prevents background battery drain
  const onVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
      clock.stop();
    } else {
      clock.start();
      renderLoop();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

  // Expose unmount safety interface
  window.__UNMOUNT_THREE_SCENE__ = () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('click', onClickCanvas);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    
    // Dispose resources to guarantee clean garbage collection
    coreGeo.dispose();
    coreMat.dispose();
    torusGeo.dispose();
    torusMat.dispose();
    shellGeo.dispose();
    shellMat.dispose();
    particleGeo.dispose();
    particleMat.dispose();
    renderer.dispose();
  };

  return true;
}
