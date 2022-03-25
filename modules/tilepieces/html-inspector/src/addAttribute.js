function addAttribute() {
  var attributes = [...selected.children[0].children].find(v => v.classList.contains("html-tree-builder-attributes"));
  if (!attributes) {
    var pivot = selected.querySelector(".html-tree-builer__tag-span");
    attributes = document.createElement("span");
    attributes.className = "html-tree-builder-attributes";
    selected.insertBefore(attributes, pivot.nextSibling);
  }
  attributes.classList.remove("no-pad");
  var newAttrsSpan = document.createElement("span");
  newAttrsSpan.className = "new-attr-span";
  newAttrsSpan.setAttribute("spellcheck", "false");
  newAttrsSpan.setAttribute("contenteditable", "");
  attributes.appendChild(newAttrsSpan);
  newAttrsSpan.addEventListener("blur", addAttributeValidation);
  newAttrsSpan.addEventListener("paste", onAttrPaste);
  newAttrsSpan.addEventListener("keydown", attributeKeyDown);
  newAttrsSpan.focus();
}
