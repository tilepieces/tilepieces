menuTrigger.addEventListener("click", e => {
  e.preventDefault();
  var t = menuTrigger.classList.toggle("opened");
  if (t) {
    menuBar.style.display = "block";
  } else {
    menuBar.style.display = "none";
  }
});
menuBar.addEventListener("click", e => {
  var menuLevel1Trigger = e.target.closest(".menu-level-1-trigger");
  if (menuLevel1Trigger) {
    e.preventDefault();
    menuLevel1Trigger.parentNode.classList.toggle("open");
  }
});

function closeMenuBar() {
  menuTrigger.classList.remove("opened");
  menuBar.style.display = "none";
  menuBar.children[0].classList.remove("open");
  [...menuBar.querySelectorAll("li.open")].forEach(v => v.classList.remove("open"));
}

document.addEventListener("click", e => {
  if (!menuBar.contains(e.target) &&
    e.target != menuTrigger &&
    !menuTrigger.contains(e.target)) closeMenuBar()
});
window.addEventListener("blur", closeMenuBar);