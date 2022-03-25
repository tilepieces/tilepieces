function getDependenciesFlat(component, dependenciesFlat = [], startComponent = null) {
  var name = component.name;
  if (component.dependencies) {
    for (var i = component.dependencies.length - 1; i >= 0; i--) {
      var nameDep = component.dependencies[i];
      var pkgDep = app.localComponentsFlat[nameDep];
      if (!pkgDep)
        throw "Dependency '" + nameDep + "' needed by '" + name + "' is not present in local components";
      var indexOfPkgDep = dependenciesFlat.indexOf(pkgDep);
      var indexOfMainComp = dependenciesFlat.indexOf(component);
      if (indexOfPkgDep < 0 || indexOfPkgDep > indexOfMainComp) {
        indexOfPkgDep > -1 && dependenciesFlat.splice(indexOfPkgDep, 1);
        dependenciesFlat.unshift(pkgDep);
        dependenciesFlat = getDependenciesFlat(pkgDep, dependenciesFlat, startComponent || component);
      }
    }
  }
  var pkg = app.localComponentsFlat[name];
  dependenciesFlat.indexOf(pkg) < 0 &&
  dependenciesFlat.push(pkg);
  return dependenciesFlat;
}