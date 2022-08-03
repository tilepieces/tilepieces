(()=>{
const opener = window.opener || window.parent;
const appView = document.getElementById("css-viewer");
const app = opener.tilepieces;
// the same in cssMatcher
const mainPseudoRegex = /(:{1,2}before|:{1,2}after|:{1,2}first-letter|:{1,2}first-line|::[a-z-]+)(?=$|,)/;
// the same in cssMatcher
const PSEUDOSTATES = /(:hover|:active|:focus|:focus-within|:visited|:focus-visible|:target)(?=$|:|\s|,)/;
const replacePseudos = new RegExp(mainPseudoRegex.source + "|" + PSEUDOSTATES.source, "g");
const selectorHelperView = document.getElementById("selector-helper");
const selectorHelperTemplate = selectorHelperView.children[0];
const selectorHelperTrigger = document.getElementById("selector-helper-trigger");
const cssInspectorView = document.getElementById("css-inspector");
let shtModel = {nodes : []};
let model = {
  isVisible: false,
  groupingRules: [],
  selectorMatch: true,
  mediaQueries: [],
  mediaQueryUIMask: "min-max-width",
  mediaQueryUIMinWidth: 0,
  mediaQueryUIMaxWidth: 0,
  newGroupingType: "0",
  supportCondition: "",
  mediaQueryMainLogicalOperator: "",
  newgrbuttondisabled: "disabled",
  mediaQueryUIFreeHand: "",
  mediaQueryUICheck: true,
  mediaqueryuidisabled: "disabled",
  mediaQueryUIMaskMediaType: "screen",
  mediaQueryUIMaskFeatures: [],
  relatedSelectors: []
};
let d; // cached detail
let addGrButton = document.getElementById("add-gr-rule");
const modalNewGr = document.getElementById("modal-new-gr");
let addQueryAppliedCond = ""; // new media condition
let appendOn = null; // gr to append new media rule
let mediaQueryUiMask = document.getElementById("media-query-UI-mask");
let t = new opener.TT(appView, model);
opener.addEventListener("highlight-click", setTemplate);
/*
opener.addEventListener("edit-mode",e=> {
    if(!app.editMode)
        document.body.style.display = "none";
    else
        document.body.style.display = "block";
        //t.set("isVisible",false)
    model.currentSelector = app.cssSelector;
    t.set("",model);
});*/
opener.addEventListener("deselect-element", e => {
  appView.ownerDocument.body.style.display = "none";
});
opener.addEventListener("frame-unload", e => {
  appView.ownerDocument.body.style.display = "none";
});
opener.addEventListener("html-rendered", e => {
  //model.isVisible = false;
  //t.set("",model);
});
opener.addEventListener("frame-resize", e => {
  if (!model.isVisible)
    return;
  /*
    model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
    model.grChosen = model.groupingRules.find(v=>v.isCurrentGr);
    t.set("",model);*/
  app.elementSelected && app.core.selectElement(app.elementSelected)
  //app.elementSelected.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}))
});
// main tabs
/*
tilepieces_tabs({
    el : document.getElementById("main-tab"),
    onSelect : ()=>{
        app.elementSelected.dispatchEvent(new PointerEvent("pointerdown",{bubbles: true}))
    }
});*/
const tabVertical = document.querySelector(".tab-vertical");
tabVertical.addEventListener("selection", e => app.core.selectElement(app.elementSelected))
if (app.elementSelected)
  setTemplate({detail: {target: app.elementSelected}})
//app.elementSelected.dispatchEvent(new PointerEvent("pointerdown",{bubbles: true}));

opener.addEventListener("cssMapper-changed", e => {
  model.isVisible &&
  app.elementSelected && app.core.selectElement(app.elementSelected)
  //app.elementSelected.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
});
// on mutation
opener.addEventListener("tilepieces-mutation-event", e => {
  var findAttributeMutation, childrenList;
  var mutationList = e.detail.mutationList;
  mutationList.forEach(mutation => {
    if (mutation.type == "childList" &&
      mutation.target == app.elementSelected)
      childrenList = true;
    if (mutation.type == "attributes" &&
      mutation.target == app.elementSelected)
      findAttributeMutation = true;
  });
  if (childrenList || findAttributeMutation)
    app.core.selectElement(app.elementSelected)
    //app.elementSelected.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
})

function createElementRepresentation(target) {
  var myObject = [];
  var attributes = target.attributes;
  // attribute cycle to print element
  for (var i = 0; i < attributes.length; i++)
    myObject[i] = attributes[i].nodeName.toLowerCase() + "=\"" + attributes[i].nodeValue + "\"";
  return "<" + target.tagName + " " + myObject.join(" ") + " >";
}
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-gr-rule"))
    return;
  var index = +e.target.dataset.index;
  var gr = model.groupingRules[index];
  app.core.deleteCssRule(gr.rule);
  // this will run "cssMapper-changed"
});
let groupingRuleTrigger = appView.querySelector(".css-selector-gr-trigger");
/*
groupingRuleTrigger
  .addEventListener("click",e=>{
      //if(e.target.closest(".css-selector-gr-data"))
      if(e.target.classList.contains("delete-gr-rule"))
          return;
      groupingRuleTrigger.classList.toggle("open");
  });*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("grouping-condition"))
    return;
  var item = e.target.closest(".grouping-rule-item");
  if (!item)
    return;
  var selected = item.dataset.iscurrent == "true";
  var index = item.dataset.index;
  app.core.currentMediaRule = !selected ? model.groupingRules[index].rule : null;
  model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
  model.grChosen = model.groupingRules.find(v => v.isCurrentGr);
  t.set("", model);
});
function mapGrouping(grules) {
  var currentStyle = app.core.currentStyleSheet;
  return grules.reduce((filtered, option) => {
    if (option.rule.parentStyleSheet != currentStyle)
      return filtered;
    var type = option.rule.type;
    var isMatch = type == window.CSSRule.SUPPORTS_RULE
      ? app.core.currentWindow.CSS.supports(option.rule.conditionText)
      : type == window.CSSRule.MEDIA_RULE
        ? app.core.currentWindow.matchMedia(option.rule.conditionText).matches
        : null;
    if (!isMatch)
      return filtered;
    var parentRule = option.rule.parentRule;
    while (parentRule) {
      isMatch = parentRule.type == window.CSSRule.SUPPORTS_RULE
        ? app.core.currentWindow.CSS.supports(parentRule.conditionText)
        : parentRule.type == window.CSSRule.MEDIA_RULE
          ? app.core.currentWindow.matchMedia(parentRule.conditionText).matches
          : null;
      if (!isMatch)
        return filtered;
      parentRule = parentRule.parentRule;
    }
    option.isCurrentGr = app.core.currentMediaRule == option.rule;
    option.index = filtered.length;
    filtered.push(option);
    return filtered;
  }, []);
}
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("related-selectors-select"))
    return;
  e.preventDefault();
  if (model.relatedSelectors.length <= 1)
    return;
});
appView.addEventListener("paste", e => {
  var t = e.target;
  if (t.dataset.bind != "currentSelector")
    return;
  e.preventDefault();
  if (e.clipboardData && e.clipboardData.getData) {
    var text = e.clipboardData.getData("text/plain");
    if (text.length) {
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
      var en = new KeyboardEvent("input", {bubbles: true});
      t.dispatchEvent(en);
    }
  }
});
appView.addEventListener("template-digest", e => {
  // Input. On 'blur', event should not fired because the old value will be equal the new one ( see TT bindingEl )
  var el = model.elementPresent;
  var selectorText = model.currentSelector.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
  var selectorTextsWithoutPseudos = selectorText.replace(replacePseudos, "");
  try {
    model.selectorMatch = el.matches(selectorTextsWithoutPseudos);
    model.relatedSelectors = app.core.currentDocument.querySelectorAll(
      selectorTextsWithoutPseudos);
  } catch (e) {
    model.selectorMatch = false;
  }
  t.set("", model);
});
function selectorUpdate(){
  if (!model.selectorMatch) {
    model.currentSelector = app.cssSelector;
    model.selectorMatch = true;
  } else {
    model.currentSelector = model.currentSelector.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
    app.cssSelector = model.currentSelector;
  }
  t.set("", model);
}
appView.addEventListener("currentSelector", e => {
  // see above
  if (e.detail.type != "blur")
    return;
  selectorUpdate();
});
appView.addEventListener("keydown", e => {
  if (e.target.dataset.bind == "currentSelector") {
    if (e.key == "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  }
});
appView.addEventListener("focus", e => {
  if (e.target.dataset.bind == "currentSelector")
    if(selectorHelperView.classList.contains("show"))
      selectorHelperTrigger.click();
},true);
/* on rule selected */
opener.addEventListener("css-selector-change", () => {
  model.currentSelector = app.cssSelector;
  model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
  model.grChosen = model.groupingRules.find(v => v.isCurrentGr);
  t.set("", model);
})
function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    appView.ownerDocument.body.style.display = "none";
    model.isVisible = false;
    t.set("", model);
    return;
  }
  d = e ? e.detail : d; // cached detail
  model.elementPresent = d.target;
  model.match = d.match;
  model.groupingRules = mapGrouping(app.core.styles.conditionalGroups);
  model.grChosen = model.groupingRules.find(v => v.isCurrentGr);
  model.currentSelector = app.cssSelector;
  model.isVisible = true;
  try {
    model.relatedSelectors = app.core.currentDocument.querySelectorAll(
      app.cssSelector.replace(replacePseudos, ""));
  } catch (e) {
    model.relatedSelectors = [app.elementSelected]
  }
  model.editMode = app.editMode;
  appView.ownerDocument.body.style.display = "block";
  t.set("", model);
  if(selectorHelperView.classList.contains("show")){
    selectorHelperTrigger.click();
  }
}

