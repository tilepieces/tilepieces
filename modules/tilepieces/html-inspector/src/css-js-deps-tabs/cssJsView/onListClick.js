function onListClick(DOMlist, tooltip, handleTooltipFunction) {
  DOMlist.addEventListener("click", e => {
    var li = e.target.closest("li");
    if (!li) return;
    var multiSelected = app.multiselected;
    // activate tooltip
    if (e.target.closest(".menu-toggle")) {
      if (multiSelected && selectedJsCSS != li)
        selectedJsCSS = li;
      if (tooltip.style.display != "block")
        handleTooltipFunction(li, e);
      return;
    }
    if (e.target.closest(".menu-toggle-wrapper"))
      return;
    if (li.classList.contains("not-match")) return;
    var multiSelectionIndex = multiSelectionJsCss.findIndex(v => v.listEl == li);
    if (selectedJsCSS && selectedJsCSS == li) {
      if (multiSelected) {
        multiSelectionJsCss.splice(multiSelectionIndex, 1);
        li.classList.remove("html-tree-builder__highlight");
        selectedJsCSS = multiSelectionJsCss.length ? multiSelectionJsCss[multiSelectionJsCss.length - 1] : null;
      }
      return;
    } else if (multiSelectionIndex > -1) {
      multiSelectionJsCss.splice(multiSelectionIndex, 1);
      li.classList.remove("html-tree-builder__highlight");
      return;
    }
    li.classList.add("html-tree-builder__highlight");
    var treeBuilderElement = li.querySelector(".html-tree-builder__tag");
    var toggleWrapper = li.querySelector(".menu-toggle-wrapper");
    toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
    multiSelected && multiSelectionJsCss.push({listEl: li, el: li["__html-tree-builder-el"]});
    selectedJsCSS &&
    selectedJsCSS instanceof HTMLElement &&
    selectedJsCSS != li &&
    !multiSelected &&
    selectedJsCSS.classList.remove("html-tree-builder__highlight");
    selectedJsCSS = li;
    var DOMelement = li["__html-tree-builder-el"];
    selectedJsCSSMatch = app.core.htmlMatch.find(DOMelement);
    app.core.selectElement(DOMelement, selectedJsCSSMatch);
  });
}