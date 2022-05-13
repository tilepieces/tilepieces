async function getDependencies(pkg, bundleType, bundleAttr) {
  var text = "";
  var dependencies = getDependenciesFlat(pkg);
  for (var di = 0; di < dependencies.length; di++) {
    var depName = dependencies[di].name;
    var dep = app.localComponentsFlat[depName];
    if (!dep)
      throw "dependency '" + depName + "' is not present on local components";
    var depBundle = dep.bundle[bundleType] && dep.bundle[bundleType][bundleAttr];
    if (!depBundle)
      continue;
    var depBundlePath = (dep.path || "") + "/" + depBundle;
    depBundlePath.replace(/(\/\/)/g, "/");
    if (depBundlePath[0] == "/")
      depBundlePath = depBundlePath.substring(1);
    text += await app.storageInterface.read(depBundlePath);
    if (di<dependencies.length-1) text += "\n"
  }
  return text;
}