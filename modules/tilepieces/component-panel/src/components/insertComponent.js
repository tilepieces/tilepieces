// return the first dom element inserted.
async function insertComponent(component, index, dependenciesFlat, dependenciesInBundle) {
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
    if ((v.tagName == "LINK" ||
        (v.tagName == "SCRIPT" && app.utils.javascriptMimeTypes.indexOf(v.type) > -1) || component.fixedHTML) &&
      app.core.currentDocument.contains(v)) {
      if (app.core.currentStyleSheet?.ownerNode == v)
        setCurrentStylesheet = true;
      app.core.htmlMatch.removeChild(v)
    }

  });
  var newHTMLElement;
  var elementSelected = app.elementSelected.nodeType != 1 ? app.elementSelected.parentNode : app.elementSelected;
  if (component.html) {
    if (app.editMode == "selection" &&
      !app.contenteditable &&
      elementSelected &&
      !elementSelected.closest("head")) {
      var iel = 0;
      var el = app.cssSelectorObj.composedPath[iel];
      while (el.tagName.match(app.utils.notEditableTags) || el.tagName.match(app.utils.notInsertableTags)) {
        iel++;
        el = app.cssSelectorObj.composedPath[iel];
      }
      var elWhereInsert = component.fixedHTML ? el.ownerDocument.body :
        el.nodeName == "HTML" ?
          el.ownerDocument.body :
          el;
      var insertionMode = app.insertionMode;
      var scriptToAppendBefore, scriptMatch;
      var scriptsToAppendBefore = app.core.htmlMatch.source.querySelectorAll("body > script");
      scriptToAppendBefore = scriptsToAppendBefore ? [...scriptsToAppendBefore].find(s => app.utils.javascriptMimeTypes.indexOf(s.type) > -1) : null;
      if (scriptToAppendBefore)
        scriptMatch = app.core.htmlMatch.match(scriptToAppendBefore, false, false, true);
      if (component.fixedHTML) {
        elWhereInsert = scriptMatch || elWhereInsert;
        insertionMode = scriptMatch ? "before" : "append";
      }
      if (elWhereInsert.tagName == "BODY" && insertionMode == "before")
        insertionMode = "prepend";
      else if (elWhereInsert.tagName == "BODY" && insertionMode == "after")
        insertionMode = "append";
      //
      if (elWhereInsert.tagName == "BODY" && insertionMode == "append" && scriptMatch) {
        elWhereInsert = scriptMatch;
        insertionMode = "before";
      }
      var newElText = await app.storageInterface.read((component.path || "") + "/" + component.html);
      if (component.parseHTML) {
        try {
          var functionToParse = await app.storageInterface.read((component.path || "") + "/" + component.parseHTML);
          var HTMLText = newElText;
          var customParseFunction = new Function("HTMLText", "tilepieces", "return (" + functionToParse + ")(HTMLText, tilepieces)");
          HTMLText = customParseFunction(HTMLText, app);
          if (typeof HTMLText !== "string") {
            console.error("[HTMLText received] : ", HTMLText);
            throw "HTMLText received is not a string"
          }
          newElText = HTMLText;
        } catch (e) {
          console.error(e)
        }
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(newElText, "text/html");
      var fragment = currentDoc.createDocumentFragment();
      doc.querySelectorAll("link").forEach(l => l.remove());
      doc.querySelectorAll("script").forEach(s => {
        if (app.utils.javascriptMimeTypes.indexOf(s.type) > -1)
          s.remove();
      });
      [...doc.body.children].forEach(v => {
        v.setAttribute(app.componentAttribute, component.name);
        fragment.append(v)
      });
      newHTMLElement = fragment.children[0];
      app.core.htmlMatch.insertAdjacentElement(elWhereInsert, insertionMode, fragment);
    }
  }
  if (dependenciesInBundle && component != dependenciesInBundle.main)
    return newHTMLElement;
  // setting scripts
  if (component.bundle &&
    component.bundle.script &&
    component.bundle.script.src) {
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
  // setting stylesheets
  if (component.bundle &&
    component.bundle.stylesheet &&
    component.bundle.stylesheet.href) {
    //var oldBundleLink = currentDoc.querySelector(`link[${app.componentAttribute}="${component.name}"]`);
    var linkEl = await getBundleFromComponent(component,
      "stylesheet",
      "href",
      "link");

    //oldBundleLink && app.core.htmlMatch.removeChild(oldBundleLink);
    var oldBundleLinkDep = dependenciesFlat[index - 1];
    var oldBundleLink;
    if (oldBundleLinkDep) {
      oldBundleLink = currentDoc.querySelector(`link[${app.componentAttribute}="${oldBundleLinkDep.name}"]`);
      oldBundleLink && app.core.htmlMatch.after(oldBundleLink, linkEl);
    }
    if (!oldBundleLink) {
      for (var obli = index + 1; obli < dependenciesFlat.length; obli++) {
        oldBundleLink = currentDoc.querySelector(`link[${app.componentAttribute}="${dependenciesFlat[obli].name}"]`);
        if (oldBundleLink)
          break;
      }
      if (oldBundleLink)
        app.core.htmlMatch.before(oldBundleLink, linkEl);
      else
        app.core.htmlMatch.append(currentDoc.head, linkEl);
    }
    if (setCurrentStylesheet) {
      await app.core.setCurrentStyleSheet(linkEl);
    }
  }
  /*
*/
  if (newHTMLElement)
    return newHTMLElement;
}