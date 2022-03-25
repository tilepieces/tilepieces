function mapRules(rule, index) {
  var newRule = Object.assign({}, rule);
  newRule.parentRules = [];
  newRule.selected = "";
  var currentStyleSheet = opener.tilepieces.core.currentStyleSheet;
  newRule.contenteditable = (newRule.isStyle && model.match && model.match.match && model.match.match.getAttribute("style") == newRule.rule.getAttribute("style")) ||
  (currentStyleSheet && newRule.rule.parentStyleSheet == currentStyleSheet) ?
    "contenteditable" : "";
  newRule.isEditable = newRule.contenteditable == "contenteditable";
  var swapRule = rule.rule;
  while (swapRule.parentRule) {
    if (swapRule.parentRule.constructor.name == "CSSMediaRule")
      newRule.parentRules.unshift({type: "media", conditionText: swapRule.parentRule.conditionText});
    if (swapRule.parentRule.constructor.name == "CSSSupportsRule")
      newRule.parentRules.unshift({type: "supports", conditionText: swapRule.parentRule.conditionText});
    swapRule = swapRule.parentRule;
  }
  if (!newRule.isStyle) {
    var loc = newRule.rule.parentStyleSheet.ownerNode.getAttribute("href");
    if(loc && loc[0]=="/")
      loc = ("/"+app.frameResourcePath()+loc).replace(/\/+/g,"/")
    else
      loc = newRule.href || app.core.currentDocument.location.href
    newRule.loc = loc;
    newRule.locPop = newRule.loc.split("/").pop();
    newRule.editSelector = false;
    newRule.selectorMatch = true;
  }
  newRule.properties = newRule.properties.map((v, i, a) => {
    v.index = i;
    v.checked = typeof v.checked !== "undefined" ? v.checked : true;
    v.disabled = newRule.isEditable ? "" : "disabled";
    v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
    v.isInheritedClass = newRule.inheritedProps ?
      (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
    v.autocomplete_suggestions = cssDefaultValues[v.property] || [];
    return v;
  });
  var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v => v.rule == newRule.rule);
  if (hasCachedProperties) {
    hasCachedProperties.properties.forEach(v => {
      if (newRule.properties.find(pr => pr.property == v.property && pr.value == v.value)) {
        var indexCached = hasCachedProperties.properties.findIndex(hc => hc.property == v.property && hc.value == v.value);
        hasCachedProperties.properties.splice(indexCached, 1);
        if (!hasCachedProperties.properties.length) {
          opener.tilepieces.core.cachedProperties.splice(opener.tilepieces.core.cachedProperties.indexOf(hasCachedProperties), 1);
        }
        return;
      }
      v.index = newRule.properties.length;
      v.isInheritedClass = newRule.inheritedProps ?
        (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
      v.disabled = newRule.isEditable ? "" : "disabled";
      v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
      newRule.properties.push(v);
    })
  }
  newRule.index = index;
  return newRule;
}