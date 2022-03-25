TilepiecesCore.prototype.saveStyleSheet = function (dontSave) {
  var $self = this;
  var isStyleTag = !$self.matchCurrentStyleSheetNode ||
    $self.matchCurrentStyleSheetNode.tagName == "STYLE";
  var text = isStyleTag ?
    $self.createDocumentText($self.htmlMatch.source, true) :
    createStyleSheetText($self.currentStyleSheet);
  // TODO : ???? maybe a config BASEPATH
  var path = isStyleTag ?
    tilepieces.currentPage.path :
    decodeURI($self.currentStyleSheet.href)
      .replace(location.origin, "")
      .replace(tilepieces.frameResourcePath(), "")
      .replace(/\/\//g, "/");
  !dontSave && tilepieces.updateFile(path, text);
  return {path, text}
};