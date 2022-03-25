function setBgModel(bi, i) {
  var newB = {};
  newB.index = i;
  var gradient = matchGradients(bi);
  newB.hasGradient = !!gradient.length;
  newB.hasUrl = bi.match(/url\([^)]*\)/);
  var imageSrc = newB.hasUrl ? newB.hasUrl[0].replace("url(", "").replace(/"|'|\)/g, "") : "";
  newB.imageSrc = parsingImageUrl(imageSrc);
  newB.imageType = newB.hasGradient ? "gradient" : newB.hasUrl ? "url" : "";
  newB.gradientModel = gradient.length ? gradient[0] : null;
  newB.backgroundImage = bi;
  var bg = model.backgrounds[i] || {};
  newB.backgroundRepeat = bg.backgroundRepeat || model.backgroundsRepeat[i] || "repeat";
  newB.backgroundPositionX = bg.backgroundPositionX || model.backgroundsPositionX[i] || "0%";
  newB.backgroundPositionY = bg.backgroundPositionY || model.backgroundsPositionY[i] || "0%";
  newB.backgroundOrigin = bg.backgroundOrigin || model.backgroundsOrigin[i] || "padding-box";
  newB.backgroundClip = bg.backgroundClip || model.backgroundsClip[i] || "border-box";
  newB.backgroundAttachment = bg.backgroundAttachment || model.backgroundsAttachment[i] || "scroll";
  newB.backgroundSize = bg.backgroundSize || model.backgroundsSize[i] || "auto auto";
  newB.backgroundBlendMode = bg.backgroundBlendMode || model.backgroundsBlendMode[i] || "normal";
  console.log(model.tabToSelect);
  newB.isSelected = i == model.tabToSelect ? "selected" : "";
  model.backgrounds[i] = newB;
}