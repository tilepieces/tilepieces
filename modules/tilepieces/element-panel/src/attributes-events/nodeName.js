attributesView.addEventListener("nodeName", e => {
  if (app.elementSelected != elementToChange) {
    console.warn("[element panel] returning from nodeName change, because app.elementSelected != elementToChange")
    return;
  }
  var currentElement = app.elementSelected;
  var newNodeName = e.detail.target.value.toUpperCase();
  var composedPath = app.selectorObj.composedPath.slice(1, app.selectorObj.composedPath.length);
  var isNotAdmitted = app.utils.notAdmittedTagNameInPosition(newNodeName, composedPath);
  if (isNotAdmitted) {
    modelAttributes.nodenameinvalid = "";
    attrsTemplate.set("", modelAttributes);
    return;
  }
  // check for all nodes under if they can stay with the new tag.
  var treeWalker = document.createTreeWalker(
    app.elementSelected,
    NodeFilter.SHOW_ELEMENT
  );
  var currentNode = treeWalker.currentNode;
  while (currentNode) {
    if(currentNode !== app.elementSelected){
      var swap = currentNode.parentNode;
      var subComposedPath = [];
      while (swap) {
        subComposedPath.push(swap);
        swap = swap.parentNode;
      }
      if (app.utils.notAdmittedTagNameInPosition(currentNode.tagName, subComposedPath)) {
        modelAttributes.nodenameinvalid = "";
        attrsTemplate.set("", modelAttributes);
        return;
      }
    }
    currentNode = treeWalker.nextNode();
  }
  modelAttributes.nodenameinvalid = "hidden";
  attrsTemplate.set("", modelAttributes);
  var newNode = currentElement.ownerDocument.createElement(newNodeName);
  for (var i = 0, l = currentElement.attributes.length; i < l; ++i) {
    var nodeName = currentElement.attributes.item(i).nodeName;
    var nodeValue = currentElement.attributes.item(i).nodeValue;
    newNode.setAttribute(nodeName, nodeValue);
  }
  [...currentElement.childNodes].forEach(c => newNode.appendChild(c));
  app.core.htmlMatch.replaceWith(currentElement, newNode);
  newNode.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
});
document.getElementById("node-name").addEventListener("blur", e => {
  if (modelAttributes.nodenameinvalid == "") {
    modelAttributes.nodenameinvalid = "hidden";
    modelAttributes.nodeName = app.elementSelected.nodeName;
    attrsTemplate.set("", modelAttributes);
  }
})