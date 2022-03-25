function checkProperty(e,cb) {
    var target = e.target;
    var closestContainer = target.closest(".css-inspector__container");
    var ruleEl = target.closest(".rule-block__list");
    var rule = ruleEl["__css-viewer-rule"];
    var propertyBlock = target.closest(".rule__property");
    var valueEl = propertyBlock.querySelector(".rule-block__value");
    var propertyIndex = propertyBlock.dataset.index;
    var item = rule.properties[propertyIndex];
    var prop = rule.properties[propertyIndex].property;
    var value = rule.properties[propertyIndex].value;
    modifyValueProperty(rule, prop, !target.checked ? "" : value, rule.isStyle);
    var isAlreadyCachedIndex = opener.tilepieces.core.cachedProperties.findIndex(v=>v.rule == rule.rule);
    var isAlreadyCached = opener.tilepieces.core.cachedProperties[isAlreadyCachedIndex];
    if (isAlreadyCached && target.checked) {
        var indexCached = isAlreadyCached.properties.findIndex(v=>v.index == propertyIndex);
        isAlreadyCached.properties.splice(indexCached, 1);
        if (!isAlreadyCached.properties.length)
            opener.tilepieces.core.cachedProperties.splice(isAlreadyCachedIndex, 1);
    }
    else if (!isAlreadyCached) {
        item.contenteditable = "";
        item.checked = false;
        opener.tilepieces.core.cachedProperties.push({
            properties: [item],
            rule: rule.rule
        });
    }
    else {
        item.contenteditable = "";
        item.checked = false;
        isAlreadyCached.properties.push(item);
    }
    ruleEl.querySelectorAll(".input-css-placeholder").forEach(v=>v.remove());
    valueEl.dispatchEvent(new Event("blur"));
}