let selectedTab = null;
[...menuBarTabs].forEach(mbt => mbt.addEventListener("click", e => {
  var target = e.target;
  var doc = target.getRootNode();
  var isSelected = target.classList.toggle("selected");
  if (selectedTab && selectedTab != target) {
    selectedTab.classList.remove("selected");
    doc.querySelector(selectedTab.getAttribute("href")).style.display = "none";
  }
  var cacheSel = selectedJsCSS && selectedJsCSS["__html-tree-builder-el"];
  multiSelectionJsCss = [];
  selectedJsCSS = null;
  var href = e.target.getAttribute("href");
  if (isSelected) {
    if (app.multiselected) {
      app.multiselections.slice(0).forEach((v, i) => {
        internalMultiremove = true;
        app.removeItemSelected()
      });
      treeBuilder.removeMultiSelection();
    } else
      app.core.deselectElement();
    if (searchTrigger.classList.contains("opened"))
      searchTrigger.click();
    selectedTab = e.target;
    doc.querySelector(href).style.display = "block";
    overlay.style.display = "none";
    switch (href) {
      case "#css-view":
        cssJsView("link[rel=stylesheet],style", cssViewDOM, cssViewDOMList);
        break;
      case "#js-view":
        cssJsView("script", jsViewDOM, jsViewDOMList);
    }
  } else {
    if (app.multiselected) {
      app.multiselections.slice(0).forEach((v, i) => {
        internalMultiremove = true;
        app.removeItemSelected()
      });
      treeBuilder.activateMultiSelection();
    }
    selectedTab = null;
    doc.querySelector(href).style.display = "none";
    overlay.style.display = "block";
    if (!app.elementSelected || app.elementSelected != cacheSel)
      app.core.currentDocument.documentElement.contains(cacheSel) &&
      app.core.selectElement(cacheSel)
    else if (cacheSel) {
      selected = treeBuilder.highlightElement(cacheSel);
      toMatch();
    }
  }
}));