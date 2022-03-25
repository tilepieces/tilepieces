appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-keyframe"))
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation;
  app.core.deleteKeyframe(rule.rule, rule.cssRules[+e.target.dataset.index].rule);
  rule.cssRules = mapKeyframes([...rule.rule.cssRules]);
  t.set("", model);
  inputCss(appView);
});