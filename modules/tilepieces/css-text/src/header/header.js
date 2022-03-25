const opener = window.opener || window.parent;
let app = opener.tilepieces;
window.app = app;
window.cssDefaults = app.cssDefaultValues;
const appView = document.getElementById("css-text");
let fontAlreadyDeclared = [];
let textShadowEls = [];
const commaToNotTakeInConsideration = /rgb\([^)]*\)|rgba\([^)]*\)|hsl\([^)]*\)|hsla\([^)]*\)/;
const fontFamilyInput = document.getElementById("font-family-input");
var model = {
  isVisible: false,
  textShadows: []
};
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
autocomplete(appView);
let t = new opener.TT(appView, model);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});

tilepieces_tabs({
  el: document.getElementById("tab-css-text")
});
