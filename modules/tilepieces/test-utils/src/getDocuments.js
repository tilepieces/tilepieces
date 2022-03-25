function getDocuments() {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var htmltext = tilepieces.core.createDocumentText(doc);
  var htmlMatchText = tilepieces.core.createDocumentText(docSource);
  return {htmltext, htmlMatchText}
}