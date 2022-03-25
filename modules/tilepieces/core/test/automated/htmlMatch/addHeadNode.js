function addHeadNode(node) {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var matchOriginal = compareDocuments();
  tilepieces.core.htmlMatch.addHeadNode(node);
  logOnDocument("compare after addHeadNode");
  var match = compareDocuments();
  tilepieces.core.undo();
  logOnDocument("compare after undo");
  compareDocuments(matchOriginal);
  tilepieces.core.redo();
  logOnDocument("compare after redo");
  compareDocuments(match);
  return [matchOriginal, match];
}