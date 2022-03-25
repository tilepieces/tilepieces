function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  model.match = d.match;
  model.isVisible = true;
  model._properties = d.cssRules.properties;
  model._styles = d.styles;
  model.elementPresent = d.target;
  model.fatherStyle = d.fatherStyle || {display: "none"}; // HTML TAG HAS NO FATHER
  var fatherStyle = model.fatherStyle;
  model.fontSize = getProp("font-size");
  model.fontFamily = getProp("font-family");
  model.fontWeight = getProp("font-weight");
  model.fontStyle = getProp("font-style");
  model.lineHeight = getProp("line-height");
  model.textAlign = getProp("text-align");
  model.realColor = d.styles["color"];
  model.color = getProp("color");
  model.textDecoration = getProp("text-decoration");
  model.textTransform = getProp("text-transform");
  model.textIndent = getProp("text-indent");
  model.letterSpacing = getProp("letter-spacing");
  model.wordSpacing = getProp("word-spacing");
  model.textShadow = getProp("text-shadow");
  mapTextShadow(d.styles.textShadow);
  t.set("", model);
  inputCss(appView);
  setTextShadowSVGtoXY();
}
