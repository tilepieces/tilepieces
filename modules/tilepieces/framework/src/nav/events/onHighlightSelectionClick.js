document.addEventListener("pointerdown", e => {
  var target = e.target;
  if (!target.classList.contains("highlight-selection"))
    return;
  if (tilepieces.multiselected) {
    var index = !target.classList.contains("highlight-selection-clone") ?
      tilepieces.multiselections.findIndex(v => v.el == tilepieces.elementSelected) :
      tilepieces.multiselections.findIndex(v => v.highlight == e.target);
    console.warn("index multiselected", index);
    tilepieces.removeItemSelected(index);
  } else
    tilepieces.core.deselectElement(e.target);
});