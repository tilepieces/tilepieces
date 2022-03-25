multiselectButton.addEventListener("click", e => {
  if (multiselectButton.classList.toggle("selected")) {
    if (selected && (!selectedIsMatch || selected.nodeName.match(/(HTML|HEAD|BODY)$/))) {
      //treeBuilder.deSelect();
      app.core.deselectElement();
      selected = null;
    }
    treeBuilder.activateMultiSelection();
    app.enableMultiselection();
    if ((jsViewDOM.style.display == "block" || cssViewDOM.style.display == "block")
      && selectedJsCSS)
      multiSelectionJsCss.push({listEl: selectedJsCSS, el: selectedJsCSS["__html-tree-builder-el"]})
  } else {
    //treeBuilder.removeMultiSelection();
    //internalMultiremove = true;
    app.destroyMultiselection();
    treeBuilder.removeMultiSelection();
    multiSelectionJsCss.forEach(v => v != selectedJsCSS &&
      v.listEl.classList.remove("html-tree-builder__highlight"));
    multiSelectionJsCss = [];
  }
});
window.addEventListener("beforeunload", e => {
  if (app.multiselected)
    app.destroyMultiselection();
});