function importComponentAsZip(blobFile, local) {
  return new Promise(async (resolve, reject) => {
    if (!window.JSZip) {
      await import("./../../jszip/jszip.min.js");
    }
    var zip = new JSZip();
    try {
      var contents = await zip.loadAsync(blobFile);
      var componentsData = contents.files["tilepieces.components.json"];
      if (!componentsData)
        throw("no data in zip");
      var components = JSON.parse(await componentsData.async("string"));
      for (var k in components) {
        var comp = components[k];
        var files = {};
        var fileArr = [];
        var path = comp.path[0] == "/" ? comp.path.substring(1) : comp.path;
        zip.folder(path).forEach((relativePath, file) => {
          if (!file.dir)
            files[relativePath] = file;
        });
        for (var f in files) {
          opener.dialog.open("creating "+f+" blob...",true);
          fileArr.push({
            path: f,
            blob: new Blob([await files[f].async("arraybuffer")])
          })
        }
        if (local)
          comp.path = "/" + app.componentPath + "/" + comp.name;
        else
          comp.path = "components/" + comp.name;
        opener.dialog.open("saving files...",true);
        await app.storageInterface.createComponent({
          local,
          component: comp
        }, fileArr);
      }
      await app.getSettings();
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}