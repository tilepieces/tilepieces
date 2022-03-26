function addProperty(ruleEl, t, model) {
  var rule = ruleEl["__css-viewer-rule"];
  // rule.inheritedProps is css-inspector
  rule.properties.push({
    property: "",
    value: "",
    index: rule.properties.length,
    checked: true,
    isInheritedClass: rule.inheritedProps ?
      (rule.isInherited ? "is-inherited" : "is-not-inherited") : "",
    disabled: rule.isEditable ? "" : "disabled",
    contenteditable: rule.isEditable ? "contenteditable" : ""
  });
  t.set("", model);
  var keys = ruleEl.querySelectorAll(".rule-block__key");
  var key = keys[keys.length - 1];
  key.setAttribute("contenteditable", "");
  key.focus();
}