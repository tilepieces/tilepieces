function createNewGradient(gEl, index) {
  var throttle;
  gEl.addEventListener("gradient-change", e => {
    model.backgrounds[index].backgroundImage = e.detail;
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      setCss("background-image", createNewBgProp("backgroundImage"));
      t.set("", model);
      inputCss(appView);
    }, 32);
  });
  return gradientView(gEl, model.backgrounds[index].gradientModel, true);
}