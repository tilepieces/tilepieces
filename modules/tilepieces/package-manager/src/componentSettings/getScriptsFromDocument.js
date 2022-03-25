function getScriptsFromDocument(e) {
  var scripts =
    [...app.core.htmlMatch.source.querySelectorAll("script[src]")];
  settingsModel.sources.scripts = scripts.map((v, i) => {
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