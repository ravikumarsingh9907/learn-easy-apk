const overlay = document.querySelector(".backgroun-cover");
const addCategory = document.querySelector(".add-category-container");
const toggleBtn = document.querySelector(".add-cat");

toggleBtn.addEventListener("click", () => {
  overlay.classList.toggle("show-display");
  addCategory.classList.toggle("show-display");
});

overlay.addEventListener("click", () => {
  overlay.classList.toggle("show-display");
  addCategory.classList.toggle("show-display");
});