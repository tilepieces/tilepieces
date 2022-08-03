newRuleButton.addEventListener("click", e => {
  var selector = app.cssSelector;
  if(!selector)
    return;
  var selectorText = app.cssSelector + "{}";
  var currentStylesheet = app.core.currentMediaRule || app.core.currentStyleSheet;
  model.menuPlusHide = "css-inspector__hide";
  if (currentStylesheet) {
    var index = currentStylesheet.cssRules.length;
    var newRule = app.core.insertCssRule(currentStylesheet, selectorText, index);
    updateTemplateOnNewRule(newRule);
  } else {
    opener.addEventListener("cssMapper-changed", ()=>updateTemplateOnNewRule(), {once: true});
    selectorText = app.currentMediaRule
      ? app.utils.convertGroupingRuleToSelector(
        app.cssSelector, app.core.currentMediaRule)
      : selectorText;
    app.core.createCurrentStyleSheet(selectorText);
  }
});