TilepiecesCore.prototype.deleteKeyframe = function (rule, keyframe) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var notTheRule = [];
  var foundRule = rule.findRule(keyframe.keyText);
  var count = 0;
  while (foundRule.cssText != keyframe.cssText) {
    notTheRule.push(foundRule);
    rule.deleteRule(keyframe.keyText);
    foundRule = rule.findRule(keyframe.keyText);
    count++;
    if (count > 500000)
      throw "error on find keyframe rule"
  }
  rule.deleteRule(keyframe.keyText);
  notTheRule.forEach(v => rule.appendRule(v.cssText));
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    $self,
    keyframe,
    method: "deleteKeyframe",
    __historyFileRecord : {oldRecord, newRecord}
  });
}
historyMethods.deleteKeyframe = {
  undo: ho => {
    ho.rule.appendRule(ho.keyframe.cssText);
    var newRule = ho.rule.cssRules[ho.rule.cssRules.length - 1]
    ho.$self.history.entries.forEach(v => {
      if (v == ho) {
        return;
      }
      if (v.rule == ho.keyframe)
        v.rule = newRule;
      if (v.newRule == ho.keyframe)
        v.newRule = newRule;
      if (v.keyframe == ho.keyframe)
        v.keyframe = newRule;
    });
    ho.keyframe = newRule;
  },
  redo: ho => {
    var notTheRule = [];
    var foundRule = ho.rule.findRule(ho.keyframe.keyText);
    var count = 0;
    while (foundRule.cssText != ho.keyframe.cssText) {
      notTheRule.push(foundRule);
      ho.rule.deleteRule(ho.keyframe.keyText);
      foundRule = ho.rule.findRule(ho.keyframe.keyText);
      count++;
      if (count > 500000)
        throw "error on find keyframe rule"
    }
    ho.rule.deleteRule(ho.keyframe.keyText);
    notTheRule.forEach(v => ho.rule.appendRule(v.cssText));
  }
}