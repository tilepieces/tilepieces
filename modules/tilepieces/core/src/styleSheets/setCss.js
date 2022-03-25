TilepiecesCore.prototype.setCss = function (el, name, value, selectorText) {
  var $self = this;
  var currentStylesheet = $self.currentStyleSheet;
  var insertType = tilepieces.insertStyleSheets;
  selectorText = selectorText || tilepieces.cssSelector;
  if (insertType == "stylesheet") {
    /*
    if (el.style.item(name) && $self.htmlMatch.match(el))
      $self.htmlMatch.style(el, name, "");*/
    if (currentStylesheet) {
      // if currentMediaRule exists anymore
      if (tilepieces.core.currentMediaRule &&
        (!tilepieces.core.currentMediaRule.parentStyleSheet ||
          !tilepieces.core.currentMediaRule.parentStyleSheet.ownerNode ||
          !tilepieces.core.currentDocument.documentElement.contains(tilepieces.core.currentMediaRule.parentStyleSheet.ownerNode)
        ))
        tilepieces.core.currentMediaRule = null;
      if (tilepieces.core.currentMediaRule &&
        $self.currentWindow.matchMedia(tilepieces.core.currentMediaRule.conditionText).matches)
        currentStylesheet = tilepieces.core.currentMediaRule;
      var currentRules = [...currentStylesheet.cssRules];
      var decFound = currentRules.find(cssRule => cssRule.selectorText == selectorText);
      if (decFound) {
        $self.setCssProperty(decFound, name, value);
        return decFound.style.getPropertyValue(name);
      } else {
        var index = currentStylesheet.cssRules.length;
        $self.insertCssRule(currentStylesheet, selectorText + `{${name}:${value}}`, index);
        return currentStylesheet.cssRules[index].style.getPropertyValue(name);
      }
    } else {
      $self.createCurrentStyleSheet("");
      $self.insertCssRule($self.currentStyleSheet, selectorText + `{${name}:${value}}`);
      return $self.currentStyleSheet.cssRules[0].style.getPropertyValue(name);
    }
  } else {
    $self.htmlMatch.style(el, name, value, insertType == "inline!important" ? "important" : "");
    return el.style.getPropertyValue(name);
  }
};