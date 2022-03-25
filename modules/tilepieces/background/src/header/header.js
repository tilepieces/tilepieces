const opener = window.opener || window.parent;
let app = opener.tilepieces;
window.cssDefaults = app.cssDefaultValues;
let gradientIsChanging;
const appView = document.getElementById("background-box");
const addBackgroundButton = appView.querySelector("#add-background");
const urlPlaceholder = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)";
appView.addEventListener("click", e => {
  if (e.target.classList.contains("tab-link"))
    changeTab(e);
  if (e.target.classList.contains("remove-background"))
    removeBackground(e);
});
addBackgroundButton.addEventListener("click", addBackground);
let gradientsEls = [];
//opener.addEventListener("WYSIWYG-el-parsed", setTemplate);
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
let model = {
  isVisible: false,
  backgrounds: [],
  tabActive: 0
};
let t = new opener.TT(appView, model, {
  templates: [{
    name: "gradient-template",
    el: document.getElementById("gradient-template").content
  }]
});
autocomplete(appView);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});

tilepieces_tabs({
  el: document.getElementById("background-tabs"),
  noAction: true
});
function parsingImageUrl(url){
  if(url.startsWith("data:image") || url.match(app.utils.URLIsAbsolute))
      return url;
  if(url.startsWith("/"))
    return app.utils.getResourceAbsolutePath(url);
  return new URL(url,model.backgroundImageBase).href
}