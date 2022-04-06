const i = document.getElementById("interest");
const p = document.getElementById("password");
const pe = document.getElementById("password_eye");
const s = document.getElementById("passfield");

i.addEventListener("change", () => {
  i.style.color = "#000";
});

pe.addEventListener("click", () => {
  if (p.getAttribute("type") == "password") {
    p.setAttribute("type", "text");
    pe.classList.remove("fa-eye");
    pe.classList.add("fa-eye-slash");
  } else {
    p.setAttribute("type", "password");
    pe.classList.remove("fa-eye-slash");
    pe.classList.add("fa-eye");
  }
});
