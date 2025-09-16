
const carousel = document.getElementById("carousel");

const AlienDatas = [
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