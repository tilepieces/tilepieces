function onKeyDown(e) {
  if (!e.target)
    return;
  if (e.target.closest("[contenteditable]"))
    return;
  if (e.target.closest(".CodeMirror"))
    return;
  if (tooltipEl.contains(e.target)) {
    tooltipKeyEvents(e);
    return;
  }
  var multiselection = treeBuilder.multiselection;
  if (e.key == "ArrowUp") {
    e.preventDefault();
    if (multiselection)
      multiselectButton.click();
    var previous = selected && (selected.previousElementSibling ||
      (selected.parentNode && selected.parentNode.closest("li")));
    if (previous) {
      if (!isElementInViewport(previous))
        previous.scrollIntoView();
      previous.click();
    }
  }
  if (e.key == "ArrowDown") {
    e.preventDefault();
    if (multiselection)
      multiselectButton.click();
    var next;
    if (selected) {
      if (selected.nextElementSibling) next = selected.nextElementSibling;
      else {
        var hasChildrenOpen = selected.querySelector("li");
        if (hasChildrenOpen)
          next = hasChildrenOpen;
        else {
          var closest = selected.closest("li");
          next = closest && closest.nextElementSibling
        }
      }
    }
    if (next) {
      if (!isElementInViewport(next))
        next.scrollIntoView();
      next.click();
    }
    return;
  }
  if ((e.key == "ArrowLeft" || e.key == "ArrowRight") && selected)
    treeBuilder.openTree({target: selected});
  if (!selectedIsMatch)
    return;
  if (e.key == "Delete" && selected) {
    deleteEl();
    return;
  }
  if (selected && e.key == "Enter") {
    var isMenuToggle = e.target.closest(".menu-toggle");
    if (isMenuToggle)
      return;
    if (e.target.classList.contains("html-tree-builder-attribute") ||
      e.target.classList.contains("html-tree-builder-node-value"))
      return;
    e.preventDefault();
    var attr = selected.querySelector(".html-tree-builder-attribute");
    if (attr && attr.parentNode.parentNode == selected && selectedIsMatch.attributes) {
      var span = attr.querySelector(".attribute-value") || attr.querySelector(".attribute-key");
      activateAttributeContentEditable(attr, span);
      return;
    }
    // text
    if (selected["__html-tree-builder-el"].nodeType == 3 && selectedIsMatch.HTML) {
      activateTextNodeContentEditable();
      return;
    }
  }
  if (e.ctrlKey||e.metaKey) {
    switch (e.key) {
      case "c":
      case "C":
        e.preventDefault();
        selected && copyEl();
        break;
      case "x":
      case "X":
        e.preventDefault();
        selected && cutEl();
        break;
      case "v":
      case "V":
        e.preventDefault();
        if (!cut && !copy)
          return;
        selected && pasteEl();
        break;
    }
  }
}