addGrButton.addEventListener("click", e => {
  e.stopPropagation();
  appendOn = model.grChosen ? model.grChosen.rule : null;
  model.mediaQueryUIMaskFeatures = [{
    logicalOperator: "and", feature: "max-width",
    value: app.core.currentWindow.innerWidth + "px", featureInput: "input", index: 0
  }];
  modalNewGr.style.display = "block";
  modalNewGr.ownerDocument.body.classList.add("modal");
  changeMediaCondition()
});
modalNewGr.querySelector(".modal-new-gr-close").addEventListener("click", e => {
  modalNewGr.style.display = "none";
  modalNewGr.ownerDocument.body.classList.remove("modal");
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("support-done"))
    return;
  if (appendOn) {
    app.core.insertCssRule(appendOn, "@supports " + model.supportCondition + "{}");
  } else {
    app.core.setCssMedia("@supports " + model.supportCondition + "{}");
  }
  app.core.runcssMapper()
    .then(styles => {
      console.log("new @support created -> appendOn ->", appendOn,
        "\nactual rule ->", appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1]);

      if (model.mediaQueryUICheck)
        app.core.currentMediaRule = appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1];
      model.newGroupingType = "0";
      model.grFreehand = "";
      model.newgrbuttondisabled = "disabled";
      setTemplate();
      modalNewGr.style.display = "none";
      appView.ownerDocument.body.classList.remove("modal");
    });
});
appView.addEventListener("supportCondition", e => {
  var d = e.detail;
  d.target.value = d.target.value.trim();
  var support;
  try {
    support = app.core.currentWindow.CSS.supports(d.target.value)
  } catch (e) {
  }
  if (!support)
    model.newgrbuttondisabled = "disabled";
  else
    model.newgrbuttondisabled = "";
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("add-media-feature"))
    return;
  model.mediaQueryUIMaskFeatures.push(
    {
      logicalOperator: "and", feature: "max-width",
      mediaQueryMainLogicalOperator: "",
      value: app.core.currentWindow.innerWidth + "px", featureInput: "input", index: 0
    }
  );
  changeMediaCondition();
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-feature"))
    return;
  model.mediaQueryUIMaskFeatures.splice(e.target.dataset.index, 1);
  model.mediaQueryUIMaskFeatures = model.mediaQueryUIMaskFeatures.map((v, i) => {
    v.index = i;
    return v;
  });
  changeMediaCondition();
});
appView.addEventListener("change", e => {
  var target = e.target;
  if (!target.classList.contains("media-feature"))
    return;
  var value = target.value;
  model.mediaQueryUIMaskFeatures[target.dataset.index].featureInput =
    value == "orientation" ? "orientation" : "input";
  if (value != "orientation")
    model.mediaQueryUIMaskFeatures[target.dataset.index].value = value.indexOf("width") >= 0 ?
      app.core.currentWindow.innerWidth + "px" :
      app.core.currentWindow.innerHeight + "px";
  changeMediaCondition();
});

