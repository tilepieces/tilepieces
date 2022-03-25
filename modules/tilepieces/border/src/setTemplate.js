function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
  }
  var d = e.detail;
  var properties = d.cssRules.properties;
  model.elementPresent = d.target;
  model._properties = d.cssRules.properties;
  model._styles = d.styles;
  model.border = getProp("border");
  /* border width */
  model.borderWidth = getProp("border-width");
  model.borderWidthLink = (d.styles.borderTopWidth == d.styles.borderLeftWidth &&
    d.styles.borderLeftWidth == d.styles.borderBottomWidth &&
    d.styles.borderBottomWidth == d.styles.borderRightWidth);
  model.borderWidthUnlink = !model.borderWidthLink;
  model.borderTopWidth = getProp("border-top-width");
  model.borderLeftWidth = getProp("border-left-width");
  model.borderBottomWidth = getProp("border-bottom-width");
  model.borderRightWidth = getProp("border-right-width");

  /* border style */
  model.borderStyle = getProp("border-style");
  model.borderStyleLink = (d.styles.borderTopStyle == d.styles.borderLeftStyle &&
    d.styles.borderLeftStyle == d.styles.borderBottomStyle &&
    d.styles.borderBottomStyle == d.styles.borderRightStyle);
  model.borderStyleUnlink = !model.borderStyleLink;
  model.borderTopStyle = getProp("border-top-style");
  model.borderLeftStyle = getProp("border-left-style");
  model.borderBottomStyle = getProp("border-bottom-style");
  model.borderRightStyle = getProp("border-right-style");

  /* border color*/
  model.borderColor = getProp("border-color");
  model.realBorderColor = d.styles.borderColor.match(/rgb\([^)]*\)|rgba\([^)]*\)/)[0];
  model.borderColorLink = (d.styles.borderTopColor == d.styles.borderLeftColor &&
    d.styles.borderLeftColor == d.styles.borderBottomColor &&
    d.styles.borderBottomColor == d.styles.borderRightColor);
  model.borderColorUnlink = !model.borderColorLink;
  model.borderTopColor = getProp("border-top-color");
  model.realBorderTopColor = d.styles.borderTopColor;
  model.borderLeftColor = getProp("border-left-color");
  model.realBorderLeftColor = d.styles.borderLeftColor;
  model.borderBottomColor = getProp("border-bottom-color");
  model.realBorderBottomColor = d.styles.borderBottomColor;
  model.borderRightColor = getProp("border-right-color");
  model.realBorderRightColor = d.styles.borderRightColor;

  /* border radius*/
  model.borderRadius = getProp("border-radius");
  model.borderRadiusLink = (d.styles.borderTopLeftRadius == d.styles.borderTopRightRadius &&
    d.styles.borderTopRightRadius == d.styles.borderBottomRightRadius &&
    d.styles.borderBottomRightRadius == d.styles.borderBottomLeftRadius);
  model.borderRadiusUnlink = !model.borderRadiusLink;
  model.borderTopLeftRadius = getProp("border-top-left-radius");
  model.borderTopRightRadius = getProp("border-top-right-radius");
  model.borderBottomRightRadius = getProp("border-bottom-right-radius");
  model.borderBottomLeftRadius = getProp("border-bottom-left-radius");

  /* border image */
  model.borderImage = getProp("border-image");
  model.borderImageBase = properties["border-image-source"] ?
    properties["border-image-source"].rule.parentStyleSheet.href :
    app.core.currentDocument.location.href;
  model.borderImageSource = getProp("border-image-source");
  var gradient = matchGradients(d.styles.borderImageSource);
  model.hasGradient = !!gradient.length;
  var hasUrl = model.borderImageSource.match(/url\([^)]*\)/);
  model.hasUrl = !!hasUrl;
  var imageSrc = hasUrl ? hasUrl[0].replace("url(", "").replace(/"|'|\)/g, "") : "";
  model.imageSrc = imageSrc ? parsingImageUrl(imageSrc) : "";
  model.imageType = model.hasGradient ? "gradient" : model.hasUrl ? "url" : "none";
  model.borderImageSlice = getProp("border-image-slice");
  model.borderImageWidth = getProp("border-image-width");
  model.borderImageOutset = getProp("border-image-outset");
  model.borderImageRepeat = getProp("border-image-repeat");
  model.boxShadow = getProp("box-shadow");
  mapBoxShadow(d.styles.boxShadow);
  /* outline */
  model.outline = getProp("outline");
  model.outlineWidth = getProp("outline-width");
  model.outlineStyle = getProp("outline-style");
  model.outlineColor = getProp("outline-color");
  model.realOutlineColor = d.styles.outlineColor;
  model.outlineOffset = getProp("outline-offset");

  model.isVisible = true;
  t.set("", model);
  inputCss(appView);
  if (model.hasGradient)
    gradientObject.set(gradient[0]);
  setBoxShadowSVGtoXY()
}
