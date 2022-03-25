appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-animation"))
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation.rule;
  //var parent = rule.parentRule || rule.parentStyleSheet;
  //app.core.deleteCssRule(parent,[...parent.cssRules].indexOf(rule));
  app.core.deleteCssRule(rule);
  var index = +ruleBlock.dataset.index;
  model.animations.splice(index, 1);
  t.set("", model)
});