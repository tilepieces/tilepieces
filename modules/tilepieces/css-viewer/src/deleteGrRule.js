appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-gr-rule"))
    return;
  var index = +e.target.dataset.index;
  var gr = model.groupingRules[index];
  app.core.deleteCssRule(gr.rule);
  // this will run "cssMapper-changed"
});