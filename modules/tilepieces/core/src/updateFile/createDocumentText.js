tilepieces.createDocumentText = function (doc, isStyleSheetModification) {
  var $self = this;
  if (isStyleSheetModification && ($self.currentStyleSheet && !$self.currentStyleSheet.href)) {
    var updateStyleSheetHTML = createStyleSheetText($self.currentStyleSheet);
    $self.matchCurrentStyleSheetNode.innerHTML = updateStyleSheetHTML;
  }
  return createDocumentString(doc)
}
TilepiecesCore.prototype.createDocumentText = tilepieces.createDocumentText;
