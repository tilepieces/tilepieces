appView.querySelector("#show-measure")
  .addEventListener("click", e => {
    if (!e.target.closest("button"))
      return;
    var propType = e.target.closest("div").id;
    var isSelected = e.target.closest(".label").classList.contains("selected");
    model[propType + "Linked"] = isSelected ? "" : "selected";
    t.set("", model);
  });
appView.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.dataset.cssProp && target.value) {
    setCss(target.dataset.cssProp, target.value);
    inputCss(appView);
  }
}, true);
/*
appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  var prop = e.target.dataset.cssProp;
  if (prop.match(/^(margin|padding|border)/) && e.target.dataset.linked) {
    if (prop.startsWith("margin")) {
      model.marginTop = e.target.innerText;
      model.marginLeft = e.target.innerText;
      model.marginRight = e.target.innerText;
      model.marginBottom = e.target.innerText;
    }
    if (prop.startsWith("padding")) {
      model.paddingTop = e.target.innerText;
      model.paddingLeft = e.target.innerText;
      model.paddingRight = e.target.innerText;
      model.paddingBottom = e.target.innerText;
    }
    if (prop.startsWith("border")) {
      model.borderTopWidth = e.target.innerText;
      model.borderLeftWidth = e.target.innerText;
      model.borderRightWidth = e.target.innerText;
      model.borderBottomWidth = e.target.innerText;
    }
    t.set("", model);
    inputCss(appView);
    flagCssInputSetText = true;
  }
}, true);*/
appView.addEventListener("focus", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  e.target.parentNode.classList.add("focus");
}, true);
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  e.target.parentNode.classList.remove("focus");
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
    if (e.target.dataset.value == e.target.innerText)
      return;
    if (prop.startsWith("margin") && target.dataset.linked) {
      prop = "margin";
    }
    if (prop.startsWith("padding") && target.dataset.linked) {
      prop = "padding";
    }
    if (prop.startsWith("border") && target.dataset.linked) {
      prop = "border-width";
    }
    setCss(prop, value);
    if (prop.match(/^(margin|padding|border)/) && e.target.dataset.linked) {
      if (prop.startsWith("margin")) {
        model.marginTop = value;
        model.marginLeft = value;
        model.marginRight = value;
        model.marginBottom = value;
      }
      if (prop.startsWith("padding")) {
        model.paddingTop = value;
        model.paddingLeft = value;
        model.paddingRight = value;
        model.paddingBottom = value;
      }
      if (prop.startsWith("border")) {
        model.borderTopWidth = value;
        model.borderLeftWidth = value;
        model.borderRightWidth = value;
        model.borderBottomWidth = value;
      }
      t.set("", model);
      inputCss(appView);
    }
  }
}, true);