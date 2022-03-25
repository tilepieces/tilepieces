TT.prototype.process = function (m, stringMatched, parentModel, index) {
  var $self = this;
  if (m.type == "foreach-item")
    m.model.forEach((mi, i) => $self.process(mi, stringMatched, m.model, i));
  else if (m.type == "if") {
    $self.ifProcess(m, stringMatched, parentModel, index)
  } else if (m.type == "foreach") {
    if (!m.iterable) {
      var newIterable = getParamFromString(convertVarToModel(m.iterableName, m.newScope), $self.scope);
      if (newIterable)
        m.iterable = newIterable;
      else return;
    }
    $self.foreachProcess(m, stringMatched, parentModel, index)
  } else if (m.type == "binding") {
    $self.bindingProcess(m, stringMatched, parentModel, index)
  } else {
    var variables = m.variables.slice(0);
    for (var iV = 0; iV < variables.length; iV++) {
      variables.length > 1 && console.warn("[TT process " + variables.length + " variables]");
      var v = variables[iV];
      try {
        var match = getParamFromString(
          convertVarToModel(v.variable, m.newScope), $self.scope);
      } catch (e) {
        console.error(e);
        console.error(m);
        var findToChange = $self.toChange.find(v => v.parentModel == parentModel && v.index == index);
        !findToChange && $self.toChange.push({parentModel, index});
        return;
      }
      if (match != v.value) {
        var findToChange = $self.toChange.find(v => v.parentModel == parentModel && v.index == index);
        !findToChange && $self.toChange.push({parentModel, index});
        if (m.type && m.type == "name-attr") {
          try {
            var val = m.node.getAttribute(v.value);
            var newValue = $self.replaceNodeValue(m.value,
              {nodeName: v.value, nodeValue: val}, $self.scope, m.newScope.slice(0),
              parentModel, {type: "name", owner: m.node});
            //newValue && m.node.setAttribute(newValue,val);
            m.node.removeAttribute(v.value);
            if (newValue &&
              (m.node.tagName == "INPUT" || m.node.tagName == "SELECT") &&
              newValue == "value") {
              m.node.value = val || "";
              console.log(newValue, "name-attr", val);
            }
          } catch (e) {
            console.error("error in assigning attr name", e)
          }
        } else if (m.type && m.type == "value-attr") {
          try {
            var newValue = $self.replaceNodeValue(m.value,
              {nodeName: m.nameAttr, nodeValue: m.value}, $self.scope, m.newScope.slice(0),
              parentModel, {type: "value", owner: m.node});
            //m.node.setAttribute(m.nameAttr, newValue);
            if ((m.node.tagName == "INPUT" || m.node.tagName == "SELECT") &&
              m.nameAttr == "value") {
              m.node.value = newValue;
              console.log(newValue, "value-attr");
            }
          } catch (e) {
            console.error("error in assigning attr value", e)
          }
        } else if (m.type && m.type == "bind-attr") {
          m.node[m.nameAttr] = match;
          m.variables[0].value = match;
          parentModel.push(m)
        } else {
          var newValue = $self.replaceNodeValue(m.value,
            m.node, $self.scope, m.newScope.slice(0),
            parentModel);
          m.node.nodeValue = newValue;
        }
        break; // no need to continue. The node had been already changed by replaceNodeValue and continue will cause a leak;
      }
    }
  }
}