appView.addEventListener("input", e => {
  if (e.target.dataset.type != "transform-function")
    return;
  model.functions[+e.target.dataset.index].value = e.target.textContent.trim();
  var transform = model.functions.map(v => v.name + "(" + v.value + ")").reverse().join(" ");
  setCss("transform", transform);
  //t.set("transform",transform);
  //inputCss(appView);
});
appView.addEventListener("blur", e => {
  if (e.target.dataset.type != "transform-function")
    return;
  //model.functions[Number(e.target.dataset.index)].value = e.target.textContent.trim();
  //var transform = model.functions.map(v=>v.name+"("+v.value+")").reverse().join(" ");
  //setCss("transform",transform);
  //t.set("transform",transform);
  //inputCss(appView);
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);