TilepiecesCore.prototype.deleteCssRule = function (oldRule) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var stylesheet = oldRule.parentRule || oldRule.parentStyleSheet;
  //var parent = rule.parentRule || stylesheet;
  var index = [...stylesheet.cssRules].indexOf(oldRule);
  //var oldRule = stylesheet.cssRules[index];
  var oldCssText = oldRule.cssText;
  stylesheet.deleteRule(index);
  var exIndex;
  if (oldRule.constructor.name == "CSSMediaRule" ||
    oldRule.constructor.name == "CSSSupportsRule") {
    $self.runcssMapper()
  }
  if (oldRule.constructor.name == "CSSKeyframesRule") {
    exIndex = $self.styles.animations.findIndex(v => v.rule == oldRule);
    $self.styles.animations.splice(exIndex, 1);
  }
  if (oldRule.constructor.name == "CSSFontFaceRule") {
    exIndex = $self.styles.fonts.findIndex(v => v.fontFaceRule == oldRule);
    $self.styles.fonts.splice(exIndex, 1);
  }
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    stylesheet,
    oldRule,
    oldCssText,
    $self,
    index,
    exIndex,
    method: "deleteCssRule",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.deleteCssRule = {
  undo: ho => {
    ho.stylesheet.insertRule(ho.oldCssText, ho.index);
    var rule = ho.stylesheet.cssRules[ho.index];
    if (rule.constructor.name == "CSSMediaRule" ||
      rule.constructor.name == "CSSSupportsRule") {
      ho.$self.runcssMapper()
    }
    if (rule.constructor.name == "CSSKeyframesRule")
      ho.$self.styles.animations.splice(ho.exIndex, 0, rule);
    if (rule.constructor.name == "CSSFontFaceRule")
      ho.$self.styles.fonts.splice(ho.exIndex, 0, rule);
    ho.$self.history.entries.forEach(v => {
      if (v.rule == ho.oldRule)
        v.rule = rule;
      if (v.oldRule == ho.oldRule)
        v.oldRule = rule;
      if (v.stylesheet == ho.oldRule)
        v.stylesheet = rule;
    });
    ho.oldRule = rule
  },
  redo: ho => {
    ho.stylesheet.deleteRule(ho.index);
    if (ho.oldRule.constructor.name == "CSSMediaRule" ||
      ho.oldRule.constructor.name == "CSSSupportsRule") {
      if (ho.oldRule == tilepieces.core.currentMediaRule)
        tilepieces.core.currentMediaRule = null;
      ho.$self.runcssMapper()
    }
    if (ho.oldRule.constructor.name == "CSSKeyframesRule") {
      ho.exIndex = ho.$self.styles.animations.findIndex(v => v.rule == ho.oldRule);
      ho.$self.styles.animations.splice(ho.exIndex, 1);
    }
    if (ho.oldRule.constructor.name == "CSSFontFaceRule") {
      ho.exIndex = ho.$self.styles.fonts.findIndex(v => v.fontFaceRule == ho.oldRule);
      ho.$self.styles.fonts.splice(ho.exIndex, 1);
    }
  }
}