function handleClick(e) {
  selected = e.detail.selected;
  var sourceTarget = selected["__html-tree-builder-el"];
  var multiselected = e.detail.multiselection ? treeBuilder.multiselected : false;
  var match = toMatch(e.detail.match);
  if (!match && multiselected) {
    treeBuilder.removeItemSelected();
    return;
  }
  if (!match)
    selected.classList.add("not-match");
  else
    selected.classList.remove("not-match");
  var toHighlightTarget = sourceTarget.nodeType == 3 ? sourceTarget.parentNode : sourceTarget;
  app.core.selectElement(sourceTarget, selectedIsMatch);
  if (match && app.editMode == "selection" && app.elementSelected != toHighlightTarget) {
    if (app.lastEditable && !app.lastEditable.el.contains(toHighlightTarget)) {
      app.lastEditable.destroy();
    } else if (app.contenteditable && !app.lastEditable && !multiselected) {
      app.core.contenteditable(toHighlightTarget);
    }
    //else if(!app.contenteditable)
    //app.core.setSelection();
    //app.core.translateHighlight(sourceTarget,app.editElements.selection);
  }
  //app.elementSelected = sourceTarget;
  opener.dispatchEvent(new Event("element-selected"));
}