function contextMenu(e) {
  if (e.target.closest(".CodeMirror"))
    return;
  e.preventDefault();
  tooltipEl.style.display = "none";
  var target = e.target.closest(".html-tree-builder-el");
  if (!target) // codeMirror
    return;
  var isHighlighted = target.classList.contains("html-tree-builder__highlight");
  !isHighlighted && target.click();
  tooltipHandle({target: e.target});
  !tooltipElHide && tooltip(e);
}