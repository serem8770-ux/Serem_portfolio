// Three.js Hero Scene — Premium multi-object interactive 3D composition
import * as THREE from 'three';

export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0); // Transparent to show CSS glows

  // Main Group for easy rotation and parallax
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Central Glossy Shape: TorusKnot
  const torusKnotGeo = new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32);
  const materialPrimary = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x042f1e,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: false
  });
  const torusKnot = new THREE.Mesh(torusKnotGeo, materialPrimary);
  mainGroup.add(torusKnot);

  // 2. Outer Delicate Wireframe Shell
  const icosaGeo = new THREE.IcosahedronGeometry(3.2, 2);
  const materialWire = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const wireShell = new THREE.Mesh(icosaGeo, materialWire);
  mainGroup.add(wireShell);

  // 3. Floating Companion Geometries (Satellites)
  const satellites = [];
  const satGeos = [
    new THREE.OctahedronGeometry(0.4),
    new THREE.DodecahedronGeometry(0.5),
    new THREE.SphereGeometry(0.35, 32, 32)
  ];
  const satColors = [0x818cf8, 0xfbbf24, 0x34d399];

  satGeos.forEach((geo, index) => {
    const mat = new THREE.MeshStandardMaterial({
      color: satColors[index],
      roughness: 0.3,
      metalness: 0.6
    });
    const mesh = new THREE.Mesh(geo, mat);
    
    // Initial random spread
    const angle = (index / satGeos.length) * Math.PI * 2;
    const distance = 3.5;
    mesh.position.x = Math.cos(angle) * distance;
    mesh.position.y = Math.sin(angle) * distance;
    mesh.position.z = (Math.random() - 0.5) * 2;
    
    mainGroup.add(mesh);
    satellites.push({
      mesh,
      orbitSpeed: 0.5 + Math.random() * 0.5,
      angle,
      distance
    });
  });

  // 4. Ambient Floating Dust Particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 15;     // x
    particlePos[i+1] = (Math.random() - 0.5) * 15;   // y
    particlePos[i+2] = (Math.random() - 0.5) * 15;   // z
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x34d399,
    size: 0.05,
    transparent: true,
    opacity: 0.4
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 5. Dynamic Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(5, 5, 6);
  scene.add(dirLight);

  // Colored Point Lights for vibrant gradient illumination
  const light1 = new THREE.PointLight(0x34d399, 4.0, 10);
  const light2 = new THREE.PointLight(0x818cf8, 4.0, 10);
  scene.add(light1);
  scene.add(light2);

  // Mouse tracking smoothing
  const targetTarget = { x: 0, y: 0 };
  const currentTarget = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    targetTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize listener
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // Scroll-based fade/scaling
  let scrollFactor = 1;
  window.addEventListener('scroll', () => {
    scrollFactor = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.8));
  }, { passive: true });

  // Animation Loop
  let animId;
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Lerp mouse target for smooth liquid parallax
    currentTarget.x += (targetTarget.x - currentTarget.x) * 0.05;
    currentTarget.y += (targetTarget.y - currentTarget.y) * 0.05;

    // Rotate main group smoothly
    mainGroup.rotation.x = t * 0.15 + currentTarget.y * 0.3;
    mainGroup.rotation.y = t * 0.2 + currentTarget.x * 0.3;

    // Rotate internal TorusKnot independently
    torusKnot.rotation.z = t * 0.25;

    // Animate satellites orbiting
    satellites.forEach(sat => {
      sat.angle += sat.orbitSpeed * 0.01;
      sat.mesh.position.x = Math.cos(sat.angle) * sat.distance;
      sat.mesh.position.y = Math.sin(sat.angle) * sat.distance;
      sat.mesh.rotation.x += 0.01;
      sat.mesh.rotation.y += 0.02;
    });

    // Orbit point lights to cast dynamic sweeping gradients
    light1.position.set(Math.cos(t * 0.8) * 4, Math.sin(t * 0.8) * 4, 3);
    light2.position.set(Math.sin(t * 0.5) * 4, Math.cos(t * 0.5) * 4, 3);

    // Slowly drift particles
    particles.rotation.y = t * 0.02;

    // Adjust opacities and scales based on scroll depth
    mainGroup.scale.setScalar(0.5 + scrollFactor * 0.5);
    materialWire.opacity = 0.08 * scrollFactor;
    particleMat.opacity = 0.4 * scrollFactor;

    renderer.render(scene, camera);
  }

  animate();

  // Lifecycle optimizations
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
      clock.stop();
    } else {
      clock.start();
      animate();
    }
  });
}
