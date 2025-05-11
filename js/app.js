const btn = document.querySelector(".burger");
const menu = document.querySelector(".header__bottom");


btn.addEventListener("click", () => {
	btn.classList.toggle("animate");
	menu.classList.toggle("animate");
});