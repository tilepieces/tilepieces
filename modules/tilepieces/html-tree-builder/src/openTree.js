function openTree(e) {
  if (!e.target.classList.contains("html-tree-builder__caret"))
    return;
  var doc = htmlTreeBuilderTarget.ownerDocument;
  var win = doc.defaultView;
  e.preventDefault && e.preventDefault(); // this is an exposed method, could be called without an event
  var parent = e.target.closest("li");
  var ul = parent.querySelector("ul");
  if (parent.classList.contains("open")) {
    parent.classList.remove("open");
    ul && ul.remove();
  } else {
    parent.classList.add("open");
    if (!ul) {
      ul = doc.createElement("ul");
      parent.lastElementChild.before(ul);
      var el = parent["__html-tree-builder-el"];
      var attributeIs = el.getAttribute("is");
      if (el.tagName == "IFRAME") {
        var link = doc.createElement("a");
        link.href = "javascript:void(0)";
        link.className = "link-to-iframe";
        link.innerHTML = "<span>" + (el.src || '""') + "</span>";
        ul.append(link);
      } else if (el.shadowRoot || win.customElements.get(el.tagName.toLowerCase()) ||
        (attributeIs && win.customElements.get(attributeIs))) {
        var div = doc.createElement("div");
        div.className = "shadow-root";
        div.innerHTML = `<span>#shadow-root ${el.shadowRoot ? "(open)" : "(closed)"}</span>`;
        ul.append(div);
      } else {
        var frag = doc.createDocumentFragment();
        [...el.childNodes].forEach(obj => treeBuilder(obj, frag));
        ul.appendChild(frag);
      }
    }
  }
}