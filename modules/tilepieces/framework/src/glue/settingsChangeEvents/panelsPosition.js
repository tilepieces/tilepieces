function changePanelsPosition(propvalue) {
  mobileWrapper.classList.remove("top", "right", "bottom", "left");
  if (propvalue != "free")
    mobileWrapper.classList.add(propvalue);
  var toSet = propvalue == "free";
  tilepieces.panels.forEach(p => {
    if (p.drag && !toSet)
      p.unsetDrag();
    if (!p.drag && toSet)
      p.setDrag();
    if ((p.panelElement.style.width || p.panelElement.style.height)) {
      p.panelElement.style.width = "";
      p.panelElement.style.height = "";
      var b = p.panelElement.getBoundingClientRect();
      p.width = b.width;
      p.height = b.height;
    }
  });
  dockFrame.style.width = "";
  targetFrameWrapper.style.width = "";
  dockFrame.style.height = "";
  targetFrameWrapper.style.height = "";
}