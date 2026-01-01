const PUBLIC_KEY = 'Yf9AYCKGo5UVfAPSX';
const SERVICE_ID = 'service_2fnx4dk';
const TEMPLATE_ID = 'template_1gxlqsv';

emailjs.init(PUBLIC_KEY);

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'ENVOI...';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(function (response) {
            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = 'SEND';
        }, function (error) {

            submitBtn.disabled = false;
            submitBtn.textContent = 'SEND';
        });
});






const carousels = document.getElementsByClassName("carousel");

const FastForge = [
    { src: "FastForge_Datas/R&D.mp4" },
    { src: "FastForge_Datas/CT.mp4" },
    { src: "FastForge_Datas/GP.mp4" },
    { index: 0 },
];

const Alien = [
    { src: "Alien_Datas/R&D.mp4" },
    { src: "Alien_Datas/CT.mp4" },
    { src: "Alien_Datas/GP.mp4" },
    { index: 0 },
];

const TinyTale = [
    { src: "TinyTale_Datas/R&D.mp4" },
    { src: "TinyTale_Datas/CT.mp4" },
    { src: "TinyTale_Datas/GP.mp4" },
    { index: 0 },
];

const projects = {
    "ff": FastForge,
    "alien": Alien,
    "tt": TinyTale,
};

function AddCarouselPages(projectName, index) {
    let carousel = carousels[index];
    let project = projects[projectName];

    carousel.previousElementSibling.classList.add(projectName);
    carousel.nextElementSibling.classList.add(projectName);

    carousel.innerHTML = "";

    project.forEach(data => {
        if (data.hasOwnProperty("index")) {
            return;
        }

        const content = document.createElement("div");
        content.className = "content";
        content.classList.add(projectName);

        const gif = document.createElement("video");
        gif.src = data.src;
        gif.autoplay = true;
        gif.muted = true;
        gif.loop = true;
        gif.className = "gif";
        content.appendChild(gif);

        carousel.appendChild(content);
    });
    carouselsSetup();
}

function carouselsSetup(){
    Object.keys(projects).forEach(projectName => {
        updateCarousel(projectName)
    })
}

function updateCarousel(projectName) {
    let project = projects[projectName];

    const contents = document.querySelectorAll(".content." + projectName);
    const total = contents.length;

    let currentIndex = project[project.length - 1].index;

    contents.forEach((content, i) => {
        if (content.hasOwnProperty("index")) {
            return;
        }

        let offset = (i - currentIndex + total) % total;

        if (offset > total / 2) {
            offset -= total;
        }

        if (offset === 0) {
            content.style.transform = "translate(0, 0) scale(1) translateZ(200px)";
            content.style.opacity = "1";
            content.style.zIndex = total;
            content.style.filter = "brightness(1)";

            if (content.getElementsByClassName("gif").length > 0) {
                const gif = content.getElementsByClassName("gif")[0];
                gif.play().catch(err => {
                });
            }
        }

        else {
            const translateX = offset * 100;
            const rotateY = offset;
            const scale = 1 - 0.2 * Math.abs(offset);
            const indexOffset = Math.abs(offset);
            const brightnessValue = 0.5 / Math.abs(offset);

            content.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;

            if (content.getElementsByClassName("gif").length > 0) {
                const gif = content.getElementsByClassName("gif")[0];
                gif.pause();
            }

            content.style.filter = `brightness(${brightnessValue})`;
            content.style.opacity = "1";
            content.style.zIndex = total - indexOffset;
        }
    });
}

//AddCarouselPages("tt", 0);
AddCarouselPages("tt", 1);
AddCarouselPages("alien", 2);
AddCarouselPages("ff", 3);

Array.from(document.getElementsByClassName("prev")).forEach(btn => {
    btn.addEventListener("click", (event) => {
        let project = projects[event.currentTarget.classList[2]];
        let currentIndex = project[project.length - 1].index;

        const contents = document.querySelectorAll(".content." + event.currentTarget.classList[2]);
        project[project.length - 1].index = (currentIndex - 1 + contents.length) % contents.length;
        updateCarousel(event.currentTarget.classList[2]);
    })
})

Array.from(document.getElementsByClassName("next")).forEach(btn => {
    btn.addEventListener("click", (event) => {
        let project = projects[event.currentTarget.classList[2]];
        let currentIndex = project[project.length - 1].index;

        const contents = document.querySelectorAll(".content." + event.currentTarget.classList[2]);
        project[project.length - 1].index = (currentIndex + 1 + contents.length) % contents.length;
        updateCarousel(event.currentTarget.classList[2]);
    })
})
