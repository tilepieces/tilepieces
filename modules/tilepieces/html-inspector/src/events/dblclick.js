function dblclick(e) {
  if (!selected || !selected.contains(e.target))
    return;
  if (!selectedIsMatch)
    return;
  //var found = app.core.htmlMatch.find(selected["__html-tree-builder-el"]);
  /*
  (!found) // no match
      return;
   */
  // attributes
  var sp = e.target.closest(".html-tree-builder-attribute");
  if (sp && selectedIsMatch.attributes) {
    var tg = e.target != sp ?
      e.target :
      sp.querySelector(".attribute-value") || sp.querySelector(".attribute-key");
    activateAttributeContentEditable(sp, tg);
  }
  // text
  if (selected["__html-tree-builder-el"].nodeType == 3 && selectedIsMatch.HTML) {
    activateTextNodeContentEditable();
  }
}