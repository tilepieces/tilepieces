TilepiecesCore.prototype.setRuleName = function (rule, name) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var exName = rule.name;
  rule.name = name;
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    exName,
    name,
    method: "setRuleName",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setRuleName = {
  undo: ho => {
    ho.rule.name = ho.exName;
  },
  redo: ho => {
    ho.rule.name = ho.name;
  }
}