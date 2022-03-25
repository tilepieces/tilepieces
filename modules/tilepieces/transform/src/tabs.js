let tabSelected = document.getElementById("general-transform");
// tabs
let tabsLinks = appView.querySelectorAll(".tab-component-buttons span");
[...tabsLinks].forEach(tabLink => tabLink.addEventListener("click", e => {
  e.preventDefault();
  if (e.target.classList.contains("selected"))
    return;
  e.target.parentNode.querySelector(".selected").classList.remove("selected");
  e.target.classList.add("selected");
  var tabIdToSelect = e.target.dataset.href;
  var newTabSelected = document.getElementById(tabIdToSelect);
  tabSelected.style.display = "none";
  newTabSelected.style.display = "block";
  tabSelected = newTabSelected;
}));