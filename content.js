
const carousel = document.getElementById("carousel");

const AlienDatas = [
    { type: "video", src: "doublePage.png", srcVid: "Trailer Vr.mp4"},
    { type: "image", src: "TinyTale_R&D.png", gif: "test.mp4" },
    { type: "image", src: "TinyTale_R&D.png" },
    { type: "image", src: "TinyTale_R&D.png" },
    { type: "image", src: "TinyTale_R&D.png" }
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

AddCarouselPages(AlienDatas);
updateCarousel();