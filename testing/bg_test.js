
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  renderer / scene / camera                                         */
/* ------------------------------------------------------------------ */
const canvas   = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene    = new THREE.Scene();
scene.fog      = new THREE.Fog(0x000000, 4, 26);   // darker backdrop

const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 50);
camera.position.z = 7;

// size of the invisible box (world units)
const LIMIT_X = 8;
const LIMIT_Y = 6;

// how “bouncy” the walls are (1 = perfect bounce, 0.6 = softer)
const RESTITUTION = 0.8;


function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

/* ------------------------------------------------------------------ */
/*  geometry / material                                               */
/* ------------------------------------------------------------------ */
const geom = new THREE.IcosahedronGeometry(0.6, 0);
const mat  = new THREE.MeshStandardMaterial({
  color: 0x0d6efd,
  flatShading: true,
  metalness: 0.2,
  roughness: 0.9,
  transparent: true,
  opacity: 0.4
});

/* ------------------------------------------------------------------ */
/*  instanced mesh setup                                              */
/* ------------------------------------------------------------------ */
const COUNT       = 40;
const ROCK_DEPTH  = -2;                 // every rock sits here
const mesh        = new THREE.InstancedMesh(geom, mat, COUNT);
scene.add(mesh);

const data = [];                        // per-instance state
for (let i = 0; i < COUNT; i++) {
  const o = new THREE.Object3D();
  o.position.set(
    THREE.MathUtils.randFloatSpread(16),
    THREE.MathUtils.randFloatSpread(10),
    ROCK_DEPTH
  );
  o.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  o.updateMatrix();
  mesh.setMatrixAt(i, o.matrix);

  data.push({
    axis : new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
    vel  : new THREE.Vector3(),                 // 2-D velocity (x, y)
    base : 0.01 + Math.random() * 0.02          // gentle upward drift
  });
}

/* ------------------------------------------------------------------ */
/*  lights                                                            */
/* ------------------------------------------------------------------ */
scene.add(new THREE.AmbientLight(0xffffff, 0.9));
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(5, 10, 7);
scene.add(dir);

/* ------------------------------------------------------------------ */
/*  mouse tracking                                                    */
/* ------------------------------------------------------------------ */
const mouse = new THREE.Vector2(999, 999);        // off-screen default

window.addEventListener('pointermove', e => {
  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('pointerleave', () => mouse.set(999, 999));

/* helper: project mouse to world space on z = ROCK_DEPTH */
function mouseWorldPos() {
  const v = new THREE.Vector3(mouse.x, mouse.y, 0.5); // NDC → clip
  v.unproject(camera);                                // clip → world
  const t = (ROCK_DEPTH - camera.position.z) / (v.z - camera.position.z);
  return camera.position.clone().lerp(v, t);          // point on plane
}

/* ------------------------------------------------------------------ */
/*  animation loop                                                    */
/* ------------------------------------------------------------------ */
const G        = 0.0008;          // attraction strength
const DAMPING  = 0.94;          // velocity decay

function tick() {
  const attract = mouseWorldPos();

  mesh.instanceMatrix.needsUpdate = true;

  for (let i = 0; i < COUNT; i++) {
    const o = new THREE.Object3D();
    mesh.getMatrixAt(i, o.matrix);
    o.matrix.decompose(o.position, o.quaternion, o.scale);

    /* 0. gentle upward drift, wrap at top */
    /* 0. gentle drift (keep or drop) */
    o.position.y += data[i].base;

    /* 0b. bounce off invisible walls */
    if (o.position.x >  LIMIT_X){
      o.position.x  =  LIMIT_X;
      data[i].vel.x = -data[i].vel.x * RESTITUTION;
    }
    if (o.position.x < -LIMIT_X){
      o.position.x  = -LIMIT_X;
      data[i].vel.x = -data[i].vel.x * RESTITUTION;
    }
    if (o.position.y >  LIMIT_Y){
      o.position.y  =  LIMIT_Y;
      data[i].vel.y = -data[i].vel.y * RESTITUTION;
    }
    if (o.position.y < -LIMIT_Y){
      o.position.y  = -LIMIT_Y;
      data[i].vel.y = -data[i].vel.y * RESTITUTION;
    }


    /* 1. 2-D attraction toward mouse point */
    const dir2D = new THREE.Vector2(
      attract.x - o.position.x,
      attract.y - o.position.y
    );
    const distSq = dir2D.lengthSq() + 0.05;      // avoid /0
    dir2D.normalize();

    const accel = G / distSq;
    data[i].vel.x += dir2D.x * accel;
    data[i].vel.y += dir2D.y * accel;

    data[i].vel.multiplyScalar(DAMPING);         // friction
    o.position.x += data[i].vel.x;
    o.position.y += data[i].vel.y;

    /* 2. slow self-rotation */
    o.rotateOnAxis(data[i].axis, 0.01);

    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
