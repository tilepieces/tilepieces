function keyInpuOnBlur(e, t, model) {
  if (!e.target.classList.contains("rule-block__key") || !e.isTrusted)
    return;
  var exprop = e.target.dataset.key;
  var value = e.target.textContent.trim();
  var ruleEl = e.target.closest(".rule-block__list");
  var rule = ruleEl["__css-viewer-rule"];
  var propertyIndex = e.target.closest(".rule__property").dataset.index;
  if (!value || cssDefaultProperties.indexOf(value) == -1) {
    var indexProp = rule.properties.length - 1;
    for (; indexProp >= 0; indexProp--) {
      if (indexProp != propertyIndex &&
        rule.properties[indexProp].property == exprop) {
        value = rule.properties[indexProp].value;
        break;
      }
    }
    modifyValueProperty(rule, exprop, value, rule.isStyle);
    rule.properties.splice(propertyIndex, 1);
    rule.properties.forEach((v, i) => v.index = i);
    t.set("", model);
  } else if (value) {
    if (value == exprop)
      return;
    rule.properties[propertyIndex].property = value;
    t.set("", model);
    if (!exprop)
      return;
    modifyValueProperty(rule, exprop, "", rule.isStyle);
    var valueStatement = e.target.nextElementSibling.nextElementSibling.textContent;
    if (!valueStatement.trim().length)
      return;
    modifyValueProperty(rule, value, valueStatement, rule.isStyle)
  }
}