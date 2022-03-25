const opener = window.opener || window.parent;
const app = opener.tilepieces;
let d; // cached detail
let selectedAnimation = null;
let selectedKeyframe = null;
window.cssDefaults = app.cssDefaultValues;
const appView = document.getElementById("animations");
let newAnimationButton = appView.querySelector("#new-animation");
/*
let deleteAnimationButton = appView.querySelector("#delete-animation");
let newKeyframeButton=appView.querySelector("#new-keyframe");
let deleteKeyframe=appView.querySelector("#delete-keyframe");
*/
let model = {
  cssDefaultProperties: app.cssDefaultProperties,
  isVisible: false,
  animations: []
};
let t = new opener.TT(appView, model, {
  templates: [{
    name: "css-properties-list",
    el: document.getElementById("css-properties-list").content
  }]
});
css_rule_modification({
  tilepiecesTemplate: t,
  tilepiecesTemplateModel: model,
  appView
});
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
window.debugModel = model;