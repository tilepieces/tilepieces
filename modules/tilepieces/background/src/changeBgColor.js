appView.addEventListener("click", e => {
  if (!e.target.classList.contains("color-button"))
    return;
  var target = e.target;
  var cssProperty = target.dataset.cssProp;
  var throttle;
  app.colorPicker(target.style.backgroundColor).onChange(c => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      model.realBgColor = c.hex;
      var newColor = setCss(cssProperty, c.hex);
      model.backgroundColor = newColor;
      t.set("", model);
      inputCss(appView)
    }, 32)
  })
})