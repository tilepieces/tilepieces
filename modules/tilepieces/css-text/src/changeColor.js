appView.addEventListener("click", e => {
  if (!e.target.classList.contains("color-button"))
    return;
  var target = e.target;
  var cssProperty = target.dataset.cssProp;
  var throttle;
  app.colorPicker(target.style.backgroundColor).onChange(c => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      if (target.dataset.textShadow) {
        model.textShadows[target.dataset.index].color = c.hex;
        model.textShadow = setTextShadow(model.textShadows);
      } else {
        model.realColor = c.hex;
        model.color = setCss(cssProperty, c.hex);
      }
      t.set("", model);
      inputCss(appView)
    }, 32)
  })
})