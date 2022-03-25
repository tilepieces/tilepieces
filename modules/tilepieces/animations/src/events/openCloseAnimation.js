appView.addEventListener("click", e => {
  if (!e.target.closest(".open-animation"))
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation;
  var toggle = !rule.show;
  model.animations.forEach(v => {
    if (v.show) v.show = !toggle
  });
  rule.show = toggle;
  t.set("", model)
})