function cssJsKeyDown(DOMlist) {
  DOMlist.addEventListener("keydown", e => {
    if (e.key == "Delete" && selectedJsCSS) {
      autoInsertionJsCss = true;
      if (treeBuilder.multiselection)
        multiSelectionJsCss.forEach(mc => delEl(mc.el, mc.listEl, false));
      else
        delEl(selectedJsCSS["__html-tree-builder-el"], selectedJsCSS, false);
      selectedJsCSS = null;
      selected = null;
      app.core.deselectElement();
    }
  });
}