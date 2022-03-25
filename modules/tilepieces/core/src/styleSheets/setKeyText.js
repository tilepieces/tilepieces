TilepiecesCore.prototype.setKeyText = function (rule, keyText) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var exKeyText = rule.keyText;
  rule.keyText = keyText;
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    exKeyText,
    keyText,
    method: "setKeyText",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setKeyText = {
  undo: ho => {
    ho.rule.keyText = ho.exKeyText;
  },
  redo: ho => {
    ho.rule.keyText = ho.keyText;
  }
}