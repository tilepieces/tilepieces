const opener = window.opener || window.parent || window;
const openerParent = opener.opener || opener.parent || opener;
const app = openerParent.tilepieces;
const updateAll = document.getElementById("update-all");
const updateCurrentHtml = document.getElementById("update-current-html");
const fetchPanelTemplate = async ()=>{
  var template = await fetch("html/panel.html").then(res=>res.text());
  var parser = new DOMParser();
  var doc = parser.parseFromString(template, "text/html");
  var panel = doc.querySelector(".panel-element");
  return panel
}
const setPanelData = (panelEl,panelElNew)=>{
  if(panelEl.id)
    panelElNew.id = panelEl.id;
  var panelHandler = panelEl.querySelector(".panel-handler")
  var styleHandler = panelHandler.getAttribute("style");
  if(styleHandler){
    panelElNew.querySelector(".panel-handler").setAttribute("style",style);
  }
  if(panelEl.dataset.altPopup)
    panelElNew.dataset.altPopup= panelEl.dataset.altPopup
  else
    panelElNew.removeAttribute("data-alt-popup");
  var panelIcon = panelEl.querySelector(".panel-handler-ico svg");
  if(panelIcon)
    panelElNew.querySelector(".panel-handler-ico svg").replaceWith(panelIcon);
  var panelTitle = panelEl.querySelector(".panel-title")?.textContent;
  if(panelTitle)
    panelElNew.querySelector(".panel-title").textContent = panelTitle;
  var panelFrameSrc = panelEl.querySelector("iframe")?.src
  if(panelFrameSrc)
    panelElNew.querySelector("iframe").src = panelFrameSrc;
  var panelFrameDataSrc = panelEl.querySelector("iframe")?.dataset.src;
  if(panelFrameDataSrc)
    panelElNew.querySelector("iframe").dataset.src = panelFrameDataSrc;
  else
    panelElNew.removeAttribute("data-src")
  if(panelEl.hasAttribute(app.componentAttribute))
    panelElNew.setAttribute(app.componentAttribute,panelEl.getAttribute(app.componentAttribute))
}
updateCurrentHtml.addEventListener("click",async e=>{
  var panel = app.elementSelected.closest(".panel-element");
  if(!panel){
    console.error("[panel element interface can't find .panel-element]");
    return;
  }
  try {
    var panelTemplate = await fetchPanelTemplate();
  }
  catch(e){
    console.error(e);
    return;
  }
  var match = app.core.htmlMatch.find(panel);
  if(!match)
    return;
  setPanelData(match.match,panelTemplate);
  app.core.htmlMatch.replaceWith(panel,panelTemplate)
  app.core.selectElement(panelTemplate);
});
updateAll.addEventListener("click",async e=>{
  try {
    var panelTemplate = await fetchPanelTemplate();
  }
  catch(e){
    console.error(e);
    return;
  }
  var panels = app.core.currentDocument.querySelectorAll(".panel-element");
  panels.forEach(p=>{
    var match = app.core.htmlMatch.find(p);
    if(!match)
        return;
    var panelTemplateClone = panelTemplate.cloneNode(true);
    setPanelData(match.match,panelTemplateClone);
    try {
      app.core.htmlMatch.replaceWith(p, panelTemplateClone)
    }
    catch(e){
      console.error("[panel-element interface error]",e)
    }
  })
});