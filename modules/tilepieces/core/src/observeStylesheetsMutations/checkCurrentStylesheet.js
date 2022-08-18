TilepiecesCore.prototype.checkCurrentStyleSheet = function () {
  var $self = this;
  var currentStyleSheet = $self.currentStyleSheet;
  var currentStyleSheetSelector = "[" + tilepieces.currentStyleSheetAttribute + "]";
  if (currentStyleSheet && !$self.currentDocument.documentElement.contains(currentStyleSheet.ownerNode)) {
    if($self.currentMediaRule) $self.currentMediaRule = null;
    var match = $self.htmlMatch.match($self.matchCurrentStyleSheetNode, false, false, true);
    if (match) {
      $self.currentStyleSheet = match.sheet
    } else {
      var possiblesCurrentStyleSheets = [...$self.currentDocument.querySelectorAll(currentStyleSheetSelector)];
      if (possiblesCurrentStyleSheets.length) {
        var last = possiblesCurrentStyleSheets.pop();
        $self.matchCurrentStyleSheetNode = $self.htmlMatch.match(last);
        if ($self.matchCurrentStyleSheetNode) {
          longPollingStyleSheet(last, () => $self.currentStyleSheet = last.sheet)
        } else {
          $self.currentStyleSheet = null;
          $self.matchCurrentStyleSheetNode = null
        }
      } else {
        $self.currentStyleSheet = null;
        $self.matchCurrentStyleSheetNode = null
      }
    }
  }
}