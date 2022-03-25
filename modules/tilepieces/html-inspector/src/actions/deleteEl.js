function delEl(t, s, autoInsertion = true) {
  isAutoInsertionFlag = autoInsertion;
  app.core.htmlMatch.removeChild(t);
  s.parentNode.removeChild(s);
}

function deleteEl() {
  if (treeBuilder.multiselection) {
    /*
    treeBuilder.multiselected.forEach(n=>{
        delEl(n.el,n.listEl);
    });
    treeBuilder.removeMultiSelection();
    app.destroyMultiselection();
   */
    treeBuilder.multiselected.forEach(n => {
      delEl(n.el, n.listEl);
    });
    multiselectButton.click();
  } else
    delEl(selected["__html-tree-builder-el"], selected);
  selected = null;
  app.core.deselectElement();
}