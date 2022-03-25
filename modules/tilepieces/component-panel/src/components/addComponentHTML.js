// return the first dom element inserted.
async function addComponentHTML(component) {
  var elementSelected = app.elementSelected.nodeType != 1 ? app.elementSelected.parentNode : app.elementSelected;
  if (!component.html || (!elementSelected && !component.fixedHTML))
    return;
  var currentDoc = app.core.currentDocument;
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
  // search in the document with [data-tilepieces-component]
  try {
    var toRemove = currentDoc.querySelectorAll(component.selector || `[${app.componentAttribute}="${component.name}"]`);
  } catch (e) {
    console.error(e);
    opener.alertDialog("cannot insert " + component.name + ".<br>" + e.toString(),true);
    return;
  }
  var fixedPlaceholder;
  var indexHTML = 0;
  // remove all previous element labeled as this component
  toRemove.forEach((v, i) => {
    if (v.tagName != "LINK" && v.tagName != "STYLE" &&
      (v.tagName != "SCRIPT" || app.utils.javascriptMimeTypes.indexOf(v.type) == -1) &&
      component.fixedHTML) {
      if (indexHTML == 0) {
        fixedPlaceholder = app.core.currentDocument.createComment(component.name + " placeholder")
        app.core.htmlMatch.replaceWith(v, fixedPlaceholder)
      } else
        app.core.htmlMatch.removeChild(v)
      indexHTML++;
    }
  });
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
  var newHTMLElement = fragment.children[0];
  if (component.fixedHTML) {
    if (fixedPlaceholder) {
      // TODO replaceWith doesn't work with documentFragment
      app.core.htmlMatch.insertAdjacentElement(fixedPlaceholder, "after", fragment);
      app.core.htmlMatch.removeChild(fixedPlaceholder);
    } else {
      var scriptToAppendBefore, scriptMatch;
      var scriptsToAppendBefore = app.core.htmlMatch.source.querySelectorAll("body > script");
      scriptToAppendBefore = scriptsToAppendBefore ? [...scriptsToAppendBefore].find(s => app.utils.javascriptMimeTypes.indexOf(s.type) > -1) : null;
      if (scriptToAppendBefore)
        scriptMatch = app.core.htmlMatch.match(scriptToAppendBefore, false, false, true);
      app.core.htmlMatch.insertAdjacentElement(scriptMatch || app.core.currentDocument.body, scriptMatch ? "before" : "append", fragment);
    }
  } else {
    var iel = 0;
    //var el = app.cssSelectorObj.composedPath[iel];
    var el = elementSelected;
    /*
    while ((el.tagName.match(app.utils.notEditableTags) || el.tagName.match(app.utils.notInsertableTags)) &&
    (insertionMode == "append" || insertionMode == "before")) {
      iel++;
      el = app.cssSelectorObj.composedPath[iel];
    }*/
    var insertionMode = app.insertionMode;
    if((el.tagName.match(app.utils.notEditableTags) || el.tagName.match(app.utils.notInsertableTags)) &&
      (insertionMode == "append" || insertionMode == "prepend")){
      opener.alertDialog("cannot insert " + component.name + " in this position")
    }
    var elWhereInsert = el.nodeName == "HTML" ? el.ownerDocument.body : el;
    if (elWhereInsert.tagName == "BODY" && insertionMode == "before")
      insertionMode = "prepend";
    else if (elWhereInsert.tagName == "BODY" && insertionMode == "after")
      insertionMode = "append";
    app.core.htmlMatch.insertAdjacentElement(elWhereInsert, insertionMode, fragment);
  }
  return newHTMLElement;
}