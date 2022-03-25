TilepiecesCore.prototype.insertCssRule = function (stylesheet, cssText, index) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  if (!index)
    index = stylesheet.cssRules.length;
  stylesheet.insertRule(cssText, index);
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    stylesheet,
    cssText,
    $self,
    index,
    oldRule: stylesheet.cssRules[index],
    method: "insertCssRule",
    __historyFileRecord : {oldRecord, newRecord}
  });
  return stylesheet.cssRules[index];
};
historyMethods.insertCssRule = {
  undo: ho => {
    var rule = ho.oldRule;
    ho.stylesheet.deleteRule(ho.index);
    if (rule.constructor.name == "CSSMediaRule" ||
      rule.constructor.name == "CSSSupportsRule") {
      if (rule == tilepieces.core.currentMediaRule)
        tilepieces.core.currentMediaRule = null;
      ho.$self.runcssMapper()
    }
    if (rule.constructor.name == "CSSKeyframesRule") {
      ho.exIndex = ho.$self.styles.animations.findIndex(v => v.rule == ho.oldRule);
      ho.$self.styles.animations.splice(ho.exIndex, 1);
    }
    if (rule.constructor.name == "CSSFontFaceRule") {
      ho.exIndex = ho.$self.styles.fonts.findIndex(v => v.fontFaceRule == ho.oldRule);
      ho.$self.styles.fonts.splice(ho.exIndex, 1);
    }
  },
  redo: ho => {
    if (ho.stylesheet.ownerNode === null) {
      ho.stylesheet = [...ho.$self.currentDocument.styleSheets].find(s => s.href == ho.stylesheet.href);
    }
    ho.stylesheet.insertRule(ho.cssText, ho.index);
    var newRule = ho.stylesheet.cssRules[ho.index];
    if (newRule.constructor.name == "CSSMediaRule" ||
      newRule.constructor.name == "CSSSupportsRule") {
      ho.$self.runcssMapper()
    }
    if (newRule.constructor.name == "CSSKeyframesRule")
      ho.$self.styles.animations.splice(ho.exIndex, 0, newRule);
    if (newRule.constructor.name == "CSSFontFaceRule")
      ho.$self.styles.fonts.splice(ho.exIndex, 0, newRule);
    ho.$self.history.entries.forEach(v => {
      if (v == ho) {
        return;
      }
      if (v.oldRule == ho.oldRule)
        v.oldRule = newRule;
      if (v.rule == ho.oldRule)
        v.rule = newRule;
      if(v.fontFaceRule == ho.oldRule)
        v.fontFaceRule = newRule;
      if (v.stylesheet == ho.oldRule)
        v.stylesheet = newRule;
    });
    ho.oldRule = newRule;
  }
}