(()=>{
function equalsCssValues(key, valueStored, valueWritten) {
  var equal0 = valueWritten == "0" && valueStored == "0px";
  var equalWithoutQuotationsMarks = key == "font-family" &&
    valueStored.replace(/'|"/g, "") == valueWritten.replace(/'|"/g, "");
  return equal0 || equalWithoutQuotationsMarks;
}
const opener = window.opener || window.parent;
const appView = document.getElementById("css-inspector");
const vendorPrefixesToDel = /-(moz|webkit|ms|o)-/;
const app = opener.tilepieces;
let isChanging = false;
let d; // cached detail
let selectedRule = null;
let cssDefaultProperties = app.cssDefaultProperties;
let cssDefaultValues = app.cssDefaultValues;
let newRuleButton = document.getElementById("css-target-new-rule");
let deleteRuleButton = document.getElementById("css-target-delete-rule");
let mainRules = document.getElementById("main-rules");
let pseudoStates = document.getElementById("pseudo-states");
let pseudoElements = document.getElementById("pseudo-elements");
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("edit-page", e => {
  if (!e.detail) {
    model.isVisible = false;
    t.set("", model);
  }
});
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
let model = {
  cssDefaultProperties,
  isVisible: false,
  classes: [],
  rules: [],
  ancestors: [],
  menuPlusHide: "css-inspector__hide",
  menuClassHide: "css-inspector__hide",
  deleteRuleDisabled: "css-inspector__disabled",
  showPseudoStates: false,
  showPseudoElements: false,
  showMainRules: true,
  groupingRules: [],
  pseudoStates: [],
  pseudoElements: []
};
let t = new opener.TT(appView, model, {
  templates: [{
    name: "css-properties-list",
    el: document.getElementById("css-properties-list").content
  }, {
    name: "css-rule",
    el: document.getElementById("css-rule").content
  }]
});
css_rule_modification({
  tilepiecesTemplate: t,
  tilepiecesTemplateModel: model,
  appView,
  cbFunctionOnValueUpdate: closestContainer => strikePropertyNotApplied(closestContainer)
});
inputCss(appView);
if (app.elementSelected)
  setTemplate({detail: app.selectorObj});
//opener.tilepieces.elementSelected.dispatchEvent(new PointerEvent("pointerdown",{bubbles: true}));
function createElementRepresentation(target) {
  var myObject = [];
  var attributes = target.attributes;
  // attribute cycle to print element
  for (var i = 0; i < attributes.length; i++)
    myObject[i] = attributes[i].nodeName.toLowerCase() + "=\"" + attributes[i].nodeValue + "\"";
  return "<" + target.tagName + " " + myObject.join(" ") + " >";
}
function mapPseudoRules(rules) {
  var resObj = [];
  rules.forEach((rule, i) => {
    var newRule = Object.assign({}, rule);
    newRule.index = i;
    newRule.parentRules = [];
    newRule.selected = "";
    newRule.contenteditable = (newRule.isStyle && model.match) ||
    newRule.rule.parentStyleSheet == opener.tilepieces.core.currentStyleSheet ?
      "contenteditable" : "";
    newRule.isEditable = newRule.contenteditable == "contenteditable";
    var swapRule = newRule.rule;
    while (swapRule.parentRule) {
      if (swapRule.parentRule.constructor.name == "CSSMediaRule")
        newRule.parentRules.unshift({type: "media", conditionText: swapRule.parentRule.conditionText});
      if (swapRule.parentRule.constructor.name == "CSSSupportsRule")
        newRule.parentRules.unshift({type: "supports", conditionText: swapRule.parentRule.conditionText});
      swapRule = swapRule.parentRule;
    }
    newRule.loc = newRule.href || opener.tilepieces.core.currentDocument.location.href;
    newRule.locPop = newRule.loc.split("/").pop();
    newRule.editSelector = false;
    newRule.selectorMatch = true;
    newRule.properties = newRule.properties.map((v, i, a) => {
      v.index = i;
      v.checked = typeof v.checked !== "undefined" ? v.checked : true;
      v.isInheritedClass = "";
      v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
      v.disabled = newRule.isEditable ? "" : "disabled";
      v.autocomplete_suggestions = cssDefaultValues[v.property] || [];
      return v;
    });
    var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v => v.rule == newRule.rule);
    if (hasCachedProperties) {
      hasCachedProperties.properties.forEach(v => {
        if (newRule.properties.find(pr => pr.property == v.property && pr.value == v.value)) {
          var indexCached = hasCachedProperties.properties.findIndex(hc => hc.property == v.property && hc.value == v.value);
          hasCachedProperties.properties.splice(indexCached, 1);
          if (!hasCachedProperties.properties.length) {
            opener.tilepieces.core.cachedProperties.splice(opener.tilepieces.core.cachedProperties.indexOf(hasCachedProperties), 1);
          }
          return;
        }
        v.index = newRule.properties.length;
        v.isInheritedClass = newRule.inheritedProps ?
          (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
        v.disabled = newRule.isEditable ? "" : "disabled";
        v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
        newRule.properties.push(v);
      })
    }
    newRule.pseudos.forEach(v => {
      var found = resObj.find(ps => ps.name == v);
      if (!found)
        resObj.push({name: v, rules: [newRule]});
      else
        found.rules.push(newRule);
    })
  });
  return resObj.sort((a, b) => a.name.localeCompare(b.name));
}
function mapRules(rule, index) {
  var newRule = Object.assign({}, rule);
  newRule.parentRules = [];
  newRule.selected = "";
  var currentStyleSheet = opener.tilepieces.core.currentStyleSheet;
  newRule.contenteditable = (newRule.isStyle && model.match && model.match.match && model.match.match.getAttribute("style") == newRule.rule.getAttribute("style")) ||
  (currentStyleSheet && newRule.rule.parentStyleSheet == currentStyleSheet) ?
    "contenteditable" : "";
  newRule.isEditable = newRule.contenteditable == "contenteditable";
  var swapRule = rule.rule;
  while (swapRule.parentRule) {
    if (swapRule.parentRule.constructor.name == "CSSMediaRule")
      newRule.parentRules.unshift({type: "media", conditionText: swapRule.parentRule.conditionText});
    if (swapRule.parentRule.constructor.name == "CSSSupportsRule")
      newRule.parentRules.unshift({type: "supports", conditionText: swapRule.parentRule.conditionText});
    swapRule = swapRule.parentRule;
  }
  if (!newRule.isStyle) {
    var loc = newRule.rule.parentStyleSheet.ownerNode.getAttribute("href");
    if(loc && loc[0]=="/")
      loc = ("/"+app.frameResourcePath()+loc).replace(/\/+/g,"/")
    else
      loc = newRule.href || app.core.currentDocument.location.href
    newRule.loc = loc;
    newRule.locPop = newRule.loc.split("/").pop();
    newRule.editSelector = false;
    newRule.selectorMatch = true;
  }
  newRule.properties = newRule.properties.map((v, i, a) => {
    v.index = i;
    v.checked = typeof v.checked !== "undefined" ? v.checked : true;
    v.disabled = newRule.isEditable ? "" : "disabled";
    v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
    v.isInheritedClass = newRule.inheritedProps ?
      (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
    v.autocomplete_suggestions = cssDefaultValues[v.property] || [];
    return v;
  });
  var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v => v.rule == newRule.rule);
  if (hasCachedProperties) {
    hasCachedProperties.properties.forEach(v => {
      if (newRule.properties.find(pr => pr.property == v.property && pr.value == v.value)) {
        var indexCached = hasCachedProperties.properties.findIndex(hc => hc.property == v.property && hc.value == v.value);
        hasCachedProperties.properties.splice(indexCached, 1);
        if (!hasCachedProperties.properties.length) {
          opener.tilepieces.core.cachedProperties.splice(opener.tilepieces.core.cachedProperties.indexOf(hasCachedProperties), 1);
        }
        return;
      }
      v.index = newRule.properties.length;
      v.isInheritedClass = newRule.inheritedProps ?
        (v.isInherited ? "is-inherited" : "is-not-inherited") : "";
      v.disabled = newRule.isEditable ? "" : "disabled";
      v.contenteditable = newRule.isEditable && v.checked ? "contenteditable" : "";
      newRule.properties.push(v);
    })
  }
  newRule.index = index;
  return newRule;
}
function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  // this for mobile when keyboard trigger a resize event
  var oDoc = appView.ownerDocument
  if(oDoc.hasFocus() && oDoc.activeElement && appView.contains(oDoc.activeElement))
    return;
  d = e ? e.detail : d; // cached detail
  model.elementPresent = d.target;
  model.match = d.match;
  model.isVisible = true;
  //model.editingClass = "";
  model.rules = d.cssRules.cssMatches.slice(0).map(mapRules);
  model.pseudoStates = mapPseudoRules(d.cssRules.pseudoStates);
  model.pseudoElements = mapPseudoRules(d.cssRules.pseudoElements);
  model.ancestors = d.cssRules.ancestors.slice(0).map((ancestor, i) => {
    if (ancestor.ancestorStyle)
      ancestor.ancestorstyle = mapRules(ancestor.ancestorStyle);
    ancestor.elementRepresentation = createElementRepresentation(ancestor.ancestor);
    ancestor.matches = ancestor.matches.map(mapRules);
    ancestor.index = i;
    return ancestor;
  });
  model.isVisible = true;
  model.deleteRuleDisabled = "css-inspector__disabled";
  t.set("", model);
  console.log(model);
  inputCss(appView);
  [...document.querySelectorAll(".css-inspector__container")].forEach(v => strikePropertyNotApplied(v))
}

function strikePropertyNotApplied(block) {
  var selectorRules = {};
  var blocks = block.querySelectorAll(".css-inspector__rule-block");
  for (var i = 0; i < blocks.length; i++) {
    var rule = blocks[i]["__css-viewer-rule"];
    var keys = blocks[i].querySelectorAll(".rule-block__key");
    for (var k = keys.length - 1; k >= 0; k--) {
      var parent = keys[k].parentNode;
      if(parent.classList.contains("is-not-inherited"))
        continue;
      if (!keys[k].previousElementSibling.checked) {
        parent.classList.add("css-inspector__rule-block__strike");
        continue;
      }
      var keyValue = keys[k].textContent.trim();
      var key = keyValue.replace(vendorPrefixesToDel, "");
      var value = keys[k].nextElementSibling.nextElementSibling &&
        keys[k].nextElementSibling.nextElementSibling.textContent.trim();
      if (!value)
        continue;
      var important = value && value.match(/!important/i);
      var shortHand = app.selectorObj.cssRules.isShortHand(key);
      var keyPresent = selectorRules[key] || (shortHand && selectorRules[shortHand]);
      if(keyPresent && keyPresent.value.match(/!important/i)) {
        parent.classList.add("css-inspector__rule-block__strike");
        continue;
      }
      var inherited = blocks[i].classList.contains("css-inspector__rule-block__inherited");
      var cssPropertyValue = rule.rule.style.getPropertyValue(key);
      var cssPropertyPriority = rule.rule.style.getPropertyPriority(key);
      //////////
      var isWrong = !cssPropertyValue ||
        (cssPropertyValue != value.replace(/!important/i, "").trim() &&
          !equalsCssValues(key, cssPropertyValue, value));
      var notExists = !keyPresent ||
        keyPresent.parent.closest(".css-inspector__rule-block") == blocks[i];
      /*
      var isImportantAndThereAreNotImportant =
          (keyPresent && important && !keyPresent.value.match(/!important/i) &&
          (!inherited || (keyPresent.inherited && !keyPresent.value.match(/!important/i))));*/
      var isActive = !isWrong && (notExists || cssPropertyPriority);
      if (keyPresent && isActive)
        keyPresent.parent.classList.add("css-inspector__rule-block__strike");
      if (isActive) {
        selectorRules[key] = {value, inherited, parent};
        parent.classList.remove("css-inspector__rule-block__strike");
      } else
        parent.classList.add("css-inspector__rule-block__strike");
    }
  }
}
// same in css-matcher\src\findPseudoStates.js
const PSEUDOSTATES = /(:hover|:active|:focus|:focus-within|:visited)(?=$|:|\s|,)/g;
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("rule-selector"))
    return;
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  if (!ruleBlock.classList.contains("selected") ||
    ruleBlock.classList.contains("css-inspector__rule-block__inherited"))
    return;
  var rule = ruleBlock["__css-viewer-rule"];
  rule.editSelector = true;
  t.set("", model);
  ruleBlock.querySelector(".rule-selector-edit").focus();
});

appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("rule-selector-edit"))
    return;
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  var rule = ruleBlock["__css-viewer-rule"];
  var el = model.elementPresent;
  var selectorText = e.target.innerText.trim();
  var selectorMatch;
  try {
    selectorMatch = el.matches(selectorText.replace(PSEUDOSTATES, ""));
  } catch (e) {
    selectorMatch = false;
  }
  if (!selectorMatch && !rule.selectorMatch) {
    rule.editSelector = false;
    rule.selectorMatch = true;
  } else if (!selectorMatch) {
    rule.selectorMatch = selectorMatch;
    e.target.focus();
  } else {
    //opener.tilepieces.core.deleteOrChangeCssRule(rule.rule,selectorText+"{"+rule.rule.style.cssText+"}");
    opener.tilepieces.core.setSelectorText(rule.rule, selectorText);
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
    return;
  }
  t.set("", model);
}, true);

appView.addEventListener("input", e => {
  if (!e.target.classList.contains("rule-selector-edit"))
    return;
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  var rule = ruleBlock["__css-viewer-rule"];
  var el = model.elementPresent;
  var selectorText = e.target.innerText.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
  try {
    rule.selectorMatch = el.matches(selectorText.replace(PSEUDOSTATES, ""));
  } catch (e) {
    rule.selectorMatch = false;
  }
  t.set("", model);
});

