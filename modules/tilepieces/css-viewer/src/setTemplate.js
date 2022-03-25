function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    appView.ownerDocument.body.style.display = "none";
    model.isVisible = false;
    t.set("", model);
    return;
  }
  d = e ? e.detail : d; // cached detail
  model.elementPresent = d.target;
  model.match = d.match;
  model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
  model.grChosen = model.groupingRules.find(v => v.isCurrentGr);
  model.currentSelector = app.cssSelector;
  model.isVisible = true;
  try {
    model.relatedSelectors = app.core.currentDocument.querySelectorAll(
      app.cssSelector.replace(replacePseudos, ""));
  } catch (e) {
    model.relatedSelectors = [app.elementSelected]
  }
  model.editMode = app.editMode;
  appView.ownerDocument.body.style.display = "block";
  t.set("", model);
}
