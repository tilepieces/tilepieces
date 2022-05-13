async function concatenateSources(type, noUpdate) {
  var key1 = type,
    key2 = key1 == "scripts" ? "script" : "stylesheet",
    key3 = key1 == "scripts" ? "js" : "css",
    key4 = key1 == "scripts" ? "src" : "href";
  openerDialog.open(`concatenating ${key1}`, true);
  var nameSplitted = settingsModel.name.split("/");
  var name = settingsModel.name;
  var defaultPath = settingsModel.__local ?
    settingsModel.path + "/" :
    "";
  try {
    var search = await app.storageInterface.search(
      defaultPath, settingsModel.sources[key1].map(v => v.value), null);
    var final = settingsModel.bundle[key2 + "Header"] ?
      settingsModel.bundle[key2 + "Header"] + "\n" : "";
    if (settingsModel.addDependenciesToBundles) {
      var pkg = app.localComponentsFlat[name];
      final += await getDependencies(pkg, key2, key4);
    }
    for (var i = 0; i < search.searchResult.length; i++) {
      var source = search.searchResult[i];
      if (source.match(app.utils.URLIsAbsolute))
        return;
      final += await app.storageInterface.read(defaultPath + source);
      if (i<search.searchResult.length-1) final += "\n";
    }
    var bundleNameInCompSettings = settingsModel.bundle[key2] &&
      settingsModel.bundle[key2].find(v => v.name == key4);
    var originalBundleName = bundleNameInCompSettings && bundleNameInCompSettings.value;
    if (originalBundleName && bundleNameInCompSettings.value.startsWith(defaultPath))
      originalBundleName = originalBundleName.replace(defaultPath, "");
    var bundlePath = (originalBundleName &&
        (defaultPath + originalBundleName).replace(/\/\//g, "/")) ||
      (defaultPath + settingsModel.name.replaceAll("/",".") + ".bundle." + key3).replace(/\/\//g, "/");
    /*
    if(!bundleNameInCompSettings || !bundleNameInCompSettings.value ||
        bundleNameInCompSettings.value != bundlePath)
        bundleNameInCompSettings.value = bundlePath*/
  } catch (e) {
    console.error(`[error trying concatenating ${key1}]`, e);
    openerDialog.open(`error trying concatenating ${key1}`);
    return;
  }
  final += settingsModel.bundle[key2 + "Footer"] ?
    "\n" + settingsModel.bundle[key2 + "Footer"] : "";
  if (noUpdate)
    return {final, bundlePath, originalBundleName};
  app.storageInterface.update(bundlePath, new Blob([final])).then(
    res => {
      openerDialog.close();
      if (!originalBundleName) {
        settingsTT.set("bundle." + key2, [{name: key4, value: bundlePath.replace(defaultPath, "")}]);
        submitSettings();
      }

    }, err => {
      console.error(`[error trying updating bundle ${key1} after concatenation]`, err);
      openerDialog.open("updating bundle error");
    }
  )
};