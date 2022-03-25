function getStylesFromDocument(e) {
  var stylesheets =
    [...app.core.htmlMatch.source.querySelectorAll("link[rel=stylesheet]")];
  settingsModel.sources.stylesheets = stylesheets.map((v, i) => {
    var obj = {};
    obj.attrs = [...v.attributes].map(attr => {
      var obj = {};
      obj.name = attr.nodeName;
      obj.value = attr.nodeValue;
      return obj;
    });
    obj.index = i;
    return obj;
  });
  settingsTT.set("", settingsModel);
}