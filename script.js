function showSection(id) {
    document.querySelectorAll('.content').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

function productSlide(className, images) {
    let index = 0;
    const img = document.querySelector(`.${className}`);

    setInterval(() => {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = images[index];
            img.style.opacity = 1;
            index = (index + 1) % images.length;
        }, 400);
    }, 3000);
}

productSlide("p1", ["OREOCRAMBS2.jpg","OREOCRAMBS3.jpg","OREOCRAMBS1.jpg"]);
productSlide("p2", ["NASGOR2.jpg","NASGOR3.jpg","NASGOR1.jpg"]);
productSlide("p3", ["GRASSJELLY2.jpg","GRASSJELLY3.jpg","GRASSJELLY1.jpg"]);
productSlide("p4", ["SUPIGA2.jpg","SUPIGA3.jpg","SUPIGA1.jpg"]);
productSlide("p5", ["CAKEICE2.jpg","CAKEICE3.jpg","CAKEICE1.jpg"]);
productSlide("p6", ["SPG2.jpg","SPG3.jpg","SPG1.jpg"]);

const popular = [
    {img:"CAKEICE1.jpg", name:"CAKE & ICE CREAM"},
    {img:"SPG1.jpg", name:"SPAGHETTI BOLOGNESE"}
];
let popIndex = 0;
setInterval(() => {
    const img = document.getElementById("popularImg");
    const name = document.getElementById("popularName");

    img.style.opacity = 0;
    name.style.opacity = 0;

    setTimeout(() => {
        img.src = popular[popIndex].img;
        name.innerText = popular[popIndex].name;
        img.style.opacity = 1;
        name.style.opacity = 1;
        popIndex = (popIndex + 1) % popular.length;
    }, 400);
}, 3000);

let 
    