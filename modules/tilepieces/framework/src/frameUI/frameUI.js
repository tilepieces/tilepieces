function adjustPanelWrapper(disactivateEmpty) {
  var panelActives = frameUIEls.filter(v => v.style.display == "flex");
  if (window.innerWidth < 1024) {
    targetFrameWrapper.classList.toggle("half", panelActives.length || disactivateEmpty);
  } else {
    targetFrameWrapper.classList.remove("half");
    mobileWrapper.classList.toggle("empty", !panelActives.length && !disactivateEmpty);
  }
  if(mobileWrapper.classList.contains("empty")) {
    dockFrame.style.width = "";
    targetFrameWrapper.style.width = "";
    dockFrame.style.height = "";
    targetFrameWrapper.style.height = "";
  }
}

function assignFramesToMenuBar(toDock) {
  tilepieces.panels = frameUIEls.map(v => {
    var d = panel(v, constraintPanelsFunction);
    if (toDock) {
      d.drag && d.unsetDrag();
    }
    if (v.id && v.id == "component-interface")
      tilepieces.componentInterfaceFrame = d;
    var li = document.createElement("li");
    var panelTitle = v.querySelector(".panel-title").textContent;
    li.innerHTML = "<span>"+v.querySelector(".panel-handler-ico").innerHTML + "</span>" + panelTitle;
    li.onclick = async () => {
      adjustPanelWrapper(true);
      d.show(true);
      closeMenuBar();
      scrollToPanel(d.panelElement);
      tilepieces.project && tilepieces.storageInterface?.setSettings && await tilepieces.storageInterface.setSettings({
        "projectSettings": {
          "openedPanels": frameUIEls.filter(v => v.style.display == "flex").map(v=>v.id)
        }
      });
    };
    windowsListEl.appendChild(li);
    return d;
  });
}

window.addEventListener("panel-os-window-close", e => adjustPanelWrapper());
window.addEventListener("panel-maximized", e => adjustPanelWrapper());
window.addEventListener("panel-close", e => adjustPanelWrapper());
assignFramesToMenuBar(isMobile);
adjustPanelWrapper();
window.addEventListener("resize", e => {
  if (window.innerWidth < 1024 && !isMobile) {
    tilepieces.panels.forEach(v => v.drag && v.unsetDrag());
    isMobile = true;
  } else if (window.innerWidth >= 1024 && isMobile) {
    tilepieces.panels.forEach(v => {
      !v.drag && v.setDrag()
    });
    isMobile = false;
  }
  adjustPanelWrapper();
});
window.addEventListener("project-setted",e=>{
  tilepieces.panels.forEach(panel=>{
    if(tilepieces.project?.openedPanels?.indexOf(panel.panelElement.id)>-1) {
      adjustPanelWrapper(true);
      panel.show(true);
    }
    else{
      panel.close();
    }
  })
})
window.addEventListener("panel-close",async e=>{
  var panel = e.detail;
  if(tilepieces.project?.openedPanels?.indexOf(panel.panelElement.id)>-1){
    await tilepieces.storageInterface.setSettings({
      "projectSettings": {
        "openedPanels": frameUIEls.filter(v => v.style.display == "flex").map(v=>v.id)
      }
    });
  }
});