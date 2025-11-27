import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { projects, AddCarouselPages, getPages } from './content.js';

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
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;
});

let mixer;
let animations = [];
let rContentMaterial = null;
let lContentMaterial = null;
const noiseTexture = textureLoader.load('Noise_Mask.png');

async function init()
{
    // --- Loader ---
    const loader = new GLTFLoader();

    await loader.load('./Pages.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        animations = gltf.animations;

        gltf.scene.traverse((child) => {
            if (child.isMesh && child.name === 'R_Decal') {
                rContentMaterial = child.material;

                rContentMaterial.map = contentTexture;
                rContentMaterial.alphaMap = noiseTexture;
                rContentMaterial.transparent = true;
                rContentMaterial.depthWrite = false;
                rContentMaterial.alphaTest = 1;
                rContentMaterial.needsUpdate = true;
            }
            else if (child.isMesh && child.name === 'L_Decal') {
                lContentMaterial = child.material;

                lContentMaterial.map = contentTexture;
                lContentMaterial.alphaMap = noiseTexture;
                lContentMaterial.transparent = true;
                lContentMaterial.depthWrite = false;
                lContentMaterial.alphaTest = 1;
                lContentMaterial.needsUpdate = true;
            }
        })
    }, undefined, (err) => console.error(err));

    await loader.load('./book_V03.glb', (gltf) => {
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
}

init();

const clock = new THREE.Clock();

let lastIntersect = null;

const clickListeners = [];

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
        if (obj.name.substring(0, 8) === "Bookmark" && lastIntersect !== obj) {
            const clip = THREE.AnimationClip.findByName(animations, "BookmarkSelected");
            if (clip) {
                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                if (!action.isRunning())
                    action.reset().setLoop(THREE.LoopOnce).play();
            }
            document.body.style.cursor = 'pointer';
            addClickListener(() => openNewProject(obj.name.substring(8)));
        }
        else if (obj.name.substring(0, 8) !== "Bookmark")
        {
            document.body.style.cursor = 'default';
            resetClickListeners();
        }
        lastIntersect = obj;
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

function updatePages(project)
{
    const pages = getPages(project);

    const rContentTexture = textureLoader.load(pages[1]);
    rContentTexture.flipY = false;
    rContentTexture.colorSpace = THREE.SRGBColorSpace;

    rContentMaterial.map = rContentTexture;
    rContentMaterial.needsUpdate = true;

    const lContentTexture = textureLoader.load(pages[0]);
    lContentTexture.flipY = false;
    lContentTexture.colorSpace = THREE.SRGBColorSpace;

    lContentMaterial.map = lContentTexture;
    lContentMaterial.needsUpdate = true;
}

function addClickListener(f)
{
    clickListeners.push(f);
    window.addEventListener('click', f);
}

function resetClickListeners() {
    clickListeners.forEach((f) => {
        window.removeEventListener('click', f);
    });
}

async function openNewProject(projectName) {
    await contentRevelation(1);
    updatePages(projects[projectName]);
    AddCarouselPages(projects[projectName]);
    await contentRevelation(0);
}

async function contentRevelation(alphaValue) {
    if (alphaValue === 1)
    {
        rContentMaterial.alphaMap = noiseTexture;

        rContentMaterial.needsUpdate = true;

        lContentMaterial.alphaMap = noiseTexture;

        lContentMaterial.needsUpdate = true;

    }

    gsap.to(rContentMaterial, {
        alphaTest: alphaValue,
        duration: 1,
        ease: "power3.inOut"
    });

    await gsap.to(lContentMaterial, {
        alphaTest: alphaValue,
        duration: 1,
        ease: "power3.inOut"
    });

    if (alphaValue === 0)
    {
        rContentMaterial.alphaMap = null;

        rContentMaterial.needsUpdate = true;

        lContentMaterial.alphaMap = null;

        lContentMaterial.needsUpdate = true;
    }
}

setTimeout(() => {
    updatePages(projects["AboutMe"]);
    contentRevelation(0);
}, 1000);