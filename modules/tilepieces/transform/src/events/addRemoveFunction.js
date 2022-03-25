appView.addEventListener("click", e => {
  if (e.target.classList.contains("remove-function")) {
    model.functions.splice(+e.target.dataset.index, 1);
    var transform = model.functions.length ?
      model.functions.map(v => v.name + "(" + v.value + ")").reverse().join(" ") : "none";
    model.transform = setCss("transform", transform);
    //model.elementPresent.click();
    t.set("", model);
  }
  if (e.target.classList.contains("add-function")) {
    var newToken = matchTransformFunctions(model.transformNewType);
    newToken[0].index = model.functions.length;
    t.set("functions", model.functions.concat(newToken));
    inputCss(appView);
  }
})