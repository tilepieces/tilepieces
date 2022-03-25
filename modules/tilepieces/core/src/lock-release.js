let stopEditing = document.createElement("div");
stopEditing.id = "stop-editing";
var linearGradient = "linear-gradient(rgba(0, 0, 0, 0.09) 0%, 5%, rgba(0, 0, 0, 0) 50%, 97%, rgba(0, 0, 0, 0.09) 100%)";
stopEditing.style.cssText = "position:fixed;width:100%;height:100%;z-index:44;top:0;left:0;" + linearGradient;
window.addEventListener("lock-down", () => {
  document.body.appendChild(stopEditing);
  tilepieces.panels.forEach(d => {
    if (!d)// colorpicker
      return;
    if (d.windowOpen) {
      d.windowOpen.document.body.appendChild(stopEditing.cloneNode());
    }
  })
});
window.addEventListener("release", () => {
  stopEditing.remove();
  tilepieces.panels.forEach(d => {
    if (!d) // colorpicker
      return;
    if (d.windowOpen)
      d.windowOpen.document.getElementById("stop-editing").remove();
  })
});