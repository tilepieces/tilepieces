(()=>{
const opener = window.opener || window.parent;
const appView = document.getElementById("css-viewer");
const app = opener.tilepieces;
// the same in cssMatcher
const mainPseudoRegex = /(:{1,2}before|:{1,2}after|:{1,2}first-letter|:{1,2}first-line|::[a-z-]+)(?=$|,)/;
// the same in cssMatcher
const PSEUDOSTATES = /(:hover|:active|:focus|:focus-within|:visited|:focus-visible|:target)(?=$|:|\s|,)/;
const replacePseudos = new RegExp(mainPseudoRegex.source + "|" + PSEUDOSTATES.source, "g");
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
  app.elementSelected &&
  app.elementSelected.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}))
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
  app.elementSelected &&
  app.elementSelected.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
});

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
appView.addEventListener("currentSelector", e => {
  // see above
  if (e.detail.type != "blur")
    return;
  if (!model.selectorMatch) {
    model.currentSelector = app.cssSelector;
    model.selectorMatch = true;
  } else {
    model.currentSelector = model.currentSelector.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
    app.cssSelector = model.currentSelector;
  }
  t.set("", model);
});
appView.addEventListener("keydown", e => {
  if (e.target.dataset.bind == "currentSelector") {
    if (e.key == "Enter")
      e.preventDefault();
  }
});
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

})();