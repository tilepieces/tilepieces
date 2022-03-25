appView.addEventListener("blur", e => {
  if (e.target.dataset.bind != "animation.name")
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation;
  try {
    app.core.setRuleName(rule.rule, e.target.innerText);
  } catch (e) {
  }
  rule.name = rule.rule.name;
  t.set("", model);
}, true);