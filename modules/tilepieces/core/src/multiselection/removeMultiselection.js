tilepieces.removeItemSelected = function (i) {
  if (typeof i === "undefined")
    i = tilepieces.multiselections.length - 1;
  var el = tilepieces.multiselections[i];
  var highlight = el.highlight;
  highlight.remove();
  tilepieces.multiselections.splice(i, 1);
  window.dispatchEvent(new CustomEvent("deselect-multielement", {detail: el.el}));
  if (el.el == tilepieces.elementSelected) {
    tilepieces.core.deselectElement();
    var newIndex = tilepieces.multiselections.length - 1;
    newIndex > -1 && tilepieces.core.selectElement(tilepieces.multiselections[newIndex].el);
  }
}