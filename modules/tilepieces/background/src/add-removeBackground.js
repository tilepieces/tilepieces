function addBackground() {
  //var templateToAdd = "linear-gradient(" + model.backgroundColor + "," + model.backgroundColor + ")";
  var templateToAdd = urlPlaceholder;
  var newBackground;
  if (model.backgroundImage == "initial" || model.backgroundImage == "unset" ||
    model.backgroundImage == "inherit" || model.backgroundImage == "none") {
    newBackground = templateToAdd
  } else {
    newBackground = model.backgroundImage + "," + templateToAdd;
    model.tabToSelect = model.backgrounds.length;
  }
  setCss("background-image", newBackground);
  var exSel = model.backgrounds.find(f => f.isSelected);
  exSel.isSelected = "";
  model.tabToSelect = model.backgrounds.length;
  setBgModel(templateToAdd, model.tabToSelect);
  t.set("", model);
  inputCss(appView);
}

function removeBackground(e) {
  var index = +e.target.dataset.index;
  model.backgroundsImages.splice(index, 1);
  model.backgrounds.splice(index, 1);
  var newBackground = model.backgroundsImages.join(",") || "none";
  model.backgroundImage = newBackground;
  model.tabToSelect = index - 1 > -1 ? index - 1 : 0;
  model.backgrounds.forEach((v, i) => {
    if (i == model.tabToSelect) {
      v.isSelected = "selected";
    } else v.isSelected = "";
    v.index = i;
  });
  setCss("background-image", newBackground);
  t.set("", model);
}