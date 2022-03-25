function drawSel(t) {
  if(tilepieces.multiselected && tilepieces.editMode == "selection" && !tilepieces.contenteditable)
    tilepieces.multiselections.slice(0).forEach((v,i) => {
      if (v.el == tilepieces.elementSelected)
        return;
      tilepieces.core.translateHighlight(v.el, v.highlight);
    });
  if(tilepieces.highlight)
    tilepieces.core.translateHighlight(tilepieces.highlight, tilepieces.editElements.highlight);
  else
    tilepieces.editElements.highlight.style.transform = "translate(-9999px,-9999px)";
  if (tilepieces.elementSelected && tilepieces.editMode == "selection" && !tilepieces.contenteditable)
    tilepieces.core.translateHighlight(tilepieces.elementSelected, tilepieces.editElements.selection);
  drawSelection = requestAnimationFrame(drawSel);
}