appView.addEventListener("click", e => {
  if (!e.target.classList.contains("add-media-feature"))
    return;
  model.mediaQueryUIMaskFeatures.push(
    {
      logicalOperator: "and", feature: "max-width",
      mediaQueryMainLogicalOperator: "",
      value: app.core.currentWindow.innerWidth + "px", featureInput: "input", index: 0
    }
  );
  changeMediaCondition();
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-feature"))
    return;
  model.mediaQueryUIMaskFeatures.splice(e.target.dataset.index, 1);
  model.mediaQueryUIMaskFeatures = model.mediaQueryUIMaskFeatures.map((v, i) => {
    v.index = i;
    return v;
  });
  changeMediaCondition();
});
appView.addEventListener("change", e => {
  var target = e.target;
  if (!target.classList.contains("media-feature"))
    return;
  var value = target.value;
  model.mediaQueryUIMaskFeatures[target.dataset.index].featureInput =
    value == "orientation" ? "orientation" : "input";
  if (value != "orientation")
    model.mediaQueryUIMaskFeatures[target.dataset.index].value = value.indexOf("width") >= 0 ?
      app.core.currentWindow.innerWidth + "px" :
      app.core.currentWindow.innerHeight + "px";
  changeMediaCondition();
});
