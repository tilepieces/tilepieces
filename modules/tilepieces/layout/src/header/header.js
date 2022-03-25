const opener = window.opener || window.parent;
let app = opener.tilepieces;
window.cssDefaults = app.cssDefaultValues;
const appView = document.getElementById("layout-box");
var model = {
  hideClass: "hide",
  gridAreasTemplate: [],
  positionLinked: "selected",
  borderLinked: "selected",
  marginLinked: "selected",
  paddingLinked: "selected"
};
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("", {isVisible: false});
});
opener.addEventListener("frame-unload", e => {
  t.set("", {isVisible: false});
});
autocomplete(appView);
let t = new opener.TT(appView, model);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});

tilepieces_tabs({
  el: document.getElementById("tab-layout")
})
