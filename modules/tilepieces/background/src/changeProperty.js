appView.addEventListener("input", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  var inputCss = e.target;
  var cssProp = inputCss.dataset.cssProp;
  if (!cssProp)
    return;
  var cssPropJs = inputCss.dataset.cssPropJs;
  /*
  if(cssPropJs=="backgroundImage")
      return;*/
  var newRule;
  var index;
  if (cssPropJs != "backgroundColor") {
    index = +inputCss.closest(".backgrounds").dataset.index;
    model.backgrounds[index][cssPropJs] = inputCss.innerText;
    newRule = createNewBgProp(cssPropJs);
  } else
    newRule = inputCss.innerText;
  setCss(cssProp, newRule);
}, true);
appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  var inputCss = e.target;
  var cssPropJs = inputCss.dataset.cssPropJs;
  if (cssPropJs != "backgroundImage")
    return;
  var index = +inputCss.closest(".backgrounds").dataset.index;
  model.backgrounds[index][cssPropJs] = inputCss.innerText;
  var realNewValue = setCss("background-image", createNewBgProp("backgroundImage"));
  realNewValue = matchBackgrounds(realNewValue)[index];
  if (cssPropJs == "backgroundImage") {
    setBgModel(realNewValue, +inputCss.closest(".backgrounds").dataset.index);
    t.set("", model);
    if (model.backgrounds[index].hasGradient) {
      var gradient = appView.querySelector(".backgrounds[data-index='" + index + "'] .gradient");
      var isAlreadyGradientObject = gradientsEls.find(v => gradient);
      if (!isAlreadyGradientObject)
        gradientsEls.push(createNewGradient(gradient, index));
      else
        isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
    }
  }
}, true);
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
/*
appView.addEventListener("blur",e=>{
    if(!e.target.classList.contains("input-css"))
        return;
    var inputCssEl = e.target;
    var cssProp = inputCssEl.dataset.cssProp;
    var cssPropJs = inputCssEl.dataset.cssPropJs;
    if(!cssProp)
        return;
    var realNewRule = inputCssEl.dataset.realNewValue;
    if(cssPropJs != "backgroundImage" &&
        typeof realNewRule != "string")
        return;
    var index;
    if(realNewRule!=inputCssEl.innerText) {
        if (cssPropJs != "backgroundColor" && cssPropJs != "backgroundImage") {
            index = +inputCssEl.closest(".backgrounds").dataset.index;
            model.backgrounds[index][cssPropJs] = realNewRule;
        }
        else if(cssPropJs == "backgroundImage"){
            index = +inputCssEl.closest(".backgrounds").dataset.index;
            model.backgrounds[index][cssPropJs] = inputCssEl.innerText;
            var realNewValue = setCss("background-image", createNewBgProp("backgroundImage"));
            model.backgrounds[index][cssPropJs] = matchBackgrounds(realNewValue)[index] || "none";
        }
        else
            model.backgroundColor = realNewRule;
    }
    delete inputCssEl.dataset.realNewValue;
    if(cssPropJs=="backgroundImage") {
        setBgModel(model.backgrounds[index].backgroundImage, index);
        t.set("", model);
        if(model.backgrounds[index].hasGradient){
            var gradient = appView.querySelector(".backgrounds[data-index='" + index + "'] .gradient");
            var isAlreadyGradientObject = gradientsEls.find(v=>gradient)
            if(!isAlreadyGradientObject)
                gradientsEls.push(createNewGradient(gradient,index));
            else
                isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
        }
    }
    else
        t.set("", model);
    inputCss(appView);
},true);
    */