function getComponentPath(component) {
  var path = component.path ?
    (component.path.startsWith("/") ? component.path.substring(1) : component.path) : "";
  // get relativePath need path ends with "/"
  if (!path.endsWith("/"))
    path += "/";
  return app.relativePaths ? app.utils.getRelativePath(app.utils.getDocumentPath(), path) : "/" + path;
}