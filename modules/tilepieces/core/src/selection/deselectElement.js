TilepiecesCore.prototype.deselectElement = function () {
  var obj = {target: tilepieces.elementSelected};
  tilepieces.elementSelected = null;
  tilepieces.cssSelector = null;
  tilepieces.cssSelectorObj = null;
  tilepieces.selectorObj = null;
  tilepieces.editElements.selection.style.transform = "translate(-9999px,-9999px)";
  window.dispatchEvent(
    new CustomEvent("deselect-element", {detail: obj}));
};