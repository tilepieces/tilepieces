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
