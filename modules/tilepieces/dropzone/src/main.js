document.addEventListener("drop",drop,true);
document.addEventListener("dragover",dragover,true);
document.addEventListener("dragleave",dragLeave,true);
document.addEventListener("paste",onPaste,true);
// panel logic compatibility
window.addEventListener("window-popup-open", e => {
  var newWindowDocument = e.detail.newWindow.document;
  newWindowDocument.addEventListener("drop",drop,true);
  newWindowDocument.addEventListener("dragover",dragover,true);
  newWindowDocument.addEventListener("dragleave",dragLeave,true);
  newWindowDocument.addEventListener("paste",onPaste,true);
});