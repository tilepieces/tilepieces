function editInnerHtml() {
  var t = document.createElement("div");
  var ul = selected.querySelector("ul");
  var realEl = selected["__html-tree-builder-el"];
  var innerHTML = realEl.innerHTML;
  //ul && ul.replaceWith(t);
  //!ul && selected.appendChild(t);
  var type = realEl.tagName == "STYLE" ? "css" :
    realEl.tagName == "SCRIPT" ? "javascript" : "html";
  //var editor = createEditor(t,innerHTML,"text/"+ type);
  overlay.scrollTop = selected.offsetTop;
  app.codeMirrorEditor(innerHTML, type)
    .then(res => {
      if (res != innerHTML)
        app.core.htmlMatch.innerHTML(realEl, res);
    }, e => console.error(e))
    .finally(() => {
      if (ul) {
        ul.remove();
        var target = selected.querySelector(".html-tree-builder__caret");
        selected.classList.remove("open");
        treeBuilder.openTree({target});
        overlay.scrollTop = selected.offsetTop;
      }
    })
}