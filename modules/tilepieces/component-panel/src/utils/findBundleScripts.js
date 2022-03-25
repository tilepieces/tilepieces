function findBundleScripts(name) {
  var possibleScripts = app.core.currentDocument.querySelectorAll(`script[${app.componentAttribute}="${name}"]`);
  for (var i = 0; i < possibleScripts.length; i++) {
    var possibleScript = possibleScripts[i];
    if (app.utils.javascriptMimeTypes.indexOf(possibleScript.type) > -1)
      return possibleScript
  }
}