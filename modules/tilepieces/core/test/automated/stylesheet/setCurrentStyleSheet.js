async function setCurrentStyleSheetTest(currentStyleSheet) {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var match = compareDocuments();
  await tilepieces.core.setCurrentStyleSheet(currentStyleSheet);
  logOnDocument("compare after setCurrentStyleSheet");
  var match1 = compareDocuments();
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
  tilepieces.core.redo();
  logOnDocument("compare after redo");
  compareDocuments(match1);
  logOnDocument(
    assert(tilepieces.core.currentStyleSheet == currentStyleSheet.sheet &&
      tilepieces.core.matchCurrentStyleSheetNode == currentStyleSheetMatch.match,
      "currentStyleSheet is setted correctly ( comparing sheets )"), "success");
  return [match, match1];
}