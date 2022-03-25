function updateRuleOnBlur(target,t,model,appView,cbFunction){
    var input = target;
    // this line is just for the css inspector. No time to find a more elegant way
    var closestContainer = input.closest(".css-inspector__container");
    var ruleEl = input.closest(".rule-block__list");
    var rule = ruleEl["__css-viewer-rule"];
    rule.properties = opener.getCssTextProperties(rule.rule.style.cssText).map((v,i,a)=>{
        v.index=i;
        v.checked = true;
        v.disabled = rule.isEditable ? "" : "disabled";
        v.isInherited = rule.inheritedProps && v.property.match(opener.inheritedProperties);
        v.isInheritedClass = rule.inheritedProps ?
            (v.isInherited  ? "is-inherited" : "is-not-inherited") : "";
        v.contenteditable = rule.isEditable && v.checked ? "contenteditable" : "";
        v.autocomplete_suggestions = cssDefaultValues[v.property] || [];
        return v;
    });
    var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v=>v.rule == rule.rule);
    if(hasCachedProperties){
        hasCachedProperties.properties.forEach(v=>{
            v.index = rule.properties.length;
            v.isInheritedClass = rule.inheritedProps ?
                (v.isInherited  ? "is-inherited" : "is-not-inherited") : "";
            v.disabled = rule.isEditable ? "" : "disabled";
            v.checked = false;
            v.contenteditable = rule.isEditable && v.checked ? "contenteditable" : "";
            rule.properties.push(v);
        })
    }
    t.set("", model);
    inputCss(appView);
    //strikePropertyNotApplied(closestContainer);
    cbFunction && cbFunction(closestContainer)
}