opener.addEventListener("deselect-element", e => {
  wrapper.setAttribute("hidden", "");
  elementSumSection.style.display = "none";
});
opener.addEventListener("WYSIWYG-start", e => {
  wrapper.setAttribute("hidden", "");
  elementSumSection.style.display = "none";
});
opener.addEventListener("WYSIWYG-end", () => {
  if (app.elementSelected) {
    wrapper.removeAttribute("hidden");
    elementSumSection.style.display = "block";
  }
});
opener.addEventListener("content-editable-end", () => {
});
opener.addEventListener("frame-unload", () => {
  wrapper.setAttribute("hidden", "");
  elementSumSection.style.display = "none";
});

function onSelected(dontSetInterfaces) {
  if (app.elementSelected.nodeType == 1) {
    wrapper.removeAttribute("hidden");
    setAttrsTemplate(app.elementSelected, app.selectorObj.match);
    !dontSetInterfaces && setInterfaces();
    setClasses();
  } else wrapper.setAttribute("hidden", "");
}

if (app.elementSelected) {
  onSelected()
}
opener.addEventListener("highlight-click", () => onSelected());
attributesView.addEventListener("dropzone-dropping", onDropFiles, true);
