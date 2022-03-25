function createNewScript(e) {
  e.preventDefault();
  var newTag = app.core.currentDocument.createElement("script");
  if (e.target["add-script-src-enable"].checked) {
    var src = e.target["add-script-src"].value.trim();
    opener.dialog.open("loading script...", true);
    newTag.src = src;
    var urlToFetch;
    if(!src.match(app.utils.URLIsAbsolute)) {
      var srcParsed = src[0] == "/" ? encodeURI(app.utils.paddingURL(app.frameResourcePath())) + src.substring(1) : src;
      urlToFetch = new URL(srcParsed, app.core.currentWindow.location.href);
    }
    else urlToFetch = src;
    fetch(urlToFetch).then(res => {
      if (res.status == 200) {
        closeDialogNewScript(newTag);
      } else if (res.status &&
        res.status == 404 &&
        !src.match(app.utils.URLIsAbsolute) &&
        src.endsWith('.js') &&
        app.storageInterface) {
        app.storageInterface.update(urlToFetch.pathname
          .replace(encodeURI(app.utils.paddingURL(app.frameResourcePath())),""), new Blob([""]))
          .then(() => {
            opener.dialog.close();
            closeDialogNewScript(newTag)
          }, err => {
            opener.dialog.close();
            console.error("[error in creating path" + src + "]", err);
            opener.dialog.open("creating script error");
          })
      } else {
        console.log("[fetch script " + newTag.src + " error]", res);
        opener.dialog.close();
        opener.dialog.open("fetch script error, maybe app.storageInterface not setted");
      }
    }, err => {
      console.log("[fetch script " + newTag.src + " error]", err);
      opener.dialog.close();
      opener.dialog.open("fetch script error");
    })
  } else closeDialogNewScript(newTag);
}

function closeDialogNewScript(newTag) {
  var insertionMode = app.insertionMode == "prepend" ?
    "before" :
    app.insertionMode == "append" ?
      "after" :
      app.insertionMode;
  if (selectedJsCSS)
    app.core.htmlMatch[insertionMode](selectedJsCSS["__html-tree-builder-el"],
      newTag);
  else
    app.core.htmlMatch.append(app.core.currentDocument.body, newTag);
  selectedJsCSS = {"__html-tree-builder-el": newTag};
  dialog.close();
  opener.dialog.close();
}