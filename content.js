
const carousel = document.getElementById("carousel");

const AlienDatas = [
    { type: "image", src: "doublePage.jpg"},
    { type: "image", src: "page.png", gif: "test.gif" },
    { type: "image", src: "page.png" },
    { type: "image", src: "page.png" },
    { type: "image", src: "page.png" }
];

/*AlienDatas.forEach(data => {
    const page = document.createElement("div");
    page.className = "page";

    if (data.type === "image") {
        const img = document.createElement("img");
        img.src = data.src;
        page.append(img);
    }

    carousel.appendChild(page);
});*/

function ResetCarousel() {
    carousel.removeChild();
    updateCarousel();
}

function AddCarouselPages(project) {
    project.forEach(data => {
        const page = document.createElement("div");
        page.className = "page";

        if (data.type === "image") {
            const img = document.createElement("img");
            img.src = data.src;
            page.append(img);
            if (data.gif) {
                const gif = document.createElement("img");
                gif.src = data.gif;
                gif.className = "gif";
                page.append(gif);
            }
        }

        carousel.appendChild(page);
    });
    updateCarousel();
}

let currentIndex = 0;

function updateCarousel() {
    const pages = document.querySelectorAll(".page");
    const total = pages.length;

    console.log(currentIndex);

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
        }

        else {
            // cartes à gauche/droite
            const translateX = offset * 220;
            const rotateY = offset;
            const scale =  1 - 0.2 * Math.abs(offset);
            const indexOffset = Math.abs(offset);
            const brightnessValue = 0.5 / Math.abs(offset);

            page.style.transform = `translate(-50%, 0) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
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