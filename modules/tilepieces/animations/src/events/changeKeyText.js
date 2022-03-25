appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("keyframe__rule__selector-name"))
    return;
  var ruleBlock = e.target.closest(".keyframe__rule-block");
  var rule = ruleBlock["__keyframe-rule"];
  var selectorText = e.target.innerText.trim();
  try {
    app.core.setKeyText(rule.rule, selectorText);
  } catch (e) {
  }
  rule.keyText = rule.rule.keyText;
  t.set("", model);
}, true);