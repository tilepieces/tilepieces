const opener = window.opener || window.parent;
const app = opener.tilepieces;
window.cssDefaults = app.cssDefaultValues;
const ftWysiwyg = opener.ftWysiwyg;
const appView = document.getElementById("transform");
let model = {
  isVisible: false,
  functions: [],
  transformNewType: "translate(0px,0px)"
};
let t = new opener.TT(appView, model);
autocomplete(appView);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
tilepieces_tabs({
  el: document.getElementById("transform-tabs")
});
/*
appView.addEventListener("change",e=>{
    if(e.target.classList.contains("selector")) // TODO
        return;
    if(!e.target.hasAttribute("data-css-prop"))
        return;
    setCss(e.target.dataset.cssProp,e.target.value)
});
appView.addEventListener("input",e=>{
    if(!e.target.hasAttribute("data-css-prop"))
        return;
    setCss(e.target.dataset.cssProp,e.target.textContent);
    if(e.target.dataset.cssProp == "transform"){
        model.functions = matchTransformFunctions(e.target.textContent).reverse();
        t.set("functions",model.functions);
        inputCss(appView);
    }
});*/
/*
appView.addEventListener("input",e=>{
    if(e.target.dataset.type != "transform-function")
        return;
    model.functions[Number(e.target.dataset.index)].value = e.target.textContent.trim();
    var transform = model.functions.map(v=>v.name+"("+v.value+")").reverse().join(" ");
    setCss("transform",transform);
    t.set("transform",transform);
    inputCss(appView);
});*/

