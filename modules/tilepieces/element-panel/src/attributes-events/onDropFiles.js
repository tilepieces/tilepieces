function onDropFiles(e) {
  e.preventDefault();
  var dropzone = e.detail.target;
  var file = e.detail.files[0];
  if (!file)
    return;
  var tagName = modelAttributes.nodeName;
  var tagParentName = app.elementSelected.parentNode.tagName;
  var isSOURCE = tagName == "SOURCE";
  var isIMG = (tagName == "IMG" || (isSOURCE && tagParentName == "IMG")) &&
    file.type.startsWith("image/");
  var isVIDEO = (tagName == "VIDEO" || (isSOURCE && tagParentName == "VIDEO")) &&
    file.type.startsWith("video/");
  var isAUDIO = (tagName == "AUDIO" || (isSOURCE && tagParentName == "AUDIO")) &&
    file.type.startsWith("audio/");
  var allowed = isIMG || isVIDEO || isAUDIO;
  if (allowed) {
    app.utils.processFile(file).then(res => {
      var sel = app.elementSelected;
      app.core.htmlMatch.setAttribute(sel, "src", res);
      if (isVIDEO || isAUDIO)
        isSOURCE ? sel.parentNode.load() : sel.load()
    })
  }
}