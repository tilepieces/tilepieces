var dragList = __dragList(appView, {
  noDrop: true,
  handlerSelector: ".handler"
});
dragList.on("move", moveObj => {
  var targetIndex = moveObj.target[0].dataset.index;
  var newIndex = (moveObj.prev && moveObj.prev.dataset.index) || 0;
  var swap = model.functions[targetIndex];
  model.functions.splice(+targetIndex, 1);
  model.functions.splice(+newIndex, 0, swap);
  model.functions.forEach((v,i)=>v.index = i);
  var transform = model.functions.map(v => v.name + "(" + v.value + ")").reverse().join(" ");
  setCss("transform", transform);
  t.set("transform", transform);
  inputCss(appView);
});