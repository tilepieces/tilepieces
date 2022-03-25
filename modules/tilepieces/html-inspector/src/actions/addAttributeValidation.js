function addAttributeValidation(e) {
  e.target.removeEventListener("blur", addAttributeValidation);
  e.target.removeEventListener("paste", onAttrPaste);
  e.target.removeEventListener("keydown", attributeKeyDown);
  var newFakeEl = document.createElement("fake");
  var s = e.target.closest("li");
  var attributes = s.querySelector(".html-tree-builder-attributes");
  var el = s["__html-tree-builder-el"];
  newFakeEl.innerHTML = "<span " + attributes.innerText + "></span>"
  while (el.attributes.length) {
    isAutoInsertionFlag = true;
    app.core.htmlMatch.removeAttribute(el, el.attributes[0].nodeName)
  }
  newFakeEl.firstChild && ([...newFakeEl.firstChild.attributes]).forEach(v => {
    var name = v.name.trim().replace(/\u00A0/, " ");
    if (!name)
      return;
    var value = v.value.trim().replace(/\u00A0/, " ");
    isAutoInsertionFlag = true;
    try {
      app.core.htmlMatch.setAttribute(el, name, value);
    } catch (e) {
      console.error(e)
    }
  });
  attributes.outerHTML = treeBuilder.createAttributes(el.attributes);
}