// ===============================
// NAVBAR MOBILE TOGGLE
// ===============================
// This script adds mobile hamburger menu functionality to all pages

document.addEventListener("DOMContentLoaded", function() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const container = document.querySelector(".navbar-container");
  const menu = document.querySelector(".navbar-menu");
  
  if (!container || !menu) return;

  // Create hamburger toggle button
  const toggle = document.createElement("button");
  toggle.className = "navbar-toggle";
  toggle.innerHTML = "☰";
  toggle.setAttribute("aria-label", "Toggle menu");
  toggle.setAttribute("aria-expanded", "false");

  // Insert toggle after brand
  const brand = document.querySelector(".navbar-brand");
  if (brand) {
    brand.after(toggle);
  }

  // Toggle menu on click
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.toggle("active");
    toggle.setAttribute("aria-expanded", menu.classList.contains("active"));
  });

  // Close menu when a link is clicked
  const links = menu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target)) {
      menu.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});
