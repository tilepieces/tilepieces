/*
window.addEventListener("tilepieces-core-history-change", e => {
  if (tilepieces.elementSelected && tilepieces.core.currentDocument.documentElement.contains(tilepieces.elementSelected))
    tilepieces.core.deselectElement();
  if (tilepieces.multiselected)
    tilepieces.destroyMultiselection();
  if (tilepieces.lastEditable) {
    tilepieces.lastEditable.destroy();
    tilepieces.lastEditable = null;
  }
  //tilepieces.core.removeSelection();
});*/
window.addEventListener("tilepieces-core-history-change", e => {
  if(tilepieces.elementSelected)
    tilepieces.core.selectElement(tilepieces.elementSelected);
});