function changeMediaCondition(e) {
  console.log("changeMediaCondition has been called");
  if (e && (
    (e.detail.target && !e.detail.target.closest("#modal-media-queries")) ||
    (!e.detail.target && modalNewGr.style.display != "block") // resize
  )
  )
    return;
  console.log("changeMediaCondition is processing");
  if (model.mediaQueryUIMask == "min-max-width")
    addQueryAppliedCond =
      (model.mediaQueryMainLogicalOperator ? model.mediaQueryMainLogicalOperator + " " : "") +
      model.mediaQueryUIMaskMediaType +
      model.mediaQueryUIMaskFeatures
        .map(v => " " + v.logicalOperator + " (" + v.feature + ":" + v.value + ")").join("");
  else
    addQueryAppliedCond = model.mediaQueryUIFreeHand.trim();
  console.log("addQueryAppliedCond", addQueryAppliedCond);
  var matchMedia = app.core.currentWindow.matchMedia(addQueryAppliedCond);
  if (matchMedia.matches) {
    model.mediaQueryUIFreeHand = matchMedia.media;
    addQueryAppliedCond = matchMedia.media;
    model.mediaqueryuidisabled = "";
  } else
    model.mediaqueryuidisabled = "disabled";
  t.set("", model);
  inputCss(appView);
}

