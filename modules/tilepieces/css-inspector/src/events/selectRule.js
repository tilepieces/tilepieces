appView.addEventListener("click", e => {
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  if (!ruleBlock)
    return;
  var rule = ruleBlock["__css-viewer-rule"];
  if (!rule.isStyle && rule.type != "external")
    model.deleteRuleDisabled = "";
  else
    model.deleteRuleDisabled = "css-inspector__disabled";
  if (rule.type == "external")
    return;
  if (rule.selected)
    return;
  if (selectedRule)
    selectedRule.selected = "";
  rule.selected = "selected";
  selectedRule = rule;
  t.set("", model);
  if(!rule.inheritedProps && rule.isEditable) {
    app.cssSelector = rule.rule.selectorText;
    var parentRule= rule.rule.parentRule;
    if(!parentRule)
      app.core.currentMediaRule = null;
    while(parentRule){
      if(app.core.styles.conditionalGroups.find(v=>v.rule == parentRule)){
        app.core.currentMediaRule = parentRule;
        break;
      }
      parentRule = parentRule.parentRule
    }
    opener.dispatchEvent(new Event("css-selector-change"));
  }
});