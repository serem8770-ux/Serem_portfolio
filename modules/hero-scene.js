// Three.js Hero Scene — persistent 3D composition with scroll-reactive morphing
import * as THREE from 'three';

export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 11;

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
  renderer.setClearColor(0x000000, 0);

  // Master group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // Central crystal core
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

  // Torus knot shell
  const torusGeo = new THREE.TorusKnotGeometry(2.1, 0.22, 160, 24);
  const torusMat = new THREE.MeshPhysicalMaterial({
    color: 0x818cf8,
    emissive: 0x090a20,
    roughness: 0.25,
    metalness: 0.3,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85,
  });
  const torusMatrix = new THREE.Mesh(torusGeo, torusMat);
  masterGroup.add(torusMatrix);

  // Wireframe shell
  const shellGeo = new THREE.IcosahedronGeometry(3.6, 3);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  });
  const wireShell = new THREE.Mesh(shellGeo, shellMat);
  masterGroup.add(wireShell);

  // Orbiting satellites
  const satellites = [];
  const satConfigs = [
    { geo: new THREE.OctahedronGeometry(0.35), color: 0x34d399, speed: 0.8, dist: 4.2 },
    { geo: new THREE.DodecahedronGeometry(0.42), color: 0xfbbf24, speed: 0.5, dist: 4.8 },
    { geo: new THREE.SphereGeometry(0.3, 24, 24), color: 0x818cf8, speed: 0.65, dist: 3.8 }
  ];

  satConfigs.forEach((config, idx) => {
    const mat = new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.2, metalness: 0.8 });
    const mesh = new THREE.Mesh(config.geo, mat);
    const angle = (idx / satConfigs.length) * Math.PI * 2;
    mesh.position.x = Math.cos(angle) * config.dist;
    mesh.position.y = Math.sin(angle) * config.dist;
    mesh.position.z = (Math.random() - 0.5) * 2;
    masterGroup.add(mesh);
    satellites.push({ mesh, angle, speed: config.speed, dist: config.dist });
  });

  // Data particles
  const particleCount = 250;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 18;
    particlePositions[i + 1] = (Math.random() - 0.5) * 18;
    particlePositions[i + 2] = (Math.random() - 0.5) * 18;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x34d399, size: 0.04, transparent: true, opacity: 0.35 });
  const dataParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(dataParticles);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
  mainLight.position.set(6, 8, 10);
  scene.add(mainLight);

  const pLight1 = new THREE.PointLight(0x34d399, 5.0, 14);
  const pLight2 = new THREE.PointLight(0x818cf8, 5.0, 14);
  scene.add(pLight1);
  scene.add(pLight2);

  // Interaction state
  const mouseTarget = { x: 0, y: 0 };
  const currentTilt = { x: 0, y: 0 };
  let scrollProgress = 0;

  // Section color palette for scroll-driven transitions
  const sectionColors = [
    { core: 0x34d399, emissive: 0x022c1e, light: 0x34d399 },  // Hero (green)
    { core: 0x34d399, emissive: 0x022c1e, light: 0x34d399 },  // About (green)
    { core: 0x818cf8, emissive: 0x0a0c30, light: 0x818cf8 },  // Expertise (indigo)
    { core: 0xfbbf24, emissive: 0x2c1e02, light: 0xfbbf24 },  // Projects (amber)
    { core: 0x34d399, emissive: 0x022c1e, light: 0x34d399 },  // Contact (green)
  ];
  const currentColor = { r: 0.204, g: 0.831, b: 0.6 }; // #34d399
  const targetColor = { r: 0.204, g: 0.831, b: 0.6 };

  const onMouseMove = (event) => {
    mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const onScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;

    // Determine which section color to target
    const sectionIdx = Math.min(Math.floor(scrollProgress * sectionColors.length), sectionColors.length - 1);
    const target = sectionColors[sectionIdx];
    const col = new THREE.Color(target.core);
    targetColor.r = col.r;
    targetColor.g = col.g;
    targetColor.b = col.b;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Raycasting — use canvas events since pointer-events is none on canvas
  // Re-enable pointer events only on hero section
  const raycaster = new THREE.Raycaster();
  const pointerCoords = new THREE.Vector2();
  let burstPulseAmount = 0;

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('click', (event) => {
      pointerCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerCoords.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointerCoords, camera);
      const intersects = raycaster.intersectObjects(masterGroup.children, true);
      if (intersects.length > 0) {
        burstPulseAmount = 0.5;
        coreMat.emissive.setHex(0x10b981);
        setTimeout(() => coreMat.emissive.setHex(0x022c1e), 300);
      }
    }, { passive: true });
  }

  // Resize
  let resizeTimeout;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 100);
  };
  window.addEventListener('resize', onResize, { passive: true });

  // Animation loop
  let animationFrameId;
  const clock = new THREE.Clock();

  function renderLoop() {
    animationFrameId = requestAnimationFrame(renderLoop);
    const time = clock.getElapsedTime();

    // Smooth tilt interpolation
    currentTilt.x += (mouseTarget.x - currentTilt.x) * 0.06;
    currentTilt.y += (mouseTarget.y - currentTilt.y) * 0.06;

    // Scroll-driven 3D transforms — the scene LIVES through the page
    const scrollDepth = scrollProgress * 4; // 0 to 4 across page length

    // Master group position drifts as user scrolls
    masterGroup.position.x = Math.sin(scrollDepth * 0.5) * 2;
    masterGroup.position.y = -scrollDepth * 0.3;

    // Master group rotation combines natural + interactive + scroll
    masterGroup.rotation.x = time * 0.1 + currentTilt.y * 0.3 + scrollDepth * 0.15;
    masterGroup.rotation.y = time * 0.12 + currentTilt.x * 0.3 + scrollDepth * 0.1;

    // Crystal core
    crystalCore.rotation.y = time * 0.4;
    crystalCore.rotation.z = time * 0.2;

    // Burst pulse decay
    if (burstPulseAmount > 0) burstPulseAmount *= 0.92;
    crystalCore.scale.setScalar(1 + burstPulseAmount);

    // Scroll-driven scale — shrinks slightly as you scroll, but never disappears
    const scrollScale = Math.max(0.5, 1 - scrollProgress * 0.5);
    masterGroup.scale.setScalar(scrollScale);

    // Torus matrix rotation
    torusMatrix.rotation.x = time * -0.1 + scrollDepth * 0.05;
    torusMatrix.rotation.z = time * 0.25;

    // Satellite orbits — speed up slightly with scroll
    satellites.forEach(sat => {
      sat.angle += sat.speed * 0.012 * (1 + scrollProgress * 0.5);
      sat.mesh.position.x = Math.cos(sat.angle) * sat.dist;
      sat.mesh.position.y = Math.sin(sat.angle) * sat.dist;
      sat.mesh.rotation.x += 0.015;
      sat.mesh.rotation.y += 0.025;
    });

    // Particle swirl
    dataParticles.rotation.y = time * 0.025 + scrollDepth * 0.02;

    // Point lights orbit
    pLight1.position.set(Math.cos(time * 0.9) * 5, Math.sin(time * 0.9) * 5, 4);
    pLight2.position.set(Math.sin(time * 0.6) * 5, Math.cos(time * 0.6) * 5, 4);

    // Scroll-driven opacity — scene fades gently but never fully
    const globalOpacity = Math.max(0.15, 1 - scrollProgress * 0.7);
    shellMat.opacity = 0.05 * globalOpacity;
    particleMat.opacity = 0.35 * globalOpacity;
    torusMat.opacity = 0.85 * globalOpacity;

    // Smooth section-aware color transition
    currentColor.r += (targetColor.r - currentColor.r) * 0.02;
    currentColor.g += (targetColor.g - currentColor.g) * 0.02;
    currentColor.b += (targetColor.b - currentColor.b) * 0.02;
    coreMat.color.setRGB(currentColor.r, currentColor.g, currentColor.b);
    particleMat.color.setRGB(currentColor.r, currentColor.g, currentColor.b);
    pLight1.color.setRGB(currentColor.r, currentColor.g, currentColor.b);

    renderer.render(scene, camera);
  }

  renderLoop();

  // Visibility tracking
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

  // Cleanup
  window.__UNMOUNT_THREE_SCENE__ = () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    coreGeo.dispose(); coreMat.dispose();
    torusGeo.dispose(); torusMat.dispose();
    shellGeo.dispose(); shellMat.dispose();
    particleGeo.dispose(); particleMat.dispose();
    renderer.dispose();
  };

  return true;
}
