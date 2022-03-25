function getDocumentPath(doc) {
  var currentDoc = doc || tilepieces.core.currentDocument;
  var frameResourcePath = encodeURI(tilepieces.utils.paddingURL(tilepieces.frameResourcePath()));
  return currentDoc.location.pathname.replace(frameResourcePath, "");
}