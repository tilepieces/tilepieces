function changeTab(e) {
  if (e.target.classList.contains("true"))
    return;
  //var backgrounds = model.backgrounds.slice(0);
  var exSel = model.backgrounds.find(f => f.isSelected);
  exSel.isSelected = "";
  var index = +e.target.dataset.targetIndex;
  model.backgrounds[index].isSelected = "selected";
  model.tabToSelect = index;
  t.set("backgrounds", model.backgrounds);
}