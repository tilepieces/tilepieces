async function minifySourceStylesheets() {
  openerDialog.open("minifying stylesheets...", true, true);
  try {
    var nameSplitted = settingsModel.name.split("/");
    var defaultPath = settingsModel.__local ? app.componentPath + "/" + settingsModel.name + "/" : "";
    var search = await app.storageInterface.search(
      defaultPath, settingsModel.sources.stylesheets.map(v => v.value), null);
    var fakeDoc = document.implementation.createHTMLDocument("");
    var final = settingsModel.bundle.stylesheetHeader + "\n" || "";
    if (settingsModel.addDependenciesToBundles)
      final += await getDependencies("stylesheet", "href");
    for (var i = 0; i < search.searchResult.length; i++) {
      var source = search.searchResult[i];
      if (source.match(app.utils.URLIsAbsolute))
        return;
      var style = fakeDoc.createElement("style");
      style.innerHTML = await app.storageInterface.read(defaultPath + source);
      fakeDoc.head.appendChild(style);
      final += [...style.sheet.cssRules].map(v =>
        v.cssText.replace(/,\s+/g, ",").replace(/\s+\{\s+/g, "{").replace(/\s+\}\s+/g, "}")
      ).join("").replace(/(\r\n|\n|\r|\t)/gm, "");
    }
  } catch (e) {
    console.error("[error trying concatenating stylesheets]", e);
    openerDialog.open("concatenating stylesheets error");
  }
  final += "\n" + settingsModel.bundle.stylesheetFooter || "";
  var bundleSrc = settingsModel.bundle.stylesheet &&
    settingsModel.bundle.stylesheet.find(v => v.name == "src");
  var originalBundleName = bundleSrc && bundleSrc.value;
  if (originalBundleName && originalBundleName.startsWith(defaultPath))
    originalBundleName = originalBundleName.replace(defaultPath, "");
  var bundlePath = (originalBundleName &&
      (defaultPath + originalBundleName).replace(/\/\//g, "/")) ||
    (defaultPath + nameSplitted[0] + ".bundle.min.css").replace(/\/\//g, "/");
  app.storageInterface.update(bundlePath, new Blob([final])).then(res => {
      if (!bundleSrc)
        settingsTT.set("bundle.scripts", [{name: "src", value: bundlePath}]);
      openerDialog.close()
    }, err => {
      console.error("[error trying updating bundle stylesheets after concatenation]", err);
      openerDialog.open("udating bundle error");
    }
  );

};
