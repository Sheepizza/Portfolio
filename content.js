
const carousel = document.getElementById("carousel");

const AlienDatas = [
    { type: "image", src: "page.jpg" },
    { type: "image", src: "page.jpg" },
    { type: "image", src: "page.jpg" }
];

AlienDatas.forEach(data => {
    const page = document.createElement("div");
    page.className = "page";

    if (data.type === "image") {
        const img = document.createElement("img");
        img.src = data.src;
        page.append(img);
    }

    carousel.appendChild(page);
});

let currentIndex = 0;
const pages = document.querySelectorAll(".page");

function updateCarousel() {
    pages.forEach((page, i) => {
        
    })

    const offset = -currentIndex * 320;
    carousel.style.transform = 'translateX(${offset}px)';
}

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    updateCarousel();
})

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1 + pages.length) % pages.length;
    updateCarousel();
})

updateCarousel();