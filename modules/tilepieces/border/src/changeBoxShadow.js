appView.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.dataset.shadow) {
    if (target.dataset.bind == "boxShadowValue.blurToSlider")
      model.boxShadows[target.dataset.index][target.dataset.shadow] = target.value;
    model.boxShadow = setShadow();
    t.set("", model);
    inputCss(appView);
    if (target.dataset.shadow.startsWith("offset")) {
      var offsetX = model.boxShadows[target.dataset.index].offsetX;
      var offsetY = model.boxShadows[target.dataset.index].offsetY;
      var svg = appView.querySelector(".shadow[data-index='" + target.dataset.index + "'] svg");
      var isAlreadyShadow = shadows.find(v => v.target == svg);
      isAlreadyShadow.setXY((offsetX * 5) + 100, (offsetY * 5) + 100);
    }
  }
}, true);

appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css") ||
    e.target.dataset.cssPropJs != "boxShadow")
    return;
  mapBoxShadow(e.target.innerText.trim());
  t.set("", model);
  setBoxShadowSVGtoXY()
}, true);
/*
appView.addEventListener("blur",e=>{
    var target = e.target;
    if(target.dataset.textShadow){

    }
},true);*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("add-box-shadow"))
    return;
  model.boxShadows.push({
    index: model.boxShadows.length,
    type: "outset",
    color: "rgb(0,0,0)",
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0
  });
  model.boxShadow = setShadow();
  t.set("", model);
  inputCss(appView);
  setBoxShadowSVGtoXY();
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-box-shadow"))
    return;
  var index = +e.target.dataset.index;
  model.boxShadows.splice(index, 1);
  model.boxShadow = setShadow();
  if (!model.textShadow)
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  else {
    t.set("", model);
    inputCss(appView);
  }
});