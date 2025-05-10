import {InfiniteCarousel} from "./carousel.js";


const btn = document.querySelector(".burger");
const menu = document.querySelector(".header__bottom");

// Инициализация
const carousel = new InfiniteCarousel(document.querySelector('.carousel-container'));

console.log(carousel);


btn.addEventListener("click", () => {
	btn.classList.toggle("animate");
	menu.classList.toggle("animate");
});