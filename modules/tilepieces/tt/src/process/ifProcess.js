TT.prototype.ifProcess = function (m, stringMatched, parentModel, index) {
  var $self = this;
  var sc = Object.assign({}, $self.scope);
  m.newScope.forEach(n => {
    sc[n.variable] = getParamFromString(
      convertVarToModel(n.iterable || n.original, m.newScope), sc);
    n.originalValue = sc[n.variable];
  });
  var result = ifResolver(m.condition, sc);
  if (!!result != !!m.result) {
    if (result) {
      m.model = [];
      var newIf = m.node.cloneNode(true);
      newIf.removeAttribute("data-" + $self.ifAttr);
      $self.declare(newIf, sc, m.model, m.newScope);
      if (m.placeholder && m.placeholder.parentNode) {
        m.placeholder.parentNode.replaceChild(newIf, m.placeholder);
        if ($self.el == m.placeholder)
          $self.el = newIf;
      } else {
        m.clone.parentNode.replaceChild(newIf, m.clone);
        if ($self.el == m.clone)
          $self.el = newIf;
      }
      m.clone = newIf;
    } else {
      if (!m.placeholder) {
        m.placeholder = m.node.ownerDocument.createComment("if( " + m.condition + " ) placeholder");
      }
      m.clone.parentNode.replaceChild(m.placeholder, m.clone);
      if ($self.el == m.clone)
        $self.el = m.placeholder;
      m.clone = null;
      m.model = [];
    }
    m.result = result;
  } else if (result) {
    m.model.forEach((mi, i, a) => $self.process(mi, stringMatched, m.model, i));
  }
}
