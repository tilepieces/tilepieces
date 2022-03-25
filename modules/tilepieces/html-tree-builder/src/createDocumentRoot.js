function createDocumentRoot(el) {
  var html = htmlTreeBuilderTarget.ownerDocument.createDocumentFragment();
  // creating doctype
  var documentDeclarationDiv = htmlTreeBuilderTarget.ownerDocument.createElement("div");
  documentDeclarationDiv.className = "html-tree-builder__doctype";
  documentDeclarationDiv.textContent = createDocType(el);
  createMenuToggler(documentDeclarationDiv);
  html.appendChild(documentDeclarationDiv);
  // creating html tag
  var htmlDiv = htmlTreeBuilderTarget.ownerDocument.createElement("div");
  htmlDiv.innerHTML = createElementRepresentation(el.documentElement);
  htmlDiv.className = "html-tree-builder-element html-tree-builder-el";
  htmlDiv["__html-tree-builder-el"] = el.documentElement;
  html.appendChild(htmlDiv);
  // creating head, body
  var headUl = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  headUl.appendChild(treeBuilder(el.head));
  html.appendChild(headUl);
  // creating body tag
  var bodyUl = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  bodyUl.className = "html-tree-builder-body";
  bodyUl.appendChild(treeBuilder(el.body));
  html.appendChild(bodyUl);
  return html;
}