appView.addEventListener("paste",e=>{
  var t = e.target;
  if(!t.classList.contains("rule-selector-edit"))
    return;
  e.preventDefault();
  if (e.clipboardData && e.clipboardData.getData) {
    var text = e.clipboardData.getData("text/plain");
    if(text.length){
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
      var en = new KeyboardEvent("input", {bubbles : true});
      t.dispatchEvent(en);
    }
  }
});
deleteRuleButton.addEventListener("click", e => {
  if (e.target.classList.contains("css-inspector__disabled"))
    return;
  var rule = selectedRule.rule;
  opener.tilepieces.core.deleteCssRule(rule);
  //opener.tilepieces.core.deleteOrChangeCssRule(rule);
  selectedRule = null;
  model.deleteRuleDisabled = "css-inspector__disabled";
  d.cssRules = opener.tilepieces.core.cssMatcher(model.elementPresent,
    opener.tilepieces.core.styles.styleSheets);
  setTemplate();
});
newRuleButton.addEventListener("click", e => {
  var selector = opener.tilepieces.cssSelector;
  if(!selector)
    return;
  var selectorText = opener.tilepieces.cssSelector + "{}";
  var currentStylesheet = opener.tilepieces.core.currentMediaRule || opener.tilepieces.core.currentStyleSheet;
  model.menuPlusHide = "css-inspector__hide";
  if (currentStylesheet) {
    var index = currentStylesheet.cssRules.length;
    var newRule = opener.tilepieces.core.insertCssRule(currentStylesheet, selectorText, index);
    updateTemplateOnNewRule(newRule);
  } else {
    opener.addEventListener("cssMapper-changed", ()=>updateTemplateOnNewRule(), {once: true});
    selectorText = opener.tilepieces.currentMediaRule
      ? opener.tilepieces.utils.convertGroupingRuleToSelector(
        opener.tilepieces.cssSelector, opener.tilepieces.core.currentMediaRule)
      : selectorText;
    opener.tilepieces.core.createCurrentStyleSheet(selectorText);
  }
});
appView.addEventListener("click", e => {
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  if (!ruleBlock)
    return;
  var rule = ruleBlock["__css-viewer-rule"];
  if (!rule.isStyle && rule.type != "external")
    model.deleteRuleDisabled = "";
  else
    model.deleteRuleDisabled = "css-inspector__disabled";
  if (rule.type == "external")
    return;
  if (rule.selected)
    return;
  if (selectedRule)
    selectedRule.selected = "";
  rule.selected = "selected";
  selectedRule = rule;
  t.set("", model);
  if(!rule.inheritedProps && rule.isEditable) {
    app.cssSelector = rule.rule.selectorText;
    var parentRule= rule.rule.parentRule;
    if(!parentRule)
      app.core.currentMediaRule = null;
    while(parentRule){
      if(app.core.styles.conditionalGroups.find(v=>v.rule == parentRule)){
        app.core.currentMediaRule = parentRule;
        break;
      }
      parentRule = parentRule.parentRule
    }
    opener.dispatchEvent(new Event("css-selector-change"));
  }
});
let togglePseudoStates = document.getElementById("toggle-pseudo-states");
let togglePseudoElements = document.getElementById("toggle-pseudo-elements");
togglePseudoStates.addEventListener("click", e => {
  model.showMainRules = model.showPseudoStates; //? true : false;
  model.showPseudoElements = false;
  togglePseudoElements.classList.remove("pseudo-trigger-selected");
  togglePseudoStates.classList.toggle("pseudo-trigger-selected");
  model.showPseudoStates = !model.showPseudoStates;
  t.set("", model);
});
togglePseudoElements.addEventListener("click", e => {
  model.showMainRules = model.showPseudoElements; //? true : false;
  model.showPseudoStates = false;
  togglePseudoStates.classList.remove("pseudo-trigger-selected");
  togglePseudoElements.classList.toggle("pseudo-trigger-selected");
  model.showPseudoElements = !model.showPseudoElements;
  t.set("", model);
});
function updateTemplateOnNewRule(newRule) {
  d.cssRules = opener.tilepieces.core.cssMatcher(model.elementPresent,
    opener.tilepieces.core.styles.styleSheets);
  setTemplate();
  // HIGHLIGHT new rule
  newRule = newRule || opener.tilepieces.core.currentMediaRule?.cssRules[0] || opener.tilepieces.core.currentStyleSheet.cssRules[0];
  var block;
  if(d.cssRules.cssMatches.find(v=>v.rule == newRule)){
    model.showPseudoStates && togglePseudoStates.click();
    model.showPseudoElements && togglePseudoElements.click();
    block = [...mainRules.querySelectorAll(".css-inspector__rule-block")].find(v=>v["__css-viewer-rule"].rule == newRule);
  }
  else if(d.cssRules.pseudoStates.find(v=>v.rule == newRule)){
    !model.showPseudoStates && togglePseudoStates.click();
    block = [...pseudoStates.querySelectorAll(".css-inspector__rule-block")].find(v=>v["__css-viewer-rule"].rule == newRule);
  }
  else if(d.cssRules.pseudoElements.find(v=>v.rule == newRule)){
    !model.showPseudoElements && togglePseudoElements.click();
    block = [...pseudoElements.querySelectorAll(".css-inspector__rule-block")].find(v=>v["__css-viewer-rule"].rule == newRule);
  }
  var win = mainRules.getRootNode().defaultView;
  win.scroll({
    top: block.offsetTop + (block.offsetHeight / 2 ) + win.scrollY - (win.innerHeight / 2),
    left: 0,
    behavior: 'smooth'
  });
}

})();