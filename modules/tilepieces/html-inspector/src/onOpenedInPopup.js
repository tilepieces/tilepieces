window.addEventListener("window-popup-open", e => {
  var newWindow = e.detail.newWindow;
  if (!selected)
    selected = newWindow.document.querySelector(".html-tree-builder__highlight");
  selected && newWindow.scrollTo(0, selected.offsetTop);
  newWindow.addEventListener('blur', e => {
    tooltipEl.style.display = "none";
    cssViewTooltip.style.display = "none";
  });
  newWindow.addEventListener("resize",e=>{
    var highlights = newWindow.document.querySelectorAll(".html-tree-builder__highlight");
    highlights.forEach(h=>{
      var treeBuilderElement = h.querySelector(".html-tree-builder__tag");
      var toggleWrapper = h.querySelector(".menu-toggle-wrapper");
      toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
    })
  });
});
window.addEventListener("window-popup-close", e => {
  //htmlInspectorInit();
  var newWindow = e.detail.panelElementIframe.contentWindow;
  selected && newWindow.scrollTo(0, selected.offsetTop);
});