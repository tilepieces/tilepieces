function importProjectAsZip(blobFile) {
  return new Promise(async (resolve, reject) => {
    if (!window.JSZip) {
      await import("./../../jszip/jszip.min.js");
    }
    var zip = new JSZip();
    try {
      var contents = await zip.loadAsync(blobFile);
      var projectsData = contents.files["tilepieces.projects.json"];
      if (!projectsData)
        throw("no data in zip");
      var projects = JSON.parse(await projectsData.async("string"));
      for (var i = 0; i < projects.length; i++) {
        var p = projects[i];
        var name = p.name;
        var path = p.path;
        openerDialog.open("importing project '" + name + "'", true);
        await app.storageInterface.create(name);
        await app.getSettings();
        app.updateSettings(name);
        var files = [];
        zip.folder(path).forEach((relativePath, file) => {
          if (!file.dir)
            files.push({relativePath, file})
        });
        for (var f = 0; f < files.length; f++) {
          var file = files[f];
          openerDialog.open("importing project '" + name + "' : " + file.relativePath, true);
          await app.storageInterface.update(file.relativePath, new Blob([await file.file.async("arraybuffer")]));
        }
        delete p.path;
        openerDialog.open("importing project '" + name + "' metadata", true);
        var component;
        if (p.components) {
          for (var icomp = 0; icomp < p.components.length; icomp++) {
            component = p.components[icomp];
            await app.storageInterface.createComponent({local: true, component})
          }

        }
        await app.storageInterface.setSettings({
          projectSettings: p
        });
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}