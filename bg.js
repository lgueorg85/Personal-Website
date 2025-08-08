import * as THREE from 'three';        // import via the map

const canvas  = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

const scene = new THREE.Scene();
scene.fog   = new THREE.Fog(0xf8f9fa, 8, 20);

const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 50);
camera.position.z = 10;

/* Resize handler */
function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

/* Geometry & material */
const geom = new THREE.IcosahedronGeometry(0.6, 0); // low-poly
const mat  = new THREE.MeshStandardMaterial({
  color: 0x0d6efd,  // your primary blue
  flatShading: true,
  metalness: 0.2,
  roughness: 0.9,
});

/* Use InstancedMesh for performance */
const COUNT = 40;
const mesh  = new THREE.InstancedMesh(geom, mat, COUNT);
scene.add(mesh);

/* Random start positions & speeds */
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

/* Lighting */
scene.add(new THREE.AmbientLight(0xffffff, 0.9));
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(5, 10, 7);
scene.add(dir);

/* Animation loop */
function tick(time) {
  time *= 0.01; // ms → seconds

  mesh.instanceMatrix.needsUpdate = true;
  for (let i = 0; i < COUNT; i++) {
    const o = new THREE.Object3D();
    mesh.getMatrixAt(i, o.matrix);
    o.matrix.decompose(o.position, o.quaternion, o.scale);

    // drift upward & wrap
    o.position.y += data[i].speed * 20;
    if (o.position.y > 6) o.position.y = -6;

    // slow rotation
    o.rotateOnAxis(data[i].axis, 0.01);

    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* bg.js  ──────────────────────────────────────────────────────────────
   Animated low-poly icosahedrons that drift and are pulled in X–Y
   toward the mouse, but stay fixed on a common Z plane (no fly-toward
   effect).  Works with the import-map setup in index.html.
────────────────────────────────────────────────────────────────────── */
