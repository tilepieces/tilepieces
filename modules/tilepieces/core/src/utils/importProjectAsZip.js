function importProjectAsZip(blobFile) {
  return new Promise(async (resolve, reject) => {
    var app = tilepieces;
    var zip = await app.utils.newJSZip();
    try {
      var contents = await zip.loadAsync(blobFile);
      var projectsData = contents.files["tilepieces.projects.json"];
      var projects;
      if (!projectsData) {
        console.warn("zip doesn't contain 'tilepieces.projects.json'");
        var projectName = await app.utils.dialogNameResolver(null, null, "no 'tilepieces.projects.json' found. " +
          "Tilepieces will import the entire zip: Please type the new project name", true );
        projects = [{
          path : "",
          name : projectName
        }]
      }
      else{
        projects = JSON.parse(await projectsData.async("string"));
      }
      for (var i = 0; i < projects.length; i++) {
        var p = projects[i];
        var name = p.name;
        var path = p.path;
        dialog.open("importing project '" + name + "'", true);
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
          dialog.open("importing project '" + name + "' : " + file.relativePath, true);
          await app.storageInterface.update(file.relativePath, new Blob([await file.file.async("arraybuffer")]));
        }
        delete p.path;
        dialog.open("importing project '" + name + "' metadata", true);
        var component;
        if (p.components) {
          for (var icomp = 0; icomp < p.components.length; icomp++) {
            component = p.components[icomp];
            await app.storageInterface.createComponent({local: true, component})
          }
        }
        if(!p.lastFileOpened) {
          try{
            await app.storageInterface.read("index.html");
            p.lastFileOpened = "index.html";
          }
          catch(e) {
            var search = await app.storageInterface.search("", "**/*.html");
            p.lastFileOpened = search.searchResult[0] || null;
          }
        }
        await app.storageInterface.setSettings({
          projectSettings: p
        });
      }
      await app.getSettings();
      window.dispatchEvent(new CustomEvent('set-project', {
        detail: {name:projects[projects.length-1].name,lastFileOpened:p.lastFileOpened}
      }))
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}