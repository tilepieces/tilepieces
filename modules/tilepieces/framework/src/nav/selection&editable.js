selectionTrigger.addEventListener("click", e => {
  var toggle = selectionTrigger.classList.toggle("opened");
  if (toggle) {
    tilepieces.editMode = "selection";
    tilepieces.core.setSelection();
    tilepieces.core.currentDocument.addEventListener("mousemove", highlight);
    tilepieces.core.currentDocument.addEventListener("pointerdown", clickSelection);
    tilepieces.core.currentDocument.addEventListener("click", preventUp, true);
    tilepieces.core.currentDocument.addEventListener("mouseout", blurSelection);
    tilepieces.core.currentWindow.addEventListener("resize", resize);
    tilepieces.core.currentWindow.addEventListener("scroll", resize);
    tilepieces.core.currentWindow.addEventListener("dragover", preventDropOnEdit);
    tilepieces.core.currentWindow.addEventListener("drop", preventDropOnEdit);
  } else {
    tilepieces.editMode = "";
    if (tilepieces.multiselected) {
      tilepieces.multiselections.forEach(v => {
        v.highlight.style.transform = "translate(-9999px,-9999px)";
      });
    }
    /*
    if(tilepieces.multiselected)
      tilepieces.destroyMultiselection();
    if(tilepieces.elementSelected)
        tilepieces.core.deselectElement();*/
    if (tilepieces.lastEditable) {
      tilepieces.lastEditable.destroy();
      tilepieces.lastEditable = null;
    }
    tilepieces.contenteditable = false;
    if(tilepieces.core) {
      tilepieces.core.removeSelection();
      tilepieces.core.currentDocument.removeEventListener("mousemove", highlight);
      tilepieces.core.currentDocument.removeEventListener("pointerdown", clickSelection);
      tilepieces.core.currentDocument.removeEventListener("mouseout", blurSelection);
      tilepieces.core.currentDocument.removeEventListener("click", preventUp, true);
      tilepieces.core.currentWindow.removeEventListener("resize", resize);
      tilepieces.core.currentWindow.removeEventListener("scroll", resize);
      tilepieces.core.currentWindow.removeEventListener("dragover", preventDropOnEdit);
      tilepieces.core.currentWindow.removeEventListener("drop", preventDropOnEdit);
    }
    if (contenteditableTrigger.classList.contains("opened"))
      contenteditableTrigger.click();
  }
  window.dispatchEvent(new Event("edit-mode"))
});
contenteditableTrigger.addEventListener("click", e => {
  var toggle = contenteditableTrigger.classList.toggle("opened");
  if (toggle) {
    if (tilepieces.editMode != "selection")
      selectionTrigger.click();
    tilepieces.multiselected && tilepieces.destroyMultiselection();
    tilepieces.contenteditable = true;
    if (tilepieces.elementSelected) {
      tilepieces.editElements.selection.style.transform = "translate(-9999px,-9999px)";
      clickSelection({target: tilepieces.elementSelected})
    }
    window.dispatchEvent(new Event("content-editable-start"));
  } else {
    tilepieces.contenteditable = false;
    if (tilepieces.lastEditable) {
      tilepieces.lastEditable.destroy();
      tilepieces.lastEditable = null;
    }
    window.dispatchEvent(new Event("content-editable-end"));
  }
});
