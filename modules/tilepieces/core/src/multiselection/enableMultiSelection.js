tilepieces.enableMultiselection = function () {
  if (tilepieces.multiselected)
    return;
  tilepieces.multiselected = true;
  if (tilepieces.elementSelected && (
    !tilepieces.selectorObj.match || tilepieces.elementSelected.tagName?.match(/HTML|HEAD|BODY/)))
    tilepieces.core.deselectElement();
  else if (tilepieces.elementSelected)
    tilepieces.createSelectionClone(tilepieces.elementSelected);
  window.dispatchEvent(new Event("multiselection-enabled"));
}