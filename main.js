import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Scène ---
const scene = new THREE.Scene();

// --- Caméra ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1.5, 3, 0);
camera.lookAt(0, 0, 0);

const canvas = document.getElementById("bookCanvas");

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// --- Lumière ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// --- Raycaster ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(9999, 9999);
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- Loader ---
const loader = new GLTFLoader();
let mixer;
let animations = [];

loader.load('./BookTest.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    animations = gltf.animations;

    if (animations.length > 0) {
        const action = mixer.clipAction(animations[0]);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();
    }
}, undefined, (err) => console.error(err));

const clock = new THREE.Clock();

let lastIntersect = null;

function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    /*if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.name === "Bookmark" && lastIntersect !== obj) {
            const clip = THREE.AnimationClip.findByName(animations, "BookmarkSelected");
            if (clip) {
                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                if (!action.isRunning())
                    action.reset().setLoop(THREE.LoopOnce).play();
            }
        }
        lastIntersect = obj;
    }
    else {
        lastIntersect = null;
    }*/
    renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function openNewProject(projectName) {
    //Play open animation
    //Update pages textures
}
