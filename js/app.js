const btn = document.querySelector(".burger");
const menu = document.querySelector(".header__bottom");
let isScrollLocked = false;


btn.addEventListener("click", () => {
  btn.classList.toggle("animate");
  menu.classList.toggle("animate");
  if (isScrollLocked) {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0";
  } else {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  isScrollLocked = !isScrollLocked;
});
