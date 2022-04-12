function mapPseudoRules(rules) {
  var resObj = [];
  rules.forEach((rule, i) => {
    var newRule = Object.assign({}, rule);
    newRule.index = i;
    newRule.parentRules = [];
    newRule.selected = "";
    newRule.contenteditable = (newRule.isStyle && model.match) ||
    newRule.rule.parentStyleSheet == opener.tilepieces.core.currentStyleSheet ?
      "contenteditable" : "";
    newRule.isEditable = newRule.contenteditable == "contenteditable";
    var swapRule = newRule.rule;
    while (swapRule.parentRule) {
      if (swapRule.parentRule.constructor.name == "CSSMediaRule")
        newRule.parentRules.unshift({type: "media", conditionText: swapRule.parentRule.conditionText});
      if (swapRule.parentRule.constructor.name == "CSSSupportsRule")
        newRule.parentRules.unshift({type: "supports", conditionText: swapRule.parentRule.conditionText});
      if(swapRule.parentRule.constructor.name == "CSSLayerBlockRule")
        newRule.parentRules.unshift({type: "layer", conditionText: swapRule.parentRule.name});
      swapRule = swapRule.parentRule;
    }
    var locHref = newRule.rule.parentStyleSheet.ownerNode?.getAttribute("href");
    var loc;
    if(locHref && locHref[0]=="/")
      loc = ("/"+app.frameResourcePath()+locHref).replace(/\/+/g,"/")
    else if(locHref)
      loc = new URL(locHref,app.core.currentDocument.location).href
    else
      loc = newRule.rule.parentStyleSheet.href || // import
        newRule.href || app.core.currentDocument.location.href;
    newRule.loc = loc;
    newRule.locPop = newRule.loc.split("/").pop();
    newRule.editSelector = false;
    newRule.selectorMatch = true;
    newRule.properties = newRule.properties.map((v, i, a) => {
      v.index = i;
      v.checked = typeof v.checked !== "undefined" ? v.checked : true;
      v.isInheritedClass = "";
      v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
      v.disabled = newRule.isEditable ? "" : "disabled";
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
    newRule.pseudos.forEach(v => {
      var found = resObj.find(ps => ps.name == v);
      if (!found)
        resObj.push({name: v, rules: [newRule]});
      else
        found.rules.push(newRule);
    })
  });
  return resObj.sort((a, b) => a.name.localeCompare(b.name));
}