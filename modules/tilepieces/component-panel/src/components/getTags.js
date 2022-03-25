async function getTagsFromComponent(component,
                                    resourceType = "scripts",
                                    resourceAttrRef = "src",
                                    tagType = "script") {
  var scripts = component.sources[resourceType];
  var componentPath = getComponentPath(component);
  var elements = [];
  for (var i = 0; i < scripts.length; i++) {
    var s = scripts[i];
    var srcOrHref = s[resourceAttrRef];
    if (!srcOrHref)
      continue;
    var files = await getFiles(srcOrHref, component.name);
    for (var iF = 0; iF < files.length; iF++) {
      var file = files[i];
      var pathRelativeToProject = componentPath + file.path;
      var script = app.core.currentDocument.createElement(tagType);
      for (var k in s) {
        script.setAttribute(k, s[k]);
      }
      script.setAttribute(resourceAttrRef, pathRelativeToProject);
      if (tagType == "link")
        script.rel = "stylesheet";
      script.setAttribute(app.componentAttribute, component.name);
      elements.push(script);
    }
  }
  return elements;
}