async function getBundleFromComponent(component,
                                      resourceType = "script",
                                      resourceAttrRef = "src",
                                      tagType = "script") {
  var componentPath = getComponentPath(component);
  var scriptModel = Object.assign({}, component.bundle[resourceType]);
  var src = scriptModel[resourceAttrRef];
  var pathRelativeToProject = (componentPath + "/" + src).replace(/\/+/g,"/");
  var DOMel = app.core.currentDocument.createElement(tagType);
  scriptModel[resourceAttrRef] = pathRelativeToProject;
  if (tagType == "link")
    scriptModel.rel = "stylesheet";
  for (var k in scriptModel) {
    DOMel.setAttribute(k, scriptModel[k])
  }
  DOMel.setAttribute(app.componentAttribute, component.name);
  return DOMel;
}