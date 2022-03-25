(() => {
  TT.prototype.bindingEl = function (el, stringModel, targetEl, ttobj, newScope) {
    var $self = this;
    var events = el.dataset[$self.bindEventsAttr];
    if (events)
      events = events.split(",");
    else
      events = ["change"];
    events.forEach(e =>
      el.addEventListener(e, (ev) => {
        /*
        if(!ttobj.el.contains(ev.target) && ttobj.el != ev.target)
            return;*/
        targetEl.dispatchEvent(
          new CustomEvent(stringModel, {detail: ev})
        );
        var value;
        if (el.tagName == "INPUT" && el.type == "checkbox")
          value = ev.target.checked;
        else if (el.tagName == "INPUT" && el.type == "radio") {
          var c = targetEl.querySelector(`[name="${el.name}"]:checked`);
          value = c ? c.value : null;
        } else if (el.tagName == "INPUT" && el.type == "number")
          value = Number(ev.target.value);
        else if ((el.tagName == "INPUT" && el.type != "file") || el.tagName == "SELECT" ||
          el.tagName == "TEXTAREA")
          value = ev.target.value;
        else if (el.type != "file")
          value = ev.target.textContent;
        var match = getParamFromString(convertVarToModel(stringModel, newScope), ttobj.scope);
        if (match == value) {
          console.log("returning");
          return;
        }
        ttobj.set(stringModel, value);
        Object.defineProperty(ev, "stringModel", {value: stringModel});
        targetEl.dispatchEvent(new CustomEvent("template-digest", {detail: ev}));
      })
    );
  }
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

  function ifResolver(condition, scope) {
    var names = [], values = [];
    for (var k in scope) {
      names.push(k);
      values.push(scope[k]);
    }
    return new Function(names,
      'try{return ' + condition + ' }catch(e){return false}')
      .apply(this, values);
  }

//let triggerAttribute = "frontart-template";
  let bindNoTriggerAttribute = "t-bind-no-trigger"; // TODO ???
  function TT(el, data, options = {}) {
    this.model = [];
    this.el = el;
    this.interpolation = options.interpolation || /\$\{([\s\S]+?)\}/;
    this.ifAttr = options.ifAttr || "if";
    this.foreachAttr = options.foreachAttr || "foreach";
    this.foreachKeyNameAttr = options.foreachKeyNameAttr || "foreachKeyName";
    this.bindAttr = options.bindAttr || "bind";
    this.bindDOMPropAttr = options.bindDOMPropAttr || "bindDomProp";
    this.bindEventsAttr = options.bindEventsAttr || "bindEvents";
    this.setTemplateAttr = options.setTemplateAttr || "set";
    this.useTemplateAttr = options.useTemplateAttr || "use";
    this.useTemplateParamsAttr = options.useTemplateParamsAttr || "params";
    this.isolateAttribute = options.isolateAttribute || "isolate";
    this.srcAttribute = options.srcAttribute || "src";
    this.toChange = [];
    this.templates = [];
    if (options.templates)
      this.templates = this.templates.concat(options.templates);
    this.getParamFromString = (string) => {
      return getParamFromString(string, this.scope);
    };
    this.setParamFromString = (string, value) => {
      return setParamFromString(string, this.scope, value);
    };
    this.scope = data;
    this.declare(el, data, this.model);
    return this;
  }

  window.TT = TT;
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
          break; // no need to continue. The node had been already changed by replaceNodeValue and continue will cause a leak
        }
      }
    }
  }
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
  TT.prototype.set = function (string, value) {
    var $self = this;
    if (string) {
      var newValue = setParamFromString(string, $self.scope, value);
      if (!string)
        $self.scope = newValue;
    } else $self.scope = value;
    $self.model.slice(0).forEach((m, i, a) => {
      try {
        $self.process(m, string || "", $self.model, i)
      } catch (e) {
        console.error("[TT.prototype.set error on model process]", e);
        console.error("string,value", string, value);
        console.error("model,index,array", m, i, a);
        console.error("$self.model ->", $self.model);
        console.trace();
      }
    });
    for (var i = $self.toChange.length - 1; i >= 0; i--)
      $self.toChange[i].parentModel.splice($self.toChange[i].index, 1);
    $self.toChange = [];
  }

  function convertVarToModel(variable, newScope) {
    var find = newScope
      .findIndex(v => variable.startsWith(v.variable + ".") ||
        v.variable == variable || variable.startsWith(v.variable + "["));
    var count = 0;
    var swapVariable = variable;
    while (find > -1) {
      variable = variable.replace(newScope[find].variable, newScope[find].iterable || newScope[find].original);
      find = newScope.findIndex(v => variable.startsWith(v.variable + ".") ||
        v.variable == variable || variable.startsWith(v.variable + "["));
      count++;
      if (count > newScope.length) {
        console.error("[TT] Model generate infinite loop:\nVariable->\"", swapVariable,
          "\"\nnewScope->", newScope);
        throw new Error();
      }
    }
    return variable;
  }

  function copyObjectIterable(obj) {
    if (Array.isArray(obj))
      return obj.slice(0)
    else {
      var newObj = {};
      for (var k in obj)
        newObj[k] = obj[k]
      return obj;
    }
  }

  function getParamFromString(string, root, separator = ".") {
    if (!string.length) {
      return root;
    }
    var model = string.split(/\[|\]|\./).filter(v => v);//splitStringInModel(string,separator);
    var actualModel = root;
    for (var i = 0; i < model.length - 1; i++)
      actualModel = actualModel[model[i]];
    try {
      return actualModel[model[model.length - 1]];
    } catch (e) {
      console.error("can't find " + string + " in model\n", root);
      console.trace();
      throw new Error(e);
    }
  }

