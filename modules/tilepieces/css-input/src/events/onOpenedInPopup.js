window.addEventListener("window-popup-open", e => {
  var doc = e.detail.newWindow.document;
  doc.addEventListener("keydown", onInput, true);
  e.detail.newWindow.addEventListener('mousewheel', mousewheel, {passive: false});
});