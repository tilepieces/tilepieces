newRuleButton.addEventListener("click", e => {
  var selector = opener.tilepieces.cssSelector;
  if(!selector)
    return;
  var selectorText = opener.tilepieces.cssSelector + "{}";
  var currentStylesheet = opener.tilepieces.core.currentMediaRule || opener.tilepieces.core.currentStyleSheet;
  model.menuPlusHide = "css-inspector__hide";
  if (currentStylesheet) {
    var index = currentStylesheet.cssRules.length;
    var newRule = opener.tilepieces.core.insertCssRule(currentStylesheet, selectorText, index);
    updateTemplateOnNewRule(newRule);
  } else {
    opener.addEventListener("cssMapper-changed", ()=>updateTemplateOnNewRule(), {once: true});
    selectorText = opener.tilepieces.currentMediaRule
      ? opener.tilepieces.utils.convertGroupingRuleToSelector(
        opener.tilepieces.cssSelector, opener.tilepieces.core.currentMediaRule)
      : selectorText;
    opener.tilepieces.core.createCurrentStyleSheet(selectorText);
  }
});