function valueInputOnInput(e){
    if(!e.target.classList.contains("rule-block__value"))
        return;
    var prop = e.target.dataset.prop;
    var ruleEl = e.target.closest(".rule-block__list");
    var rule = ruleEl["__css-viewer-rule"];
    var inputCss = e.target;
    var value = inputCss ? inputCss.innerText : "";
    var originalValue = value;
    var propertyEl = e.target.closest(".rule__property");
    var propertyIndex = propertyEl.dataset.index;
    rule.properties[propertyIndex].value = originalValue;
    modifyValueProperty(rule,prop,value,rule.isStyle);
}


