let groupingRuleTrigger = appView.querySelector(".css-selector-gr-trigger");
/*
groupingRuleTrigger
  .addEventListener("click",e=>{
      //if(e.target.closest(".css-selector-gr-data"))
      if(e.target.classList.contains("delete-gr-rule"))
          return;
      groupingRuleTrigger.classList.toggle("open");
  });*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("grouping-condition"))
    return;
  var item = e.target.closest(".grouping-rule-item");
  if (!item)
    return;
  var selected = item.dataset.iscurrent == "true";
  var index = item.dataset.index;
  app.core.currentMediaRule = !selected ? model.groupingRules[index].rule : null;
  model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
  model.grChosen = model.groupingRules.find(v => v.isCurrentGr);
  t.set("", model);
});