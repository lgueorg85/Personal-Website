import * as THREE from 'three';

// === Utility Functions ===
function getColorFromCSS(varName) {
  const style = getComputedStyle(document.documentElement);
  const hex = style.getPropertyValue(varName).trim() || '#ffffff';
  return new THREE.Color(hex);
}

// === Canvas & Renderer ===
const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// === Scene & Camera ===
const scene = new THREE.Scene();
let fogColor = getColorFromCSS('--clr-bg');
// tell Three.js to clear the canvas to that same color:
renderer.setClearColor(fogColor, 1);
scene.fog = new THREE.Fog(fogColor, 8, 20);

const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 50);
camera.position.z = 10;

// === Geometry, Color & Material ===
const baseColor = getColorFromCSS('--clr-primary');
// 2) Extract its HSL once
const baseHSL = { h: 0, s: 0, l: 0 };
baseColor.getHSL(baseHSL);

const geom = new THREE.IcosahedronGeometry(0.6, 0); // low-poly
const mat = new THREE.MeshStandardMaterial({
  color: baseColor,
  flatShading: true,
  metalness: 0.2,
  roughness: 0.9,
});

// === Instanced Mesh Setup ===
const COUNT = 40;
const mesh = new THREE.InstancedMesh(geom, mat, COUNT);
scene.add(mesh);

// === Instance Data (positions, speeds, axes) ===
const data = [];
for (let i = 0; i < COUNT; i++) {
  const o = new THREE.Object3D();
  o.position.set(
    THREE.MathUtils.randFloatSpread(16),
    THREE.MathUtils.randFloatSpread(10),
    THREE.MathUtils.randFloatSpread(8)
  );
  o.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  o.updateMatrix();
  mesh.setMatrixAt(i, o.matrix);

  data.push({
    speed: 0.0005 + Math.random() * 0.0015,
    axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
  });
}

// === Lighting ===
scene.add(new THREE.AmbientLight(0xffffff, 0.9));
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(5, 10, 7);
scene.add(dir);

// === Resize Handler ===
function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

// === Theme Update Handler ===
function updateThemeInScene() {
  fogColor = getColorFromCSS('--clr-bg');
  renderer.setClearColor(fogColor, 1);
  scene.fog.color = fogColor;

  const newPrimary = getColorFromCSS('--clr-primary');
  mat.color.set(newPrimary);

  console.log(
    'Updated background to', fogColor.getStyle(),
    'and shape color to', newPrimary.getStyle()
  );
}
window.addEventListener('themeChange', updateThemeInScene);

// === Animation Loop ===
function tick(time) {
  time *= 0.01; // ms → seconds

  mesh.instanceMatrix.needsUpdate = true;
  for (let i = 0; i < COUNT; i++) {
    const o = new THREE.Object3D();
    mesh.getMatrixAt(i, o.matrix);
    o.matrix.decompose(o.position, o.quaternion, o.scale);

    // Drift upward & wrap
    o.position.y += data[i].speed * 20;
    if (o.position.y > 6) o.position.y = -6;

    // Slow rotation
    o.rotateOnAxis(data[i].axis, 0.01);

    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  }

  // Slowly shift the hue:
  const hue = (baseHSL.h + time * 0.005) % 1;
  mat.color.setHSL(hue, baseHSL.s, baseHSL.l);
  
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* 
bg.js
──────────────────────────────────────────────────────────────
Animated low-poly icosahedrons that drift and are pulled in X–Y
toward the mouse, but stay fixed on a common Z plane (no fly-toward
effect). Works with the import-map setup in index.html.
──────────────────────────────────────────────────────────────
*/
