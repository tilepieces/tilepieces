appView.addEventListener("template-digest", e => {
  // Input. On 'blur', event should not fired because the old value will be equal the new one ( see TT bindingEl )
  var el = model.elementPresent;
  var selectorText = model.currentSelector.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
  var selectorTextsWithoutPseudos = selectorText.replace(replacePseudos, "");
  try {
    model.selectorMatch = el.matches(selectorTextsWithoutPseudos);
    model.relatedSelectors = app.core.currentDocument.querySelectorAll(
      selectorTextsWithoutPseudos);
  } catch (e) {
    model.selectorMatch = false;
  }
  t.set("", model);
});
appView.addEventListener("currentSelector", e => {
  // see above
  if (e.detail.type != "blur")
    return;
  if (!model.selectorMatch) {
    model.currentSelector = app.cssSelector;
    model.selectorMatch = true;
  } else {
    model.currentSelector = model.currentSelector.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
    app.cssSelector = model.currentSelector;
  }
  t.set("", model);
});
appView.addEventListener("keydown", e => {
  if (e.target.dataset.bind == "currentSelector") {
    if (e.key == "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  }
});
appView.addEventListener("focus", e => {
  if (e.target.dataset.bind == "currentSelector")
    if(selectorHelperView.classList.contains("show"))
      selectorHelperTrigger.click();
},true);
/* on rule selected */
opener.addEventListener("css-selector-change", () => {
  model.currentSelector = app.cssSelector;
  model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
  model.grChosen = model.groupingRules.find(v => v.isCurrentGr);
  t.set("", model);
})