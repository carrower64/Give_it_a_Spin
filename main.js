import * as THREE from './three.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js';
import { OrbitControls } from './oc.js';

let width = window.innerWidth;
let height = window.innerHeight;

const scene = new THREE.Scene();
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(2);
renderer.setSize(width, height);

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 0, 20);

const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 10, 10);
scene.add(light);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshStandardMaterial({ color: "#00ff83", roughness: 0.5 })
);
scene.add(sphere);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ vertexColors: true });
const starVertices = [];
const starColors = [];
const minDistance = 100; 

for (let i = 0; i < 10000; i++) {
  let x, y, z;
  do {
    x = (Math.random() - 0.5) * 1000;
    y = (Math.random() - 0.5) * 1000;
    z = (Math.random() - 0.5) * 1000;
  } while (Math.sqrt(x * x + y * y + z * z) < minDistance);

  starVertices.push(x, y, z);

  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  starColors.push(color.r, color.g, color.b);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
starGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(starColors, 3)
);

const star = new THREE.Points(starGeometry, starMaterial);
scene.add(star);

function animate() {
  controls.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(sphere.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / width) * 255),
      Math.round((e.pageY / height) * 255),
      150,
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
