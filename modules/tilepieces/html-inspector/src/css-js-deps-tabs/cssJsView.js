function cssJsView(tagSelector, DOMContainer, DOMlist) {
  var tags = app.core.currentDocument.querySelectorAll(tagSelector);
  DOMlist.innerHTML = "";
  var frag = DOMContainer.ownerDocument.createDocumentFragment();
  var updateSelectCss;
  [...tags].forEach(obj => {
    treeBuilder.treeBuilder(obj, frag, DOMContainer);
    var el = frag.lastElementChild;
    var elMatch = app.core.htmlMatch.find(el["__html-tree-builder-el"]);
    if (!elMatch)
      el.classList.add("not-match");
    if (multiSelectionJsCss) {
      var findInMultiSelection = multiSelectionJsCss.find(v => v.el == obj);
      if (findInMultiSelection) {
        findInMultiSelection.listEl = el;
        el.classList.add("html-tree-builder__highlight");
      }
    }
    if (selectedJsCSS && selectedJsCSS["__html-tree-builder-el"] == el["__html-tree-builder-el"]) {
      selectedJsCSS = el;
      el.classList.add("html-tree-builder__highlight");
      app.core.selectElement(el["__html-tree-builder-el"]);
      //app.elementSelected = el["__html-tree-builder-el"];
    }
  });
  DOMlist.appendChild(frag);
  /*
    updateSelectCss && updateSelectCss.click();
    if(!updateSelectCss && selectedJsCSS)
        selectedJsCSS = null;
        */
}