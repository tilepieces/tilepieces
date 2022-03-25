function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  var properties = d.cssRules.properties;
  model.elementPresent = d.target;
  model.transform = properties.transform ? properties.transform.value : d.styles.transform;
  model.transformOrigin = properties["transform-origin"] ? properties["transform-origin"].value :
    d.styles.transformOrigin;
  model.transformStyle = properties["transform-style"] ? properties["transform-style"].value :
    d.styles.transformStyle;
  model.perspective = properties.perspective ? properties.perspective.value : d.styles.perspective;
  model.perspectiveOrigin = properties["perspective-origin"] ? properties["perspective-origin"].value :
    d.styles.perspectiveOrigin;
  model.functions = matchTransformFunctions(model.transform).reverse()
    .map((v, i) => {
      v.index = i;
      return v
    });
  model.isVisible = true;
  t.set("", model);
  inputCss(appView);
}