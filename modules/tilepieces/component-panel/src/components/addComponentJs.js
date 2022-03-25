// return the first dom element inserted.
async function addComponentJs(component, index, dependenciesFlat) {
  var currentDoc = app.core.currentDocument;
  // search in the document with [data-tilepieces-component]
  try {
    var toRemove = currentDoc.querySelectorAll(`[${app.componentAttribute}="${component.name}"]`);
  } catch (e) {
    console.error(e);
    opener.dialog.open(e);
    return;
  }
  let setCurrentStylesheet;
  // remove all previous element labeled as this component
  toRemove.forEach(v => {
    if (v.tagName == "SCRIPT" && app.utils.javascriptMimeTypes.indexOf(v.type) > -1) {
      app.core.htmlMatch.removeChild(v)
    }

  });
  // setting scripts
  //var oldBundleScript = currentDoc.querySelector(`script[${app.componentAttribute}="${component.name}"]`);
  var scriptEl = await getBundleFromComponent(component);
  //oldBundleScript && app.core.htmlMatch.removeChild(oldBundleScript,scriptEl);
  var oldBundleScriptDep = dependenciesFlat[index - 1];
  var oldBundleScript;
  if (oldBundleScriptDep) {
    oldBundleScript = findBundleScripts(oldBundleScriptDep.name);
    oldBundleScript && app.core.htmlMatch.after(oldBundleScript, scriptEl);
  }
  if (!oldBundleScript) {
    for (var obsi = index + 1; obsi < dependenciesFlat.length; obsi++) {
      oldBundleScript = findBundleScripts(dependenciesFlat[obsi].name);
      if (oldBundleScript)
        break;
    }
    if (oldBundleScript)
      app.core.htmlMatch.before(oldBundleScript, scriptEl);
    else
      app.core.htmlMatch.append(currentDoc.body, scriptEl);
  }
}