import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Scène ---
const scene = new THREE.Scene();

// --- Caméra ---
const startCamPos = new THREE.Vector3(1.5, 5, 0);
const endCamPos = new THREE.Vector3(0.25, 2.5, 0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(startCamPos);
camera.lookAt(0, 0, 0);

const canvas = document.getElementById("bookCanvas");

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// --- Texture ---
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("TestPaper.png");
texture.flipY = false;
texture.colorSpace = THREE.SRGBColorSpace;

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

loader.load('./book_V02.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    animations = gltf.animations;

    if (animations.length > 0) {
        const action = mixer.clipAction(animations[4]);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();

        const action2 = mixer.clipAction(animations[1]);
        action2.setLoop(THREE.LoopOnce);
        action2.clampWhenFinished = true;
        action2.play();
    }

    model.getObjectByName("R_Pages").material.map = texture;
    model.getObjectByName("R_Pages").material.needsUpdate = true;
    model.getObjectByName("L_Pages").material.map = texture;
    model.getObjectByName("L_Pages").material.needsUpdate = true;
}, undefined, (err) => console.error(err));

const clock = new THREE.Clock();

let lastIntersect = null;

gsap.to(camera.position, {
    x: endCamPos.x,
    y: endCamPos.y,
    z: endCamPos.z,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: () => {
        camera.lookAt(0, 0, 0);
    }
});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) {
        mixer.update(delta);
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        console.log(obj.name);
        //if (obj.name === "Bookmark" && lastIntersect !== obj) {
        //    const clip = THREE.AnimationClip.findByName(animations, "BookmarkSelected");
        //    if (clip) {
        //        const action = mixer.clipAction(clip);
        //        action.setLoop(THREE.LoopOnce);
        //        action.clampWhenFinished = true;
        //        if (!action.isRunning())
        //            action.reset().setLoop(THREE.LoopOnce).play();
        //    }
        //}
        //lastIntersect = obj;
    }
    else {
        lastIntersect = null;
    }
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
