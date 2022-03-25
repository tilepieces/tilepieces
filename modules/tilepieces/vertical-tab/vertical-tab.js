(()=>{
  const tabVertical = document.querySelector(".tab-vertical");
  const inside = tabVertical.querySelector(".tab-buttons-inside");
  let tabSelected = inside.querySelector(".selected");
  let tabSelectedElement = inside.ownerDocument.querySelector(tabSelected.getAttribute("href"));
  tabVertical.addEventListener("click",e=>{
    var isOpen = tabVertical.classList.toggle("tab-vertical-open");
    tabVertical.ownerDocument.body.style.overflow = isOpen ? "hidden" : "";
  });
  inside.addEventListener("click",e=>{
    var target = e.target.closest("a");
    if(!target)
      return;
    e.preventDefault();
    if(target!=tabSelected){
      if(tabSelected) {
        tabSelected.classList.remove("selected");
        tabSelectedElement.hidden = true;
        if(tabSelectedElement.style.display)
          tabSelectedElement.style.display = "";
      }
      tabSelected = target;
      tabSelectedElement = target.ownerDocument.querySelector(tabSelected.getAttribute("href"));
      tabSelectedElement.hidden = false;
      if(tabSelectedElement.style.display)
        tabSelectedElement.style.display = "block";
      tabSelected.classList.add("selected");
      tabVertical.dispatchEvent(new CustomEvent("selection",{detail:tabSelected}))
    }
  });
})();