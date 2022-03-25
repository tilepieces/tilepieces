function assignModel(e) {
  var f = e.detail.styles && e.detail.styles.fonts;
  var fonts = f || [];
  var newFonts = fonts.reverse().map((font, index) => {
    var newFont = {};
    newFont.fontFaceRule = font.fontFaceRule;
    newFont.cssText = font.cssText;
    newFont.mapped = font.mapped;
    var src = newFont.mapped.src;
    var srcResources = !src ? [] : app.utils.splitCssValue(src);
    newFont.disabled = font.fontFaceRule.parentStyleSheet != e.detail.currentStyleSheet ?
      "disabled" : "";
    newFont.index = index;
    newFont.srcResources = srcResources.map((srcRes, index) => {
      var url = srcRes.match(urlRegex);
      var type;
      if (url) {
        url = url[0].substring(0, url[0].length - 1).replace(/url\(/g, "");
        type = "url";
      } else url = "";
      var format = srcRes.match(formatRegex);
      if (format) {
        format = format[0].substring(0, format[0].length - 1).replace(/format\(/g, "");
      } else format = "";
      var local = srcRes.match(localRegex);
      if (local) {
        local = local[0].substring(0, local[0].length - 1).replace(/local\(/g, "");
        type = "local";
      } else local = "";
      return {url, format, local, type, index};
    });
    newFont.isSelected = index == 0 ? "selected" : ""; // 0 is selected, others not
    return newFont;
  });
  model = {
    fonts: newFonts
  };
  if (!t)
    t = new opener.TT(appView, model);
  else
    t.set("", model);
}