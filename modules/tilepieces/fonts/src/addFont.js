addFont.addEventListener("click", e => {
  var fonts = model.fonts.slice(0);
  var currentStylesheet = app.core.currentStyleSheet;
  var ffr = fontFaceRule(fontModel);
  if (!currentStylesheet) {
    app.core.createCurrentStyleSheet(ffr);
  } else {
    app.core.insertCssRule(currentStylesheet, ffr);
    var index = currentStylesheet.cssRules.length;
    var rule = currentStylesheet.cssRules[index - 1];
    var mapped = {
      fontFamily: "",
      fontWeight: "",
      fontStyle: "",
      fontDisplay: "",
      unicodeRange: "",
      fontStretch: "",
      fontVariant: "",
      fontFeatureSettings: "",
      fontVariationSettings: "",
      src: ""
    };
    app.core.styles.fonts.push({mapped, fontFaceRule: rule, cssText: rule.cssText});
    assignModel({detail: app.core});
  }
});