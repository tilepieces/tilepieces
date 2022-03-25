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