TilepiecesCore.prototype.setSelectorText = function (rule, selectorText) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var exSelectorText = rule.selectorText;
  rule.selectorText = selectorText;
  var newRecord = $self.saveStyleSheet(true);
  detectNewClass(selectorText);
  $self.setHistory({
    rule,
    exSelectorText,
    selectorText,
    method: "setSelectorText",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setSelectorText = {
  undo: ho => {
    ho.rule.selectorText = ho.exSelectorText;
  },
  redo: ho => {
    ho.rule.selectorText = ho.selectorText;
  }
}