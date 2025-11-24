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
const contentTexture = textureLoader.load("TestText.png");
contentTexture.flipY = false;
contentTexture.colorSpace = THREE.SRGBColorSpace;


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
let contentMaterial = null;

loader.load('./book_V03.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    animations = gltf.animations;

    if (animations.length > 0) {
        const action = mixer.clipAction(animations[1]);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();

        const action2 = mixer.clipAction(animations[2]);
        action2.setLoop(THREE.LoopOnce);
        action2.clampWhenFinished = true;
        action2.play();
    }
}, undefined, (err) => console.error(err));

loader.load('./TestPages.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    animations = gltf.animations;

    const noiseTexture = textureLoader.load('Noise_Mask.png');
    noiseTexture.flipY = false;

    gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === 'R_Decal') {
            contentMaterial = child.material;

            contentMaterial.map = contentTexture;

            contentMaterial.alphaMap = noiseTexture;
            contentMaterial.transparent = true;
            contentMaterial.alphaTest = 1;
            contentMaterial.depthWrite = false;
            contentMaterial.needsUpdate = true;

        }
    })
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

function revealContent() {
    gsap.to(contentMaterial, {
        alphaTest: -2,
        duration: 7,
        ease: "power1.inOut"
    });
}

setTimeout(revealContent, 1000);

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