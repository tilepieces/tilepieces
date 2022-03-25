function attributeKeyDown(e) {
  var attributeSpan = e.target;
  if (e.key == "Enter") {
    attributeSpan.blur();
    return;
  }
  if (e.key == "Tab" &&
    attributeSpan.nextElementSibling &&
    attributeSpan.nextElementSibling.classList.contains("html-tree-builder-attribute")) {
    e.preventDefault();
    var attr = attributeSpan.nextElementSibling;
    var span = attr.querySelector(".attribute-value") || attr.querySelector(".attribute-key");
    attributeSpan.blur();
    activateAttributeContentEditable(attr, span);
  }
}