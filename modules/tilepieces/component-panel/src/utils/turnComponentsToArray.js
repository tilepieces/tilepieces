function turnComponentsToArray(comps, isDep = false) {
  var compsOrdered = Object.keys(comps).sort((a, b) => a.localeCompare(b)).reduce(
    (obj, key) => {
      obj[key] = comps[key];
      return obj;
    },
    {}
  );
  var toArray = [];
  var frameResourcePath = app.frameResourcePath();
  if (frameResourcePath[0] != "/")
    frameResourcePath = "/" + frameResourcePath;
  if (!frameResourcePath.endsWith("/"))
    frameResourcePath = frameResourcePath + "/";
  for (var key in compsOrdered) {
    var c = Object.assign({}, compsOrdered[key]);
    toArray.push(c);
    if (c.html) {
      var p = c.path ?
        c.path[0] == "/" ? c.path : "/" + c.path :
        "/";
      c.__iframe_path = (frameResourcePath + p + "/" + c.html)
        .replace(/\/\//g, "/")
    }
    /*
      if(!c.html && (!c.miscellaneous || !c.miscellaneous.length) &&
          (!c.bundle.script || !Object.keys(c.bundle.script).length) &&
          (!c.bundle.stylesheet || !Object.keys(c.bundle.stylesheet).length)){
          c.noAdd = true;
      }
      */
    if (c.components)
      c.components = turnComponentsToArray(c.components, true);
  }
  return toArray;
}