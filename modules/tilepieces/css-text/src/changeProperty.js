/*
appView.addEventListener("template-digest",e=>{
    var target = e.detail.target;
    if(target.dataset.cssProp && target.value){
        setCss(target.dataset.cssProp,target.value);
        inputCss(appView);
    }
},true);*/
/*
appView.addEventListener("css-input-set-text",e=> {
    if (!e.target.classList.contains("input-css"))
        return;
    t.set("",model);
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