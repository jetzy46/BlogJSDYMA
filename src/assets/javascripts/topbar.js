const icon = document.querySelector(".header-menu-icon");
const headerMenu = document.querySelector(".header-menu");
let isMenuOpen = false;
let mobileMenuDOM;

const closeMenu = () => {
  mobileMenuDOM.classList.remove("open");
};
const createMobileMenu = () => {
  mobileMenuDOM = document.createElement("div");
  mobileMenuDOM.classList.add("mobile-menu");
  mobileMenuDOM.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  mobileMenuDOM.append(headerMenu.querySelector("ul").cloneNode(true));
  headerMenu.append(mobileMenuDOM);
};
const openMenu = () => {
  if (mobileMenuDOM) {
  } else {
    createMobileMenu();
  }
  mobileMenuDOM.classList.add("open");
};

const toggleMenu = () => {
  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
  isMenuOpen = !isMenuOpen;
};

icon.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

window.addEventListener("click", (e) => {
  if (isMenuOpen) {
    toggleMenu();
  }
});

window.addEventListener("resize", (e) => {
  if (window.innerWidth > 480 && ismenuOpen) {
    toggleMenu;
  }
});
