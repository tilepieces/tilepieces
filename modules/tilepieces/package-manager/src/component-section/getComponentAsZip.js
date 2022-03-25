async function getComponentAsZip(pkg, zip, pkgName, isLocal, componentsCache = [],updatePath = "") {
  if (componentsCache.find(a => a.name == pkg.name))
    return componentsCache;

  var path = ((pkg.path || "") + "/").replace(/\/+/g, "/");
  var updatepath = (updatePath + "/").replace(/\/+/g, "/");
  var style = pkg.bundle.stylesheet;
  var script = pkg.bundle.script;
  var getSettingsRaw = await app.storageInterface.read(path + "tilepieces.component.json", isLocal ? null : pkgName);
  var settings = JSON.parse(getSettingsRaw);
  pkg.html && zip.file(updatepath + pkg.html,
    await app.storageInterface.read(path + pkg.html, isLocal ? null : pkgName));
  script.src && zip.file(updatepath + script.src,
    await app.storageInterface.read(path + script.src, isLocal ? null : pkgName));
  style.href && zip.file(updatepath + style.href,
    await app.storageInterface.read(path + style.href, isLocal ? null : pkgName));
  pkg.parseHTML && zip.file(updatepath + pkg.parseHTML,
    await app.storageInterface.read(path + pkg.parseHTML, isLocal ? null : pkgName));
  if (pkg.miscellaneous)
    await getComponentGlobArray(pkg.miscellaneous, path, updatepath, zip, isLocal ? null : pkgName);
  pkg.interface && zip.file(updatepath + pkg.interface,
    await app.storageInterface.read(path + pkg.interface, isLocal ? null : pkgName));
  if (pkg.interfaceFiles) {
    await getComponentGlobArray(pkg.interfaceFiles, path, updatepath, zip, isLocal ? null : pkgName);
  }
  if (settings.components) {
    for (var k in settings.components) {
      var cmp = settings.components[k];
      var splitted = cmp.name.split("/");
      if(isLocal){
        var startComponents = localComponentsUIMOdel.localComponents;
        var start;
        splitted.forEach((v,i,a)=>{
          var name = a.slice(0,i+1).join("/");
          start = startComponents.find(c=>c.name==name);
          startComponents = start.components;
        })
        if(start && !start.checked) {
          delete settings.components[k];
          continue;
        }
      }
      openerDialog.open("exporting " + cmp.name + " component...", true);
      componentsCache = await getComponentAsZip(pkg.components[k], zip, pkgName, isLocal, componentsCache,
        (updatepath + "/" + cmp.path).replace(/\/+/g, "/"));
    }
  }
  /*
  if (pkg.dependencies) {
    for (var i = 0; i < pkg.dependencies.length; i++) {
      var dep = pkg.dependencies[i];
      if (componentsCache.find(a => a.name == dep))
        continue;
      var alreadyPresent = app.localComponentsFlat[dep];
      if (!alreadyPresent && isLocal)
        throw "Export error:dependency " + dep + " is not present in local library";
      if (!alreadyPresent) {
        var splitDep = dep.split("/");
        if (splitDep.length > 1) {
          var mainDep = splitDep[0];
          alreadyPresent = app.globalComponents[mainDep];
          if (alreadyPresent &&
            !Object.values(alreadyPresent.components).find(v => v.name == dep))
            throw "Export error:dependency " + dep + " is not present in library";
        } else
          alreadyPresent = app.globalComponents[dep];
        if (!alreadyPresent)
          throw "Export error:dependency " + dep + " is not present in library";
        componentsCache = await getComponentAsZip(alreadyPresent, zip, alreadyPresent.name, isLocal, componentsCache);
      }
    }
  }*/
  //pkg.path = "/" + pkg.name.split("/").pop();
  delete settings.path;
  zip.file(updatepath + "tilepieces.component.json", JSON.stringify(settings,null,2));
  componentsCache.push(pkg);
  return componentsCache;
}

async function getComponentGlobArray(globArray, path, updatepath, zip, pkgName) {
  for (var i = 0; i < globArray.length; i++) {
    var iGlob = globArray[i];
    var files = await app.storageInterface.search(path, iGlob, null, pkgName);
    for (var ifo = 0; ifo < files.searchResult.length; ifo++) {
      var file = files.searchResult[ifo];
      var filepath = updatepath + file;
      var fileText = await app.storageInterface.read(path + file, pkgName);
      zip.file(filepath, fileText);
    }
  }
}