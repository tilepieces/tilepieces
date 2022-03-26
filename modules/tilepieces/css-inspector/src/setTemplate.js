function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  // this for mobile when keyboard trigger a resize event
  var oDoc = appView.ownerDocument
  if(oDoc.hasFocus() && oDoc.activeElement && appView.contains(oDoc.activeElement))
    return;
  d = e ? e.detail : d; // cached detail
  model.elementPresent = d.target;
  model.match = d.match;
  model.isVisible = true;
  //model.editingClass = "";
  model.rules = d.cssRules.cssMatches.slice(0).map(mapRules);
  model.pseudoStates = mapPseudoRules(d.cssRules.pseudoStates);
  model.pseudoElements = mapPseudoRules(d.cssRules.pseudoElements);
  model.ancestors = d.cssRules.ancestors.slice(0).map((ancestor, i) => {
    if (ancestor.ancestorStyle)
      ancestor.ancestorstyle = mapRules(ancestor.ancestorStyle);
    ancestor.elementRepresentation = createElementRepresentation(ancestor.ancestor);
    ancestor.matches = ancestor.matches.map(mapRules);
    ancestor.index = i;
    return ancestor;
  });
  model.isVisible = true;
  model.deleteRuleDisabled = "css-inspector__disabled";
  t.set("", model);
  console.log(model);
  inputCss(appView);
  [...document.querySelectorAll(".css-inspector__container")].forEach(v => strikePropertyNotApplied(v))
}
