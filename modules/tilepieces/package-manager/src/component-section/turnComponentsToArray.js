function turnComponentsToArray(comps, isGlobal) {
  var toArray = [];
  var compsOrdered = Object.keys(comps).sort((a, b) => a.localeCompare(b)).reduce(
    (obj, key) => {
      obj[key] = comps[key];
      return obj;
    },
    {}
  );
  for (var key in compsOrdered) {
    var c = Object.assign({}, compsOrdered[key]);
    var isProjectPackage = c.name == app.project?.name;
    if (isProjectPackage && (isGlobal || !c.components || !Object.keys(c.components).length))
      continue;
    c.noSet = isProjectPackage || isGlobal;
    toArray.push(c);
    if (c.components && !Array.isArray(c.components) && typeof c.components === "object")
      c.components = turnComponentsToArray(c.components, isGlobal);
    else
      c.components = {};
    c.checked = true;
  }
  return toArray
}