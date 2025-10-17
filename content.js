
const carousel = document.getElementById("carousel");

const TinyTaleDatas = [
    { type: "video", src: "doublePage.png", srcVid: "TinyTale_Datas/TrailerTinyTale.mp4"},
    { type: "image", src: "TinyTale_Datas/TinyTale_R&D.png", gif: "TinyTale_Datas/R&D.mp4" },
    { type: "image", src: "TinyTale_Datas/TinyTale_CT.png", gif: "TinyTale_Datas/CT.mp4" },
    { type: "image", src: "TinyTale_Datas/TinyTale_GP.png", gif: "TinyTale_Datas/GP.mp4" },
    { type: "image", src: "pageVisuels.png", gif: "TinyTale_Datas/Visuel1.mp4", gif_sec: "TinyTale_Datas/Visuel2.mp4" },
];

const AlienDatas = [
    { type: "video", src: "doublePage.png", srcVid: "Alien_Datas/TrailerAlien.mp4" },
    { type: "image", src: "TinyTale_Datas/TinyTale_R&D.png", gif: "TinyTale_Datas/R&D.mp4" },
    { type: "image", src: "TinyTale_Datas/TinyTale_CT.png", gif: "TinyTale_Datas/CT.mp4" },
    { type: "image", src: "TinyTale_Datas/TinyTale_GP.png", gif: "TinyTale_Datas/GP.mp4" },
    { type: "image", src: "TinyTale_Datas/TinyTale_CT.png" },
];

function ResetCarousel() {
    carousel.removeChild();
    updateCarousel();
}

function AddCarouselPages(project) {
    carousel.innerHTML = "";

    project.forEach(data => {
        const page = document.createElement("div");
        page.className = "page";

        const img = document.createElement("img");
        img.src = data.src;

        page.append(img);

        if (data.type === "video") {
            page.classList.add("double-page");
            const video = document.createElement("video");
            video.src = data.srcVid;
            video.className = "video";
            video.muted = true;
            video.playsInline = true;
            video.controls = true;

            page.appendChild(video);    
        }

        if (data.gif) {
            const gif = document.createElement("video");
            gif.src = data.gif;
            gif.autoplay = true;
            gif.muted = true;
            gif.loop = true;
            gif.className = "gif";
            page.appendChild(gif);

            if (data.gif_sec) {
                const gif_sec = document.createElement("video");
                gif_sec.src = data.gif_sec;
                gif_sec.autoplay = true;
                gif_sec.muted = true;
                gif_sec.loop = true;
                gif_sec.className = "gif-sec";
                page.appendChild(gif_sec);
            }
        }
        
        carousel.appendChild(page);
    });
    updateCarousel();
}

function projectVideo(video) {
    const overlay = document.getElementById("video-overlay");
    const videoRect = video.getBoundingClientRect();

}

let currentIndex = 0;

function updateCarousel() {
    const pages = document.querySelectorAll(".page");
    const total = pages.length;

    pages.forEach((page, i) => {
        let offset = (i - currentIndex + total) % total;

        if (offset > total / 2) {
            offset -= total;
        }

        if (offset === 0) {
            // carte active au centre
            page.style.transform = "translate(-50%, 0) scale(1) translateZ(200px)";
            page.style.opacity = "1";
            page.style.zIndex = total;
            page.style.filter = "brightness(1)";

            if (page.classList.contains("double-page")) {
                page.classList.remove("folded");
                const video = page.getElementsByTagName("video")[0];
                video.controls = true;
            }

            if (page.getElementsByClassName("gif").length > 0) {
                const gif = page.getElementsByClassName("gif")[0];
                gif.play();
            }
        }

        else {
            // cartes à gauche/droite
            const translateX = offset * 220;
            const rotateY = offset;
            const scale =  1 - 0.2 * Math.abs(offset);
            const indexOffset = Math.abs(offset);
            const brightnessValue = 0.5 / Math.abs(offset);

            page.style.transform = `translate(-50%, 0) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;

            if (page.classList.contains("double-page") && !page.classList.contains("folded"))
            {
                const video = page.getElementsByTagName("video")[0];
                video.pause();
                video.controls = false;
                page.classList.add("folded");
                page.style.transform = `translate(-50%, 0) translateX(${translateX}px) scale(${scale}) rotateY(-10deg)`;
            }

            if (page.getElementsByClassName("gif").length > 0)
            {
                const gif = page.getElementsByClassName("gif")[0];
                gif.pause();
            }

            page.style.filter = `brightness(${brightnessValue})`;
            page.style.opacity = "1";
            page.style.zIndex = total - indexOffset;
        }
        });
}

document.getElementById("prev").addEventListener("click", () => {
    const pages = document.querySelectorAll(".page");
    currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    updateCarousel();
})

document.getElementById("next").addEventListener("click", () => {
    const pages = document.querySelectorAll(".page");
    currentIndex = (currentIndex + 1 + pages.length) % pages.length;
    updateCarousel();
})

AddCarouselPages(TinyTaleDatas);
updateCarousel();