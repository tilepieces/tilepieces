appView.addEventListener("click", e => {
  if (!e.target.classList.contains("color-button"))
    return;
  var target = e.target;
  var cssProperty = target.dataset.cssProp;
  opener.tilepieces.colorPicker(target.style.backgroundColor).onChange(c => {
    target.style.backgroundColor = c.hex;
    if (cssProperty) {
      model[target.dataset.name] = c.hex;
      model[target.dataset.cssPropJs] = setCss(cssProperty, c.hex);
    } else {
      model.boxShadows[target.dataset.index].color = c.hex;//TODO change with preference
      model.textShadow = setShadow(model.boxShadows);
    }
    t.set("", model);
    inputCss(appView)
  })
});
/*
appView.addEventListener("input",e=>{
    var target = e.target;
    var inputCss = target.querySelector(".input-css");
    if(!inputCss)
        return;
    var cssProp = target.dataset.cssProperty;
    if(!cssProp)
        return;
    setCss(cssProp, inputCss.textContent);
},true);*/
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
appView.addEventListener("input", e => {
  var target = e.target;
  if (!target.classList.contains("input-css"))
    return;
  var prop = target.dataset.cssProp;
  if (prop) {
    var value = target.innerText;
    var newSetted = setCss(prop, value);
  }
}, true);
appView.addEventListener("css-input-set-text", e => { // handle borders changes
  if (!e.target.classList.contains("input-css"))
    return;
  var inputCss = e.target;
  var cssPropJs = inputCss.dataset.cssPropJs;
  if (cssPropJs.startsWith("border")) {
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  }
});
/*
appView.addEventListener("input",e=>{ // box-shadow
    var target = e.target;
    var inputCss = target.querySelector(".input-css");
    if(!inputCss)
        return;
    var shadow = target.dataset.shadow;
    if(!shadow)
        return;
    model.boxShadows[target.dataset.index][target.dataset.shadow] = inputCss.textContent;
    setShadow();
},true);
appView.addEventListener("change",e=>{ // box-shadow
    var target = e.target;
    var shadow = target.dataset.shadow;
    if(!shadow)
        return;
    model.boxShadows[target.dataset.index][target.dataset.shadow] = target.value;
    setShadow();
},true);*/