TT.prototype.replaceNodeValue = function (value, node, scope, newScope, model, attrType) {
  var $self = this;
  var v = "" + value;
  var test = value.match($self.interpolation);
  var t = test;
  var variables = [];
  while (t) {
    var variable = t[1].trim();
    variable = convertVarToModel(variable, newScope);
    var s = getParamFromString(variable, scope);
    value = value.substring(0, t.index) + s +
      value.substring(t.index + t[0].length, value.length);
    variables.push({variable, value: s});
    t = value.match($self.interpolation);
  }
  if (test && !attrType) {
    model.push({
      node,
      value: v,
      variables,
      newScope
    })
  } else if (test && attrType) {
    if (attrType.type == "name") {
      try {
        attrType.owner.setAttribute(value, node.nodeValue || "");
        attrType.owner.removeAttribute(node.nodeName);
      } catch (e) {
      }
      model.push({
        node: attrType.owner,
        value: v,
        variables,
        newScope,
        type: "name-attr"
      })
    } else {
      try {
        if (node.nodeName == "data-" + $self.srcAttribute &&
          attrType.owner.nodeName.match(/IMG|IFRAME|VIDEO|AUDIO|SOURCE/) &&
          attrType.owner.getAttribute("src") != value) {
          attrType.owner.setAttribute("src", value);
        } else
          attrType.owner.setAttribute(node.nodeName, value);
      } catch (e) {
      }
      model.push({
        node: attrType.owner,
        value: v,
        variables,
        newScope,
        nameAttr: node.nodeName,
        type: "value-attr"
      })
    }
  }
  return value;
}