deleteRuleButton.addEventListener("click", e => {
  if (e.target.classList.contains("css-inspector__disabled"))
    return;
  var rule = selectedRule.rule;
  opener.tilepieces.core.deleteCssRule(rule);
  //opener.tilepieces.core.deleteOrChangeCssRule(rule);
  selectedRule = null;
  model.deleteRuleDisabled = "css-inspector__disabled";
  d.cssRules = opener.tilepieces.core.cssMatcher(model.elementPresent,
    opener.tilepieces.core.styles.styleSheets);
  setTemplate();
});