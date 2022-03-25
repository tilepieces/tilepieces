appView.addEventListener("change", e => { // change from gradient to url
  if (!e.target.classList.contains("image-type-select"))
    return;
  var value = e.target.value;
  var index = +e.target.dataset.index;
  if (value == "url") {
    model.backgrounds[index].backgroundImage = urlPlaceholder;
    var exGradient = e.target.parentNode.querySelector(".gradient");
    if (exGradient) {
      var i = gradientsEls.findIndex(v => v.gradientDOM == exGradient);
      gradientsEls.splice(i, 1);
    }
  } else
    model.backgrounds[index].backgroundImage = "linear-gradient(" + model.backgroundColor + "," + model.backgroundColor + ")";
  setCss("background-image", createNewBgProp("backgroundImage"));
  setBgModel(model.backgrounds[index].backgroundImage, index);
  t.set("", model);
  if (value != "url")
    gradientsEls.push(createNewGradient(e.target.parentNode.querySelector(".gradient"), index));
  inputCss(appView);
}, true);