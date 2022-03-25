TT.prototype.bindingProcess = function (m, stringMatched, parentModel, index) {
  var $self = this;
  try {
    var res = getParamFromString(
      convertVarToModel(m.variable, m.newScope), $self.scope);
  } catch (e) {
    var findToChange = $self.toChange.find(v => v.parentModel == parentModel && v.index == index);
    findToChange && $self.toChange.push({parentModel, index});
    return;
  }
  if (res != m.value && m.node.tagName.match(/INPUT|SELECT|TEXTAREA/)) {
    if (m.node.type == "checkbox")
      m.node.checked = res;
    else if (m.node.type == "radio") {
      var radioEl = $self.el.querySelector(`[name="${m.node.name}"][value="${res}"]`);
      if (radioEl)
        radioEl.checked = true;
    } else
      m.node.value = res;
    m.value = res;
  } else if (m.node.textContent != res && !m.node.tagName.match(/INPUT|SELECT|TEXTAREA/)) {
    m.node.textContent = res;
    m.value = res;
  }
}