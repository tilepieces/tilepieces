window.addEventListener("resize",e=>{
  var highlights = document.querySelectorAll(".html-tree-builder__highlight");
  highlights.forEach(h=>{
    var treeBuilderElement = h.querySelector(".html-tree-builder__tag");
    var toggleWrapper = h.querySelector(".menu-toggle-wrapper");
    toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
  })
});