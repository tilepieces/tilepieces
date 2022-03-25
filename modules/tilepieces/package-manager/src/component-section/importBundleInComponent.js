async function importBundleInComponent(pkg, array = [], name = "", startPath = "") {
  if (array.find(a => a.name == pkg.name))
    return array;
  if(app.localComponents[pkg.name])
    await app.storageInterface.deleteComponent({
      local: true,
      component: {
        name: pkg.name
      },
      deleteFiles: true
    });
  array.push(pkg);
  var path = (startPath + (pkg.path||"") + "/").replace(/\/+/g,"/");
  var mergeMiscellaneous = pkg.mergeMiscellaneous;
  var miscellaneous = pkg.miscellaneous && pkg.miscellaneous.length ?
    await app.storageInterface.search("",
      name ?
        pkg.miscellaneous.map(v => path + v) :
        pkg.miscellaneous,
      null, name || pkg.name) :
    {searchResult: []};
  let i;
  let m;
  for(i=0;i<miscellaneous.searchResult.length;i++){
    m = miscellaneous.searchResult[i];
    await updateResourceFromComponent(m, name || pkg.name, null, "", mergeMiscellaneous);
  }
  var interfaceFiles = pkg.interfaceFiles && pkg.interfaceFiles.length ?
    await app.storageInterface.search("",
      name ?
        pkg.interfaceFiles.map(v => path + v) :
        pkg.interfaceFiles
      , null, name || pkg.name) :
    {searchResult: []};
  for(i=0;i<interfaceFiles.searchResult.length;i++){
    m = interfaceFiles.searchResult[i];
    await updateResourceFromComponent(m, name || pkg.name, null, "", mergeMiscellaneous);
  }
  // file to import
  var toImport = {
    dependencies: pkg.dependencies || [],
    components: pkg.components || [],
    bundleCss: pkg.bundle.stylesheet.href,
    bundleJs: pkg.bundle.script.src,
    html: pkg.html,
    interface: pkg.interface,
    parseHTML : pkg.parseHTML
  };
  for (var k in toImport) {
    var v = toImport[k];
    if (k == "dependencies") {
      for (i = 0; i < v.length; i++) {
        var dep = v[i].trim();
        if (!dep)
          continue;
        var alreadyPresent = app.localComponentsFlat[dep];
        if (!alreadyPresent) {
          var splitDep = dep.split("/");
          if (splitDep.length > 1) {
            var mainDep = splitDep[0];
            alreadyPresent = app.globalComponents[mainDep];
            if (alreadyPresent &&
              !Object.values(alreadyPresent.components).find(v => v.name == dep))
              throw "Import error:dependency " + dep + " is not present in library";
          } else
            alreadyPresent = app.globalComponents[dep];
          if (!alreadyPresent)
            throw "Import error:dependency " + dep + " is not present in library";
          array = await importBundleInComponent(alreadyPresent, array);
        }
      }
    } else if (k == "components") {
      for (var cName in v) {
        var pkgInner = v[cName];
        if (!pkgInner)
          continue;
        array = await importBundleInComponent(pkgInner, array, name || pkg.name, path);
        array.push(pkgInner);
      }
    } else {
      v && await updateResourceFromComponent(
        v, name || pkg.name, pkg.name, path);
    }
  }
  await updateResourceFromComponent("tilepieces.component.json",name || pkg.name, pkg.name, path);
  //pkg.path = ("/" + app.componentPath + "/" + (name ? name + "/" + pkg.path : pkg.name)).replace(/\/+/g, "/");
  return array;
}