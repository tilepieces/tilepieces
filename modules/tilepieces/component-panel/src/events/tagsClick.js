buttons.forEach(b => {
  var tagName = b.textContent.trim();
  var node = null;
  if (b.hasAttribute("data-component") && templates[tagName])
    node = templates[tagName].cloneNode(true);
  if (tagName.match(app.utils.phrasingTags))
    opener.wysiwyg.buttonTextLevelTag(b,
      tagName,
      tagName == "A" ? [{name: "href", value: "#"}] : [], node);
  b.addEventListener("click", e => {
    var elementSelected = app.elementSelected.nodeType != 1 ? app.elementSelected.parentNode : app.elementSelected;
    if (app.contenteditable || !elementSelected)
      return;
    if (elementSelected.closest("head"))
      return;
    var elWhereInsert = elementSelected.nodeName == "HTML" ?
      elementSelected.ownerDocument.body : app.elementSelected;

    var insertionMode = app.insertionMode;

    var newEl = node ? node.cloneNode(true) :
      elementSelected.getRootNode().createElement(tagName);
    var toDispatch = node ? newEl.children[0] : newEl;
    if (!tagName.match(app.utils.notEditableTags) && !node)
      newEl.innerHTML = "This is a " + tagName + " tag";
    tagName == "A" && newEl.setAttribute("href", "#");
    app.core.htmlMatch.insertAdjacentElement(elWhereInsert, insertionMode, newEl);
    //app.core.selectElement(toDispatch);
    //toDispatch.dispatchEvent(new PointerEvent("pointerdown",{bubbles: true}));
  })
});
