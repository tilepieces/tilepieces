(()=>{
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


function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = app.core.setCss(target, name, value);
  console.log("setcss name,value", name, value, setCss);
  console.log("setcss", setCss);
  return setCss;
}
function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  var properties = d.cssRules.properties;
  model.elementPresent = d.target;
  model.transform = properties.transform ? properties.transform.value : d.styles.transform;
  model.transformOrigin = properties["transform-origin"] ? properties["transform-origin"].value :
    d.styles.transformOrigin;
  model.transformStyle = properties["transform-style"] ? properties["transform-style"].value :
    d.styles.transformStyle;
  model.perspective = properties.perspective ? properties.perspective.value : d.styles.perspective;
  model.perspectiveOrigin = properties["perspective-origin"] ? properties["perspective-origin"].value :
    d.styles.perspectiveOrigin;
  model.functions = matchTransformFunctions(model.transform).reverse()
    .map((v, i) => {
      v.index = i;
      return v
    });
  model.isVisible = true;
  t.set("", model);
  inputCss(appView);
}
let tabSelected = document.getElementById("general-transform");
// tabs
let tabsLinks = appView.querySelectorAll(".tab-component-buttons span");
[...tabsLinks].forEach(tabLink => tabLink.addEventListener("click", e => {
  e.preventDefault();
  if (e.target.classList.contains("selected"))
    return;
  e.target.parentNode.querySelector(".selected").classList.remove("selected");
  e.target.classList.add("selected");
  var tabIdToSelect = e.target.dataset.href;
  var newTabSelected = document.getElementById(tabIdToSelect);
  tabSelected.style.display = "none";
  newTabSelected.style.display = "block";
  tabSelected = newTabSelected;
}));
function matchTransformFunctions(string) {
  var m;
  var tokens = [];
  var index = 0;
  while (string && (m = string.match(/([a-zA-Z0-9]+)\([^)]*\)/))) {
    var token = {
      name: m[1],
      value: m[0].replace(m[1] + "(", "").replace(")", ""),
      index
    };
    tokens.push(token);
    string = string.substring(m.index + m[1].length);
    index++;
  }
  return tokens;
}
appView.addEventListener("click", e => {
  if (e.target.classList.contains("remove-function")) {
    model.functions.splice(+e.target.dataset.index, 1);
    var transform = model.functions.length ?
      model.functions.map(v => v.name + "(" + v.value + ")").reverse().join(" ") : "none";
    model.transform = setCss("transform", transform);
    //model.elementPresent.click();
    t.set("", model);
  }
  if (e.target.classList.contains("add-function")) {
    var newToken = matchTransformFunctions(model.transformNewType);
    newToken[0].index = model.functions.length;
    t.set("functions", model.functions.concat(newToken));
    inputCss(appView);
  }
})
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
appView.addEventListener("input", e => {
  var target = e.target;
  if (!target.classList.contains("input-css"))
    return;
  var prop = target.dataset.cssProp;
  if (prop) {
    var value = target.innerText;
    var newSetted = setCss(prop, value);
  }
}, true);
appView.addEventListener("input", e => {
  if (e.target.dataset.type != "transform-function")
    return;
  model.functions[+e.target.dataset.index].value = e.target.textContent.trim();
  var transform = model.functions.map(v => v.name + "(" + v.value + ")").reverse().join(" ");
  setCss("transform", transform);
  //t.set("transform",transform);
  //inputCss(appView);
});
appView.addEventListener("blur", e => {
  if (e.target.dataset.type != "transform-function")
    return;
  //model.functions[Number(e.target.dataset.index)].value = e.target.textContent.trim();
  //var transform = model.functions.map(v=>v.name+"("+v.value+")").reverse().join(" ");
  //setCss("transform",transform);
  //t.set("transform",transform);
  //inputCss(appView);
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
var dragList = __dragList(appView, {
  noDrop: true,
  handlerSelector: ".handler"
});
dragList.on("move", moveObj => {
  var targetIndex = moveObj.target[0].dataset.index;
  var newIndex = (moveObj.prev && moveObj.prev.dataset.index) || 0;
  var swap = model.functions[targetIndex];
  model.functions.splice(+targetIndex, 1);
  model.functions.splice(+newIndex, 0, swap);
  model.functions.forEach((v,i)=>v.index = i);
  var transform = model.functions.map(v => v.name + "(" + v.value + ")").reverse().join(" ");
  setCss("transform", transform);
  t.set("transform", transform);
  inputCss(appView);
});

})();