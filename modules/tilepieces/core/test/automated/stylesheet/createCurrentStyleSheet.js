async function createCurrentStyleSheetTest() {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var match = compareDocuments();
  tilepieces.core.createCurrentStyleSheet("a{color:red;text-decoration: none;}a:hover{color:black;}");
  logOnDocument("compare after createCurrentStyleSheet");
  var match1 = compareDocuments();
  var currentStyleSheet = doc.head.querySelector("style");
  var currentStyleSheetMatch = tilepieces.core.htmlMatch.find(currentStyleSheet);
  logOnDocument(
    assert(tilepieces.core.currentStyleSheet.ownerNode == currentStyleSheet &&
      tilepieces.core.matchCurrentStyleSheetNode == currentStyleSheetMatch.match,
      "currentStyleSheet is setted correctly ( comparing nodes )"), "success");
  tilepieces.core.undo();
  logOnDocument("compare after undo");
  compareDocuments(match);
  logOnDocument(
    assert(tilepieces.core.currentStyleSheet == null &&
      tilepieces.core.matchCurrentStyleSheetNode == null,
      "currentStyleSheet is null, correctly"), "success");
  await tilepieces.core.redo();
  logOnDocument("compare after redo");
  compareDocuments(match1);
  logOnDocument(
    assert(tilepieces.core.currentStyleSheet == currentStyleSheet.sheet &&
      tilepieces.core.matchCurrentStyleSheetNode == currentStyleSheetMatch.match,
      "currentStyleSheet is setted correctly ( comparing sheets )"), "success");
}