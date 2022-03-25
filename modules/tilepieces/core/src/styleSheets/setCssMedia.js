TilepiecesCore.prototype.setCssMedia = function (cssText) {
  var $self = this;
  var currentStylesheet = $self.currentStyleSheet;
  if (currentStylesheet) {
    $self.insertCssRule(currentStylesheet, cssText, currentStylesheet.cssRules.length);
  } else {
    //var newStyles = $self.currentDocument.createElement("style");
    //newStyles.innerHTML = cssText;
    //$self.htmlMatch.appendChild($self.currentDocument.head, newStyles);
    //$self.currentStyleSheet = newStyles.sheet;
    $self.createCurrentStyleSheet("");
    $self.insertCssRule($self.currentStyleSheet, cssText);
  }
}