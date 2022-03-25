tooltipEl.addEventListener("click", e => {
  var target = e.target.closest("[data-name]");
  if (!target)
    return;
  var nameAction = target.dataset.name;
  if (!nameAction)
    return;
  switch (nameAction) {
    case "add-attribute":
      addAttribute();
      break;
    case "edit-attribute":
      dblclick({target: attributeSelected});
      break;
    case "edit-inner-html":
      editInnerHtml();
      break;
    case "edit-outer-html":
      editOuterHtml();
      break;
    case "delete-element":
      deleteEl();
      break;
    case "cut-element":
      cutEl();
      break;
    case "copy-element":
      copyEl();
      break;
    case "paste-element":
      pasteEl();
      break;
    case "expand-recursively":
      treeBuilder.expandRecursively();
      overlay.scrollTop = selected.offsetTop;
      break;
    case "collapse-children":
      treeBuilder.collapseChildren();
      break;
    case "scroll-into-view":
      selected["__html-tree-builder-el"].scrollIntoView(false);
      break;
    case "set-as-current-stylesheet":
      app.core.setCurrentStyleSheet(selected["__html-tree-builder-el"]);
      break;
    case "save":
      saveStylesheet();
  }
  tooltipEl.style.display = "none";
});