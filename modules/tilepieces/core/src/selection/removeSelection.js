TilepiecesCore.prototype.removeSelection = function () {
  tilepieces.editElements.selection.style.transform = "translate(-9999px,-9999px)";
  cancelAnimationFrame(drawSelection);
  drawSelection = null;
}