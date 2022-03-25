function activateAttributeContentEditable(attributeSpan, target) {
  var sel = overlay.ownerDocument.defaultView.getSelection();
  var range = sel.anchorNode ? sel.getRangeAt(0) : overlay.ownerDocument.createRange();
  attributeSpan.setAttribute("contenteditable", "");
  attributeSpan.addEventListener("blur", addAttributeValidation);
  attributeSpan.addEventListener("paste", onAttrPaste);
  attributeSpan.addEventListener("keydown", attributeKeyDown);
  attributeSpan.focus();
  setTimeout(() => {
    sel.removeAllRanges();
    range.selectNodeContents(target);
    sel.addRange(range);
  })
}

function activateTextNodeContentEditable() {
  var s = selected.querySelector(".html-tree-builder-node-value");
  s.setAttribute("contenteditable", "");
  s.addEventListener("blur", changeText);
  s.addEventListener("paste", onAttrPaste);
  s.addEventListener("keydown", e => e.key == "Enter" && s.blur());
  s.focus();
}