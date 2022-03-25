async function updateResourceFromComponent(toImport,
                                           componentParentName,
                                           componentName,
                                           path = "",
                                           merge = false) {
  if (Array.isArray(toImport)) {
    for (var i = 0; i < toImport.length; i++)
      updateResourceFromComponent(toImport[i], componentParentName, componentName, path)
  } else if (typeof toImport === "string") {
    var pathToImport = path ? path + toImport : toImport;
    var fileText = await app.storageInterface.read(pathToImport, componentParentName);
    var pathToUpdate =
      (merge ? "" : app.componentPath + "/" + componentParentName + "/") +
      (componentName != componentParentName ? pathToImport : toImport);
    await app.storageInterface.update(pathToUpdate.replace(/\/+/g,"/"), new Blob([fileText]));
  }
}