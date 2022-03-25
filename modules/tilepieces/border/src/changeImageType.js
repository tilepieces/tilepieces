appView.addEventListener("imageType", e => { // change from gradient to url
  var value = e.detail.target.value;
  var imageSource;
  if (value == "none")
    imageSource = value;
  else
    imageSource = value == "url" ? urlPlaceholder : "linear-gradient(" + model.realBorderColor + "," + model.realBorderColor + ")";
  setCss("border-image-source", imageSource);
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
var throttleGradientChange;
gradientEl.addEventListener("gradient-change", e => {
  clearTimeout(throttleGradientChange);
  throttleGradientChange = setTimeout(() => {
    var value = e.detail;
    model.borderImageSource = setCss("border-image-source", value);
    t.set("", model);
    inputCss(appView);
  });
});