appView.addEventListener("template-digest", changeMediaCondition);
opener.addEventListener("frame-resize", changeMediaCondition);
/*
mediaQueryUiMask.addEventListener("input",e=>{
    if(!e.target.classList.contains("input-css"))
        return;
    model.mediaQueryUIMaskFeatures[e.target.dataset.index].value = e.target.textContent;
    changeMediaCondition();
},true);*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("modal-media-done"))
    return;
  if (appendOn) {
    app.core.insertCssRule(appendOn, "@media " + addQueryAppliedCond + "{}");
  } else {
    app.core.setCssMedia("@media " + addQueryAppliedCond + "{}");
  }
  app.core.runcssMapper()
    .then(styles => {

      console.log("new @media created -> appendOn ->", appendOn,
        "\nactual rule ->", appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1]);

      if (model.mediaQueryUICheck)
        app.core.currentMediaRule = appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1];
      setTemplate();
      modalNewGr.style.display = "none";
      appView.ownerDocument.body.classList.remove("modal");
    });
});
// same regex from cssSpecificity component // TODO create a unique point
const idMatch = /#[_a-zA-Z0-9-]+/g;
const elementMatch =/(\s+|^|\*|\+|>|~|\|\|)[_a-zA-Z0-9-]+/g;
function newShtModel(currentSelector){
  var model = {};
  var target = app.elementSelected;
  var lastSelector = currentSelector.split(",").pop().trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "")
    .replace(replacePseudos, "");
  model.nodes = app.selectorObj.composedPath.reduce((acc,v)=>{
    if(v.tagName){
      acc.push(v);
    }
    return acc;
  },[]);
  model.nodes = model.nodes.map((v,i)=>{
    var nodeModel = {};
    nodeModel.index = i;
    nodeModel.ancestor = v != target;
    var elementMatchingSelector = "";
    if(lastSelector && v.matches(lastSelector)){
      var lastSelectorArray = lastSelector.split(/\s+/);
      elementMatchingSelector = lastSelectorArray.pop().trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
      if(lastSelectorArray.length && lastSelectorArray.at(-1).trim().match(/[>~+]|\|\|/)) // css combinators
        lastSelectorArray.splice(-1)
      lastSelector = lastSelectorArray.join(" ")
    }
    nodeModel.tagName = {checked:elementMatchingSelector.match(elementMatch),value:v.tagName.toLowerCase()};
    nodeModel.id = {checked:elementMatchingSelector.match(idMatch),value:v.id ? "#"+v.id : ""};
    nodeModel.elementRepresentation = createElementRepresentation(v);
    nodeModel.classes = {value:[...v.classList].map(v=>{
        return {checked:elementMatchingSelector.match(new RegExp("\\."+v+"(\\s|,|$|#|\\[|\\.)")),value:"."+v}
      })};
    nodeModel.classes.checked = nodeModel.classes.value.every(v=>v.checked);
    nodeModel.attributes = {value:[...v.attributes].map(attr=>{
        var selectorModel = `[${attr.nodeName}${attr.nodeValue.length ? `="${attr.nodeValue}"` : ""}]`
        return {checked:elementMatchingSelector.indexOf(selectorModel)>=0,value:selectorModel}
      })};
    nodeModel.attributes.checked = nodeModel.attributes.value.every(v=>v.checked);
    return nodeModel;
  });
  return model;
}
selectorHelperTrigger.addEventListener("click",e=>{
  var isActive = selectorHelperView.classList.toggle("show");
  if(isActive){
    shtModel = newShtModel(model.currentSelector);
    selectorHelperTrigger.src = "/modules/tilepieces/stylesheet/svg-close.svg"
    sht.set("",shtModel);
    cssInspectorView.style.display="none"
  }
  else{
    selectorHelperTrigger.src = "/modules/tilepieces/stylesheet/svg-summary.svg"
    if(cssInspectorView.style.display=="none")
      cssInspectorView.removeAttribute("style")
  }
})
let sht = new opener.TT(selectorHelperTemplate, shtModel);
selectorHelperView.addEventListener("change",e=>{
  var t = e.target;
  var index = t.dataset.index || 0;
  var node = shtModel.nodes[+index];
  var isClass = t.dataset.bind == "node.classes.checked";
  var isAttrs = t.dataset.bind == "node.attributes.checked";
  var closestClass = t.closest("[data-if='node.classes.value.length']");
  var closestAttr = t.closest("[data-if='node.attributes.value.length']");
  var valued = false;
  if(isClass || isAttrs){
    isClass && node.classes.value.forEach(v=>v.checked = t.checked);
    isAttrs && node.attributes.value.forEach(v=>v.checked = t.checked);
    valued = true;
  }
  if(closestClass &&
    node.classes.value.length == 1) {
    node.classes.checked = t.checked;
    valued = true;
  }
  if(closestAttr &&
    node.attributes.value.length == 1) {
    node.attributes.checked = t.checked;
    valued = true;
  }
  if(valued){
    sht.set("",shtModel);
    updateSelector();
  }
})
function updateSelector(){
  model.currentSelector = shtModel.nodes.slice(0).reverse().reduce((acc,v,i)=>{
    var tagName = v.tagName.checked ? v.tagName.value : "";
    var id = v.id.checked ? v.id.value : "";
    var classes = v.classes.value.map(c=>c.checked ? c.value : "").join("");
    var attributes = v.attributes.value.map(c=>c.checked ? c.value : "").join("");
    var sel = `${tagName}${id}${classes}${attributes}`
    if(i > 0 && sel) sel = " " + sel;
    return sel ? acc + sel : acc;
  },"")
  selectorUpdate();
}
selectorHelperTemplate.addEventListener("template-digest",updateSelector)
})();