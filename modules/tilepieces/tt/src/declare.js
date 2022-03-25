TT.prototype.declare = function (el, scope, model, newScope = []) {
  var $self = this;
  if (el.nodeType == 1) {
    if (el.dataset[$self.ifAttr]) {
      var condition = el.dataset[$self.ifAttr];
      var sc = Object.assign({}, $self.scope);
      newScope.forEach(n => {
        sc[n.variable] = getParamFromString(
          convertVarToModel(n.iterable || n.original, newScope), sc);
        n.originalValue = sc[n.variable];
      });
      var result = ifResolver(condition, sc);
      var m = {
        node: el,
        clone: el.cloneNode(true),
        parentNode: el.parentNode,
        condition,
        type: "if",
        model: [],
        newScope,
        result
      };
      if (!result) {
        m.placeholder = el.ownerDocument.createComment("if( " + condition + " ) placeholder");
        el.parentNode.replaceChild(m.placeholder, el);
        if (el == $self.el)
          $self.el = m.placeholder;
        model.push(m);
        return;
      } else {
        el.parentNode.replaceChild(m.clone, el);
        if (el == $self.el)
          $self.el = m.clone
      }
      model.push(m);
      model = m.model;
      el = m.clone;
    }
    if (el.dataset[$self.foreachAttr]) {
      var iterableName = el.dataset[$self.foreachAttr];
      var iterable = getParamFromString(
        convertVarToModel(iterableName, newScope), scope) || [];
      if (!Array.isArray(iterable)) {
        try {
          iterable = Object.values(iterable);
        } catch (e) {
          console.error("[TT foreach declare error] iterableName ->\"", iterableName + '\"');
          console.error("[TT foreach declare error] iterable ->", iterable);
          throw new Error("[TT foreach declare error] Passed a non-array to foreach");
        }
      }
      var variable = el.dataset[$self.foreachKeyNameAttr] || "key";
      var firstPart = "" + iterableName;
      variable = convertVarToModel(variable, newScope);
      var m = {
        node: el,
        type: "foreach",
        variable,
        iterable: copyObjectIterable(iterable),
        model: [],
        newScope,
        iterableName: firstPart
      };
      model.push(m);
      model = m.model;
      for (var k in iterable) {
        var newEl = el.cloneNode(true);
        newEl.removeAttribute("data-" + $self.foreachAttr);
        newEl.removeAttribute("data-" + $self.foreachKeyNameAttr);
        var n = newScope.slice(0);
        var aName = firstPart + `[${k}]`;
        n.push({variable, iterable: aName, originalValue: iterable[k]});
        var foreachObj = {type: "foreach-item", node: newEl, model: [], value: iterable[k]};
        model.push(foreachObj);
        $self.declare(newEl, scope, foreachObj.model, n);
        el.parentNode.insertBefore(newEl, el);
      }
      m.placeholder = $self.el.ownerDocument.createComment("foreach( " + iterableName + " ) placeholder");
      el.parentNode.replaceChild(m.placeholder, el);
      return;
    }
    [...el.attributes].forEach(attr => {
      $self.replaceNodeValue(attr.name, attr, scope, newScope, model, {type: "name", owner: el});
      $self.replaceNodeValue(attr.nodeValue, attr, scope, newScope, model, {type: "value", owner: el});
    });
    if (el.dataset[$self.bindDOMPropAttr]) {
      var params = el.dataset[$self.bindDOMPropAttr].split(",");
      if ((params.length % 2)) {
        console.error("[tilepieces TEMPLATE ERROR], bindObject not divisible by 2", console.trace())
        return;
      }
      for (var i = 0; i < params.length; i += 2) {
        var variable = convertVarToModel(params[i + 1].trim(), newScope);
        var s = getParamFromString(variable, scope);
        var nameAttr = params[i].trim();
        Object.defineProperty(el, nameAttr, {value: s, configurable: true, writable: true});
        model.push({
          node: el,
          variables: [{variable: convertVarToModel(variable, newScope), value: s}],
          newScope,
          nameAttr,
          type: "bind-attr"
        })
      }
    }
    if (el.dataset[$self.bindAttr]) {
      var variable = el.dataset[$self.bindAttr];
      variable = convertVarToModel(variable, newScope);
      try {
        var res = getParamFromString(variable, $self.scope);
      } catch (e) {
        console.error("[binding error] --> e -->", e);
        console.error("[binding error]--> el -->", el, model, scope, newScope);
        return;
      }
      if (el.tagName == "INPUT" && el.type == "checkbox")
        el.checked = res;
      else if (el.tagName == "INPUT" && el.type == "radio") {
        setTimeout(() => {
          var radioEl = $self.el.querySelector(`[name="${el.name}"][value="${res}"]`);
          if (radioEl)
            radioEl.checked = true;
        })
      } else if ((el.tagName == "INPUT" && el.type != "file") || el.tagName == "SELECT")
        el.value = res;
      else if (el.type != "file") {
        el.textContent = res;
      }
      $self.bindingEl(el, variable, $self.el, $self, newScope);
      model.push({
        node: el,
        value: res,
        variable,
        newScope,
        type: "binding"
      })
    }
    if (el.dataset[$self.setTemplateAttr]) {
      $self.templates.push({
        name: el.dataset[$self.setTemplateAttr],
        el
      });
      el.removeAttribute("data-" + $self.setTemplateAttr);
      el.remove();
      return;
    }
    if (el.dataset[$self.useTemplateAttr]) {
      var templateToUse = el.dataset[$self.useTemplateAttr];
      var template = $self.templates.find(v => v.name == templateToUse);
      el.appendChild(template.el.cloneNode(true));
      var params = el.dataset[$self.useTemplateParamsAttr];
      if (params) {
        params = params.split(",");
        var newNewScope = [];
        for (var i = 0; i < params.length; i += 2) {
          newNewScope.push({
            variable: params[i].trim(),
            original: convertVarToModel(params[i + 1].trim(), newScope)
          });
        }
        newScope = newNewScope;
      }
    }
    if (typeof el.dataset[$self.isolateAttribute] === "string")
      return;
  }
  [...el.childNodes].forEach(child => {
    if (child.nodeType == 1)
      $self.declare(child, scope, model, newScope);
    else if (child.nodeType == 3) {
      var test = child.textContent.match($self.interpolation);
      if (test) {
        child.textContent = $self.replaceNodeValue(child.textContent, child, scope, newScope, model)
      }
    }
  });
}