TilepiecesCore.prototype.setCssProperty = function (rule, property, value, priority) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var oldSelector = rule.selectorText;
  var oldValue = rule.style.getPropertyValue(property);
  var oldPriority = rule.style.getPropertyPriority(property);
  if (oldValue == value && oldPriority == priority)
    return;
  rule.style.setProperty(property, value, priority);
  var newProp = rule.style.getPropertyValue(property);
  var newPrior = rule.style.getPropertyPriority(property);
  if (newProp == oldValue && newPrior == oldPriority)
    return;
  var stylesheet = rule.parentStyleSheet;
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    oldSelector,
    rule,
    property,
    stylesheet,
    value,
    $self,
    oldValue,
    oldPriority,
    priority,
    method: "setCssProperty",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setCssProperty = {
  undo: ho => {
    ho.rule.style.setProperty(ho.property, ho.oldValue, ho.oldPriority);
  },
  redo: ho => {
    ho.rule.style.setProperty(ho.property, ho.value, ho.priority);
  }
}
