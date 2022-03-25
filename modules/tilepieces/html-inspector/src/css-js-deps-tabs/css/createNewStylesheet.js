async function createNewStylesheet(e) {
  e.preventDefault();
  var newTagName = e.target["add-stylesheet-tag"].value;
  var newTag = app.core.currentDocument.createElement(newTagName);
  var isCurrent = e.target["add-stylesheet-current"].checked;
  if (newTagName == "link") {
    newTag.rel = "stylesheet";
    var href = e.target["add-stylesheet-href"].value.trim();
    opener.dialog.open("loading stylesheet...", true);
    app.core.fetchingStylesheet(href).then(async () => {
      newTag.href = href;
      await closeDialogNewStylesheet(newTag, isCurrent);
    }, err => {
      if (err.status && err.status == 404 &&
        !href.match(app.utils.URLIsAbsolute) &&
        href.endsWith('.css') &&
        app.storageInterface) {
        newTag.href = href;
        app.storageInterface.update(new URL(href, app.core.currentWindow.location.href).pathname
          .replace(encodeURI(app.utils.paddingURL(app.frameResourcePath())),""), new Blob([""]))
          .then(async () => {
            await closeDialogNewStylesheet(newTag, isCurrent)
          }, err => {
            opener.dialog.close();
            console.error("[error in creating path" + newTag.href + "]", err);
            opener.dialog.open("creating stylesheet error");
          })
      } else {
        console.log("[fetch stylesheet " + newTag.href + " error]", err);
        opener.dialog.close();
        opener.dialog.open("loading stylesheet error");
      }
    })
  } else await closeDialogNewStylesheet(newTag, isCurrent);
}

async function closeDialogNewStylesheet(newTag, isCurrent) {
  var insertionMode = app.insertionMode == "prepend" ?
    "before" :
    app.insertionMode == "append" ?
      "after" :
      app.insertionMode;
  if (selectedJsCSS)
    app.core.htmlMatch[insertionMode](selectedJsCSS["__html-tree-builder-el"],
      newTag);
  else
    app.core.htmlMatch.append(app.core.currentDocument.head, newTag);
  selectedJsCSS = {"__html-tree-builder-el": newTag};
  if (isCurrent)
    await app.core.setCurrentStyleSheet(newTag);
  opener.dialog.close();
  dialog.close();
}