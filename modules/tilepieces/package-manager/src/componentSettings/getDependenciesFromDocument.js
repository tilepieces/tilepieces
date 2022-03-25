function getDependenciesFromDocument(e) {
  var deps =
    [...app.core.htmlMatch.source.querySelectorAll("[" + app.componentAttribute + "]")];
  settingsModel.sources.dependencies = deps.map((v, index) => {
    var depName = v.getAttribute(app.componentAttribute);
    var dep = app.localComponents[depName];
    if (!dep) {
      console.trace();
      throw "error getting dependencies"
    }
    dep.index = index;
    return dep;
  });
  settingsTT.set("", settingsModel);
}