opener.addEventListener('html-tree-builder-click', handleClick);
window.addEventListener('blur', e => {
  tooltipEl.style.display = "none"
});
overlay.addEventListener('keydown', onKeyDown);
overlay.addEventListener('click', e => {
  if (!treeBuilder) // on load, when we open the html and the body.
    return;
  var target = e.target;
  /* toggle tooltip */
  if (tooltipEl.style.display == "block" && !tooltipEl.contains(target)) {
    tooltipEl.style.display = "none";
    return;
  }
  /* activate tooltip */
  var menuToggle = target.closest(".menu-toggle");
  if (!menuToggle)
    return;
  /* multiselection */
  var multiselection = treeBuilder.multiselection;
  if (multiselection) {
    tooltipEl.classList.add("multiselection");
    tooltipHandle({target});
    !tooltipElHide && tooltip(e);
  } else if (selectedIsMatch) {
    tooltipEl.classList.remove("multiselection");
    tooltipHandle({target});
    !tooltipElHide && tooltip(e);
  }
});
overlay.addEventListener("dblclick", dblclick);
overlay.addEventListener("contextmenu", contextMenu);
overlayInner.addEventListener("html-tree-builder-mouseover", e => {
  var target = e.detail.nodeType == 1 ? e.detail : e.detail.parentNode;
  app.highlight = target
});
overlayInner.addEventListener("html-tree-builder-mouseout", e => app.highlight = null);
opener.addEventListener("html-rendered", e => {
  treeBuilder && treeBuilder.destroy();
  overlay.ownerDocument.body.hidden = false;
  treeBuilder = htmlTreeBuilder(overlayInner, e.detail.htmlDocument, htmlTreeBuilderOptions);
  if (app.multiselected)
    treeBuilder.activateMultiSelection();
});
opener.addEventListener("frame-DOM-selected", e => {
  treeBuilder && treeBuilder.highlightElement(e.detail.target);
});
opener.addEventListener("highlight-click", function (e) {
  if (overlay.style.display == "none")
    return;
  if (selected && selected["__html-tree-builder-el"] == e.detail.target)
    return;
  selected = treeBuilder.highlightElement(e.detail.target);
  if (!toMatch(app.selectorObj.match))
    selected.classList.add("not-match");
});
opener.addEventListener("tilepieces-mutation-event", mutation);

// ON READY
function htmlInspectorInit() {
  if (app && app.core && app.core.currentDocument) {
    overlay.ownerDocument.body.hidden = false;
    treeBuilder = htmlTreeBuilder(overlayInner, app.core.currentDocument, htmlTreeBuilderOptions);
    if (app.elementSelected) {
      selected = treeBuilder.highlightElement(app.elementSelected);
      if (!toMatch(app.selectorObj.match))
        selected.classList.add("not-match");
    }
    app.treeBuilder = treeBuilder;
    if (app.multiselected) {
      multiselectButton.classList.add("selected")
      treeBuilder.activateMultiSelection();
    }
  }
  else
    overlay.ownerDocument.body.hidden = true;
}

htmlInspectorInit();
opener.addEventListener("deselect-multielement", e => {
  if (internalMultiremove) {
    internalMultiremove = false;
    console.warn("exit from multiselected", e);
    return;
  }
  var el = e.detail;
  var index = treeBuilder.multiselected.findIndex(v => v.el == el);
  if (index < 0) {
    console.error("[html-inspector] deselect multielement not exists in treeBuilder.multiselected", e);
    return;
  }
  treeBuilder.removeItemSelected(index);
  selected = treeBuilder.selected;
});
opener.addEventListener("html-tree-remove-multiselection", e => {
  internalMultiremove = true;
  selected = treeBuilder.selected;
  var index = app.multiselections.findIndex(v => v.el == e.detail.el);
  if (index < 0) {
    console.error("[html-inspector] deselect multielement not exists in treeBuilder.multiselected", e);
    return;
  }
  app.removeItemSelected(index);
  /*
  app.multiselections.forEach((v,i)=>{
    if(treeBuilder.multiselected[i])
      v.el = treeBuilder.multiselected[i].el
  })*/
});
opener.addEventListener("deselect-element", e => {
  if (!treeBuilder.multiselection) {
    selected = null;
    treeBuilder.deSelect();
  }
});
/*
opener.addEventListener("multiselection-enabled",e=>{
    if(!multiselectButton.classList.contains("selected")){
        treeBuilder.activateMultiSelection();
        app.enableMultiselection();
    }
})
 */
opener.addEventListener("multiselection-canceled", e => {
  if (multiselectButton.classList.contains("selected")) {
    multiselectButton.click();
  }
})

function destroyTreeBuilder() {
  var selectedButtons = overlay.ownerDocument.querySelectorAll(".tab-buttons-inside .selected");
  selectedButtons.forEach(v=>{
    try{
      v.click();
    }
    catch(e){
      console.error(e);
      overlay.ownerDocument.defaultView.location.reload();
    }
  })
  treeBuilder.destroy();
  overlayInner.innerHTML = "";
  overlay.ownerDocument.body.hidden = true;
}

opener.addEventListener("set-project", destroyTreeBuilder);
opener.addEventListener("delete-project", destroyTreeBuilder);
opener.addEventListener("frame-unload",destroyTreeBuilder)

