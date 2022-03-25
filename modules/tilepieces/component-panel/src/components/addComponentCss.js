// return the first dom element inserted.
async function addComponentCss(component, index, dependenciesFlat) {
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
    if (v.tagName == "LINK" || v.tagName == "STYLE") {
      if (app.core.currentStyleSheet?.ownerNode == v)
        setCurrentStylesheet = true;
      app.core.htmlMatch.removeChild(v)
    }
  });
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