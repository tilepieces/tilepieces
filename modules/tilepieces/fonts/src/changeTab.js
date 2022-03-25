function changeTab(e) {
  if (e.target.classList.contains("true"))
    return;
  var exSel = model.fonts.find(f => f.isSelected);
  exSel.isSelected = "";
  model.fonts[e.target.dataset.targetIndex].isSelected = "selected";
  t.set("", model);
}

appView.addEventListener("click", e => {
  if (e.target.classList.contains("tab-link"))
    changeTab(e);
});