// https://stackoverflow.com/questions/21714808/array-isarray-does-not-work-on-a-nodelist-is-there-an-alternative

// Determine if o is an array-like object.
// Strings and functions have numeric length properties, but are 
// excluded by the typeof test. In client-side JavaScript, DOM text
// nodes have a numeric length property, and may need to be excluded 
// with an additional o.nodeType != 3 test.
  function isArrayLike(o) {
    if (o &&                                // o is not null, undefined, etc.
      typeof o === "object" &&            // o is an object
      isFinite(o.length) &&               // o.length is a finite number
      o.length >= 0 &&                    // o.length is non-negative
      o.length === Math.floor(o.length) &&  // o.length is an integer
      o.length < 4294967296)              // o.length < 2^32
      return true;                        // Then o is array-like
    else
      return false;                       // Otherwise it is not
  }

  function setParamFromString(string, root, value, separator = ".") {
    if (!string.length) {
      root = value;
      return root;
    }
    var model = splitStringInModel(string, separator);
    var actualModel = root;
    for (var i = 0; i < model.length - 1; i++)
      actualModel = actualModel[model[i]];
    return actualModel[model[model.length - 1]] = value;
  }

  function splitStringInModel(string) {
    var swap = string;
    var cursor = 0;
    var tokens = [];
    var values = [];
    var value = "";
    var currentToken;
    while (cursor < swap.length) {
      var sub = swap.substring(cursor);
      if (sub[0] == '[') {
        values.push(value.trim());
        value = "";
        var newcurrentToken = {start: cursor, childs: [], father: currentToken || tokens};
        if (currentToken && currentToken != tokens) {
          currentToken.childs.push(newcurrentToken);
          currentToken = newcurrentToken;
        } else {
          tokens.push(newcurrentToken);
          currentToken = newcurrentToken
        }
      } else if (sub[0] == ']') {
        values.push(value.trim());
        value = "";
        currentToken.end = cursor + 1;
        currentToken = currentToken.father;
      } else if (sub[0] == "." && (!currentToken || currentToken == tokens)) {
        value.trim() && values.push(value.trim());
        value = "";
      } else if (cursor == swap.length - 1) {
        value += sub[0];
        values.push(value.trim());
      } else
        value += sub[0];
      cursor += 1;
    }
    return values;
  }

})();