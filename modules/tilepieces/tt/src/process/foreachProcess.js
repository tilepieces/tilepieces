TT.prototype.foreachProcess = function (m, stringMatched, parentModel, index) {
  var $self = this;
  var variable = m.iterableName;
  var modelVariable = splitStringInModel(variable);
  var ok = !stringMatched || splitStringInModel(stringMatched).slice(0, modelVariable.length);
  if (variable == stringMatched || ok) {
    var value = getParamFromString(convertVarToModel(variable, m.newScope), $self.scope) || [];
    if (!Array.isArray(value)) {
      try {
        value = Object.values(value);
      } catch (e) {
        console.error("[TT foreach process error]. Passed a non-array to foreach", convertVarToModel(variable, m.newScope), value);
        throw new Error("[TT foreach process error]. Passed a non-array to foreach");
      }
    }
    var firstPart = "" + m.iterableName;
    firstPart = convertVarToModel(firstPart, m.newScope);
    var valueLength = value.length;
    var iterableLength = m.iterable.length;
    var muchLonger = iterableLength > valueLength ? m.iterable : value;
    var newModel = m.model.slice(0);
    // m.iterable is the old value
    // value is the new value
    // m.model are the objects associated with the list.
    for (var count = 0; count < muchLonger.length; count++) {
      if (m.model[count] && typeof value[count] == "undefined") {
        var modelIndex = m.model[count];
        modelIndex.node.parentNode.removeChild(modelIndex.node);
        newModel.splice(newModel.findIndex(nm => modelIndex.node == nm.node), 1);
      } else if (m.model[count]) {
        var n = newModel.find(nm => m.model[count] && m.model[count].node == nm.node);
        n.value = value[count];
        $self.process(m.model[count], stringMatched, m.model, count)
      } else if (!m.model[count]) {
        var newEl = m.node.cloneNode(true);
        newEl.removeAttribute("data-" + $self.foreachAttr);
        newEl.removeAttribute("data-" + $self.foreachKeyNameAttr);
        var sc = Object.assign({}, $self.scope);
        sc[m.variable] = muchLonger[count];
        var n = m.newScope.slice(0);
        var aName = firstPart + `[${count}]`;
        n.push({variable: m.variable, iterable: aName, originalValue: value[count]});
        var foreachObj = {type: "foreach-item", node: newEl, model: [], value: value[count]};
        $self.declare(newEl, sc, foreachObj.model, n);
        var nu = newModel[newModel.length - 1] && newModel[newModel.length - 1].node;
        if (nu)
          nu.parentNode.insertBefore(newEl, nu.nextSibling);
        else
          m.placeholder.parentNode.insertBefore(newEl, m.placeholder.nextSibling);
        newModel.push(foreachObj);
      } else {
        $self.process(m.model[count], stringMatched, m.model, count)
      }
    }
    m.iterable = copyObjectIterable(value);
    m.model = newModel;
  } else {
    m.model.forEach((mi, i, a) => $self.process(mi, stringMatched, m.model, i));
  }
}
