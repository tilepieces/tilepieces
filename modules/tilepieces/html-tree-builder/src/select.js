function select(el) {
  htmlTreeBuilderTarget.innerHTML = "";
  var ul = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  ul.className = "html-tree-builder";
  ul.appendChild(treeBuilder(el));
  htmlTreeBuilderTarget.appendChild(ul);
  var caret = ul.querySelector(".html-tree-builder__caret");
  caret && openTree({target: caret});
}