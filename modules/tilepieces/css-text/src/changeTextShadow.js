appView.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.dataset.textShadow) {
    if (target.dataset.bind == "textShadowValue.blurToSlider")
      model.textShadows[target.dataset.index][target.dataset.textShadow] = target.value;
    model.textShadow = setTextShadow(model.textShadows);
    t.set("", model);
    inputCss(appView);
    setTextShadowSVGtoXY();
  }
}, true);
appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css") ||
    e.target.dataset.cssPropJs != "textShadow")
    return;
  mapTextShadow(e.target.innerText.trim());
  t.set("", model);
  setTextShadowSVGtoXY();
}, true);
/*
appView.addEventListener("blur",e=>{
    var target = e.target;
    if(target.dataset.textShadow){

    }
},true);*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("add-text-shadow"))
    return;
  model.textShadows.push({
    index: model.textShadows.length,
    color: "rgb(0,0,0)",
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    blurToSlider: 0
  });
  model.textShadow = setTextShadow(model.textShadows);
  t.set("", model);
  inputCss(appView);
  setTextShadowSVGtoXY();
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-text-shadow"))
    return;
  var index = +e.target.dataset.index;
  model.textShadows.splice(index, 1);
  model.textShadow = setTextShadow(model.textShadows);
  if (!model.textShadow)
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  else {
    t.set("", model);
    inputCss(appView);
  }
});