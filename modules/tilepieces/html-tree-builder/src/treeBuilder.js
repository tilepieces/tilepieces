function treeBuilder(el, whereAppend, t) {
  // document case
  /*
   if (el.nodeName == '#document')
   return createDocumentRoot(el);
   */
  var target = t || htmlTreeBuilderTarget;
  var doc = target.ownerDocument;
  var html = doc.createDocumentFragment();
  //exclude comments and empty text fragments
  if (!showEmptyNodes) {
    if (el.nodeName == "#text" && !el.nodeValue.trim().length)
      return html;
  }
  var li = doc.createElement("li");
  var div = doc.createElement("div");
  div.className = "html-tree-builder__tag";
  if (el.nodeName != "#text" && el.nodeName != "#comment")
    div.innerHTML = createElementRepresentation(el);
  else if (el.nodeName == "#text" && el.nodeValue.trim().length)
    div.innerHTML = "<span class='html-tree-builder-node-value' spellcheck='false'>" +
      escapeHtml(el.nodeValue) + "</span>";
  else if (el.nodeName == "#text")
    div.innerHTML = "<span><i><small>empty node</small></i></span>";
  else if (el.nodeName == "#comment")
    div.innerHTML = "<span class='html-tree-builder-comment' spellcheck='false'>" +
      escapeHtml(el.nodeValue) + "</span>";
  li.appendChild(div);
  // create caret if childNodes or is an iframe
  if (el.childNodes.length || el.nodeName == "IFRAME") {
    var caret = doc.createElement("span");
    caret.className = "html-tree-builder__caret";
    div.appendChild(caret)
  }
  // add a css class to represent the closure tag
  // css ::after reads from dataset the tag name ( only when closed)
  if (el.tagName && !el.tagName.match(voidElementsRegex)) {
    div.dataset.tagName = "</" + el.tagName.toLowerCase() + ">";
    div.className += " html-tree-builder-element";
    var spanClose = doc.createElement("span");
    spanClose.className = "span-close";
    spanClose.textContent = "</" + el.tagName.toLowerCase() + ">";
    li.appendChild(spanClose);
  }
  li.classList.add("html-tree-builder-el");
  li["__html-tree-builder-el"] = el;
  createMenuToggler(div,el.tagName?.match(/^(HEAD|BODY|HTML)$/));
  html.appendChild(li);
  whereAppend.appendChild(html);
  return li;
}