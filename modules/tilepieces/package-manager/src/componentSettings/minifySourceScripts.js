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
    var options =  typeof settingsModel.terserConfiguration === 'object' &&
      !Array.isArray(settingsModel.terserConfiguration) && settingsModel.terserConfiguration || app.terserConfiguration;
    minifyObj = {};
    minifyObj[options.sourceMap ? options.sourceMap.filename : bundlePath] = final;
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
      var path = bundlePath.split("/").filter((v,i,a)=>i!=a.length-1).join("/");
      await app.storageInterface.update((path + "/" + options.sourceMap.filename).replace(/\/+/g,"/"),
        new Blob([final]));
      await app.storageInterface.update((path + "/" + options.sourceMap.url).replace(/\/+/g,"/"),
        new Blob([finalMinified.map]));
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
