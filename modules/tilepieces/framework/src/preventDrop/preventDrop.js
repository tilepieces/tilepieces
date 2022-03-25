function preventDrop(doc) {
  doc.addEventListener("dragenter", function (e) {
    if (!e.target.closest("[data-dropzone],.highlight-selection")) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    }
  }, false);

  doc.addEventListener("dragover", function (e) {
    if (!e.target.closest("[data-dropzone],.highlight-selection")) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    }
  });

  doc.addEventListener("drop", function (e) {
    if (!e.target.closest("[data-dropzone],.highlight-selection")) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    }
  });
}

preventDrop(window);
window.addEventListener("panel-created-iframe", e => {
  var frame = e.detail;
  preventDrop(frame.contentWindow);
});