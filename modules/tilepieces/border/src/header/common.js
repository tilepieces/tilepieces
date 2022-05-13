const opener = window.opener || window.parent;
const app = opener.tilepieces;
window.cssDefaults = opener.tilepieces.cssDefaultValues;
const appView = document.getElementById("border-style");
const urlPlaceholder = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)";
const gradientEl = appView.querySelector(".gradient");
let gradientObject = gradientView(gradientEl);
let shadows = [];
let model = {
  isVisible: false,
  boxShadows: []
};
let t = new opener.TT(appView, model);
autocomplete(appView);
if (opener.tilepieces.elementSelected)
  setTemplate({detail: opener.tilepieces.cssSelectorObj});
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
tilepieces_tabs({
  el: document.getElementById("tab-border")
});
function parsingImageUrl(url){
  if(url.startsWith("data:image") || url.match(app.utils.URLIsAbsolute))
    return url;
  if(url.startsWith("/"))
    return app.utils.getResourceAbsolutePath(url);
  return new URL(url,model.backgroundImageBase).href
}