(()=>{
const opener = window.opener || window.parent;
const tilepieces = opener.tilepieces;
const cssDefaultValues = tilepieces.cssDefaultValues;
const cssDefaultProperties = tilepieces.cssDefaultProperties;

window.cssDefaults = opener.tilepieces.cssDefaultValues;
window.css_rule_modification = o => {
  var t = o.tilepiecesTemplate;
  var m = o.tilepiecesTemplateModel;
  var appView = o.appView;
  var cb = o.cbFunctionOnValueUpdate;
  var autocompleteSingleton = autocomplete(appView);
  appView.addEventListener("click", (e) => {
    if (!e.target.classList.contains("rule-block__add-property"))
      return;
    var ruleEl = e.target.previousElementSibling;//closest(".rule-block__list");
    addProperty(ruleEl, t, m)
  });
  appView.addEventListener("click", activateKey);
  appView.addEventListener("blur", createAutocomplete, true);
  appView.addEventListener("blur", (e) => {
    keyInpuOnBlur(e, t, m);
  }, true);
  appView.addEventListener("input", valueInputOnInput);
  appView.addEventListener("blur", e => {
    if (!e.target.classList.contains("rule-block__value"))
      return;
    updateRuleOnBlur(e.target, t, m, appView, cb);
  }, true);
  appView.addEventListener("paste", e => {
    onPaste(e, autocompleteSingleton, t, m, appView, cb);
  });
  appView.addEventListener("keydown", e => {
    onKeyDown(e, t, m)
  });
  appView.addEventListener("change", e => {
    if (!e.target.classList.contains("rule-block__checked"))
      return;
    checkProperty(e, cb);
  })
};
function modifyValueProperty(rule, prop, value, isStyle) {
  var priority = "";
  value = value.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "")
  var matchImportant = value.match(/!important/i);
  if (matchImportant) {
    value = value.substring(0, matchImportant.index) +
      value.substring(matchImportant.index + matchImportant[0].length);
    priority = "important";
  }
  if (isStyle)
    opener.tilepieces.core.htmlMatch.style(rule.rule, prop, value, priority);
  else
    opener.tilepieces.core.setCssProperty(rule.rule, prop, value, priority);
};

function activateKey(e) {
  if (!e.target.classList.contains("rule-block__key") || !e.isTrusted)
    return;
  if (e.target.dataset.contenteditable) { // removing on createAutocomplete
    e.target.setAttribute("contenteditable", "");
    e.target.focus();
  }
}
function addProperty(ruleEl, t, model) {
  var rule = ruleEl["__css-viewer-rule"];
  // rule.inheritedProps is css-inspector
  rule.properties.push({
    property: "",
    value: "",
    index: rule.properties.length,
    checked: true,
    isInheritedClass: rule.inheritedProps ?
      (rule.isInherited ? "is-inherited" : "is-not-inherited") : "",
    disabled: rule.isEditable ? "" : "disabled",
    contenteditable: rule.isEditable ? "contenteditable" : ""
  });
  t.set("", model);
  var keys = ruleEl.querySelectorAll(".rule-block__key");
  var key = keys[keys.length - 1];
  key.setAttribute("contenteditable", "");
  key.focus();
}
function checkProperty(e, cb) {
  var target = e.target;
  var closestContainer = target.closest(".css-inspector__container");
  var ruleEl = target.closest(".rule-block__list");
  var rule = ruleEl["__css-viewer-rule"];
  var propertyBlock = target.closest(".rule__property");
  var valueEl = propertyBlock.querySelector(".rule-block__value");
  var propertyIndex = propertyBlock.dataset.index;
  var item = rule.properties[propertyIndex];
  var prop = rule.properties[propertyIndex].property;
  var value = rule.properties[propertyIndex].value;
  modifyValueProperty(rule, prop, !target.checked ? "" : value, rule.isStyle);
  var isAlreadyCachedIndex = opener.tilepieces.core.cachedProperties.findIndex(v => v.rule == rule.rule);
  var isAlreadyCached = opener.tilepieces.core.cachedProperties[isAlreadyCachedIndex];
  if (isAlreadyCached && target.checked) {
    var indexCached = isAlreadyCached.properties.findIndex(v => v.index == propertyIndex);
    isAlreadyCached.properties.splice(indexCached, 1);
    if (!isAlreadyCached.properties.length)
      opener.tilepieces.core.cachedProperties.splice(isAlreadyCachedIndex, 1);
  } else if (!isAlreadyCached) {
    item.contenteditable = "";
    item.checked = false;
    opener.tilepieces.core.cachedProperties.push({
      properties: [item],
      rule: rule.rule
    });
  } else {
    item.contenteditable = "";
    item.checked = false;
    isAlreadyCached.properties.push(item);
  }
  ruleEl.querySelectorAll(".input-css-placeholder").forEach(v => v.remove());
  valueEl.dispatchEvent(new Event("blur"));
}
function createAutocomplete(e) {
  var target = e.target;
  if (!target.classList.contains("rule-block__key") || !e.isTrusted)
    return;
  target.nextElementSibling.nextElementSibling.__autocomplete_suggestions =
    target.dataset.key == "font-family" ?
      tilepieces.core.fontSuggestions :
      cssDefaultValues[e.target.textContent] || [];
  target.removeAttribute("contenteditable")
}
function keyInpuOnBlur(e, t, model) {
  if (!e.target.classList.contains("rule-block__key") || !e.isTrusted)
    return;
  var exprop = e.target.dataset.key;
  var value = e.target.textContent.trim();
  var ruleEl = e.target.closest(".rule-block__list");
  var rule = ruleEl["__css-viewer-rule"];
  var propertyIndex = e.target.closest(".rule__property").dataset.index;
  if (!value || cssDefaultProperties.indexOf(value) == -1) {
    var indexProp = rule.properties.length - 1;
    for (; indexProp >= 0; indexProp--) {
      if (indexProp != propertyIndex &&
        rule.properties[indexProp].property == exprop) {
        value = rule.properties[indexProp].value;
        break;
      }
    }
    modifyValueProperty(rule, exprop, value, rule.isStyle);
    rule.properties.splice(propertyIndex, 1);
    rule.properties.forEach((v, i) => v.index = i);
    t.set("", model);
  } else if (value) {
    if (value == exprop)
      return;
    rule.properties[propertyIndex].property = value;
    t.set("", model);
    if (!exprop)
      return;
    modifyValueProperty(rule, exprop, "", rule.isStyle);
    var valueStatement = e.target.nextElementSibling.nextElementSibling.textContent;
    if (!valueStatement.trim().length)
      return;
    modifyValueProperty(rule, value, valueStatement, rule.isStyle)
  }
}
function insertTextAtCursor(text, t) {
  var sel, range;
  sel = t.ownerDocument.defaultView.getSelection();
  range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(t.ownerDocument.createTextNode(text));
  var en = new KeyboardEvent("input", {bubbles: true});
  t.dispatchEvent(en);
}

function onPaste(e, autocompleteSingleton, t, model, appView, cbFunction) {
  if (!e.target.classList.contains("rule-block__key") &&
    !e.target.classList.contains("rule-block__value"))
    return;
  if (e.clipboardData && e.clipboardData.getData) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    if (!text.length)
      return;
    var semicomma = text.indexOf(";");
    if (semicomma == -1) {
      insertTextAtCursor(text, e.target);
    } else {
      var ruleEl = e.target.closest(".rule-block__list");
      var rule = ruleEl["__css-viewer-rule"];
      if (e.target.classList.contains("rule-block__value")) {
        var newTextSplitted = text.slice(0, semicomma);
        insertTextAtCursor(newTextSplitted, e.target);
        text = text.slice(semicomma + 1);
      }
      opener.getCssTextProperties(text).forEach(v => {
        modifyValueProperty(rule, v.property, v.value, rule.isStyle);
      });
      if (e.target.classList.contains("rule-block__key")) {
        autocompleteSingleton.blur();
        updateRuleOnBlur(e.target, t, model, appView, cbFunction);
      } else
        e.target.blur();
    }
  }
}
function onKeyDown(e, t, model) {
  if (e.target.classList.contains("rule-block__key")) {
    if (e.key == "Enter") {
      e.preventDefault();
      e.target.blur();
      e.target.nextElementSibling.nextElementSibling.focus();
    }
  }
  if (e.target.classList.contains("rule-block__value")) {
    if (e.key == "Enter" || (e.key == "Tab" && !e.shiftKey)) {
      e.preventDefault();
      var ruleEl = e.target.closest(".rule-block__list");
      e.target.blur();
      if (e.target.parentNode.nextElementSibling) {
        var key = e.target.parentNode.nextElementSibling.querySelector(".rule-block__key");
        setTimeout(() => {
          key.focus();
        })
      } else
        setTimeout(() => {
          addProperty(ruleEl, t, model);
        })
    }
  }
}
function updateRuleOnBlur(target, t, model, appView, cbFunction) {
  var input = target;
  // this line is just for the css inspector. No time to find a more elegant way
  var closestContainer = input.closest(".css-inspector__container");
  var ruleEl = input.closest(".rule-block__list");
  var rule = ruleEl["__css-viewer-rule"];
  rule.properties = opener.getCssTextProperties(rule.rule.style.cssText).map((v, i, a) => {
    v.index = i;
    v.checked = true;
    v.disabled = rule.isEditable ? "" : "disabled";
    v.isInherited = rule.inheritedProps && v.property.match(opener.inheritedProperties);
    v.isInheritedClass = rule.inheritedProps ?
      (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
    v.contenteditable = rule.isEditable && v.checked ? "contenteditable" : "";
    v.autocomplete_suggestions = cssDefaultValues[v.property] || [];
    return v;
  });
  var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v => v.rule == rule.rule);
  if (hasCachedProperties) {
    hasCachedProperties.properties.forEach(v => {
      v.index = rule.properties.length;
      v.isInheritedClass = rule.inheritedProps ?
        (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
      v.disabled = rule.isEditable ? "" : "disabled";
      v.checked = false;
      v.contenteditable = rule.isEditable && v.checked ? "contenteditable" : "";
      rule.properties.push(v);
    })
  }
  t.set("", model);
  inputCss(appView);
  //strikePropertyNotApplied(closestContainer);
  cbFunction && cbFunction(closestContainer)
}
function valueInputOnInput(e) {
  if (!e.target.classList.contains("rule-block__value"))
    return;
  var prop = e.target.dataset.prop;
  var ruleEl = e.target.closest(".rule-block__list");
  var rule = ruleEl["__css-viewer-rule"];
  var inputCss = e.target;
  var value = inputCss ? inputCss.innerText : "";
  var originalValue = value;
  var propertyEl = e.target.closest(".rule__property");
  var propertyIndex = propertyEl.dataset.index;
  rule.properties[propertyIndex].value = originalValue;
  modifyValueProperty(rule, prop, value, rule.isStyle);
}



})();