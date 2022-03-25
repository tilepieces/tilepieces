TilepiecesCore.prototype.appendKeyframe = function (rule, cssText) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  rule.appendRule(cssText);
  var newRule = rule.cssRules[rule.cssRules.length - 1];
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    $self,
    newRule,
    method: "appendKeyframe",
    __historyFileRecord : {oldRecord, newRecord}
  });
  return newRule;
};
historyMethods.appendKeyframe = {
  undo: ho => {
    var notTheRule = [];
    var foundRule = ho.rule.findRule(ho.newRule.keyText);
    var count = 0;
    while (foundRule.cssText != ho.newRule.cssText) {
      notTheRule.push(foundRule);
      ho.rule.deleteRule(ho.newRule.keyText);
      foundRule = ho.rule.findRule(ho.newRule.keyText);
      count++;
      if (count > 500000)
        throw "appendKeyframe error"
    }
    ho.rule.deleteRule(ho.newRule.keyText);
    notTheRule.forEach(v => ho.rule.appendRule(v.cssText));
  },
  redo: ho => {
    ho.rule.appendRule(ho.newRule.cssText);
    var newRule = ho.rule.cssRules[ho.rule.cssRules.length - 1]
    ho.$self.history.entries.forEach(v => {
      if (v == ho) {
        return;
      }
      if (v.rule == ho.newRule)
        v.rule = newRule;
      if (v.newRule == ho.newRule)
        v.newRule = newRule;
      if (v.keyframe == ho.newRule)
        v.keyframe = newRule;
    });
    ho.newRule = newRule;
  }
}