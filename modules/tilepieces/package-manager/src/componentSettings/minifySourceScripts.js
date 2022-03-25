async function minifySourceScripts() {
  openerDialog.open("minifying scripts...", true, true);
  try {
    var {final, bundlePath, originalBundleName} = await concatenateSources("scripts", true);
    if (!window.Terser) {
      await import("./../../terser/terser.bundle.min.js") // https://unpkg.com/terser
    }
  } catch (e) {
    console.error("[error trying concatenating scripts]", e);
    openerDialog.open("concatenating scripts error");
    return;
  }
  try {
    var options = {};
    options = app.terserConfiguration;
    minifyObj = {};
    minifyObj[bundlePath] = final;
    var finalMinified = await window.Terser.minify(minifyObj, options);
    if (typeof finalMinified.code !== "string")
      throw "code minification error";
  } catch (e) {
    console.error("[error trying minifing scripts]", e);
    openerDialog.open("concatenating minifing error:\n" + e.toString());
    return;
  }
  try {
    if (options.sourceMap) {
      await app.storageInterface.update(options.sourceMap.filename, new Blob([final]));
      await app.storageInterface.update(options.sourceMap.url, new Blob([finalMinified.map]));
    }
    await app.storageInterface.update(bundlePath, new Blob([finalMinified.code]));
    if (!originalBundleName) {
      var defaultPath = settingsModel.__local ?
        settingsModel.path + "/" :
        "";
      settingsTT.set("bundle.scripts", [{name: "src", value: bundlePath.replace(defaultPath, "")}]);
    }
    openerDialog.close()
  } catch (e) {
    console.error("[error minification]", e);
    openerDialog.open("error minification");
  }
};
