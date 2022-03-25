function setTemplate(e) {
  if (appView.style.display == "none" || appView.hidden) // in css viewer
    return;
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  model.match = d.match;
  model.isVisible = true;
  var properties = d.cssRules.properties;
  model.backgroundColor = properties["background-color"] ? properties["background-color"].value :
    d.styles.backgroundColor;
  model.realBgColor = d.styles.backgroundColor;
  if (d.target != model.elementPresent)
    model.tabToSelect = 0;
  model.elementPresent = d.target;
  model.backgroundImageBase = properties["background-image"] ?
    properties["background-image"].rule.parentStyleSheet.href :
    app.core.currentDocument.location.href;
  var backgroundImage = properties["background-image"] ?
    properties["background-image"].value : d.styles.backgroundImage;
  model.backgroundImage = backgroundImage;
  model.backgroundsImages = matchBackgrounds(backgroundImage);
  var backgroundRepeat = properties["background-repeat"] ? properties["background-repeat"].value
    : d.styles.backgroundRepeat;
  model.backgroundsRepeat = backgroundRepeat.split(",").map(v => v.trim());

  var backgroundPositionX = properties["background-position-x"] ?
    properties["background-position-x"].value : d.styles.backgroundPositionX;
  model.backgroundsPositionX = backgroundPositionX.split(",").map(v => v.trim());

  var backgroundPositionY = properties["background-position-y"] ?
    properties["background-position-y"].value : d.styles.backgroundPositionY;
  model.backgroundsPositionY = backgroundPositionY.split(",").map(v => v.trim());

  var backgroundSize = properties["background-size"] ?
    properties["background-size"].value : d.styles.backgroundSize;
  model.backgroundsSize = backgroundSize.split(",").map(v => v.trim());

  var backgroundAttachment = properties["background-attachment"] ?
    properties["background-attachment"].value : d.styles.backgroundAttachment;
  model.backgroundsAttachment = backgroundAttachment.split(",").map(v => v.trim());

  var backgroundClip = properties["background-clip"] ?
    properties["background-clip"].value : d.styles.backgroundClip;
  model.backgroundsClip = backgroundClip.split(",").map(v => v.trim());

  var backgroundOrigin = properties["background-origin"] ?
    properties["background-origin"].value : d.styles.backgroundOrigin;
  model.backgroundsOrigin = backgroundOrigin.split(",").map(v => v.trim());

  var backgroundBlendMode = properties["background-blend-mode"] ?
    properties["background-blend-mode"].value : d.styles.backgroundBlendMode;
  model.backgroundsBlendMode = backgroundBlendMode.split(",").map(v => v.trim());
  model.backgrounds = [];
  model.backgroundsImages.forEach(setBgModel);
  t.set("", model);
  gradientsEls = [...appView.querySelectorAll(".gradient")].map(gEl => {
    var isAlreadyGradientObject = gradientsEls.find(v => v.gradientDOM == gEl);
    var index = +gEl.closest(".backgrounds").dataset.index;
    if (!isAlreadyGradientObject)
      return createNewGradient(gEl, index);
    else {
      isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
      return isAlreadyGradientObject;
    }
  });
  inputCss(appView);
}
