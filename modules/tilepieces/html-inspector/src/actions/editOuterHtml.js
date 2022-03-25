function editOuterHtml() {
  var t = document.createElement("div");
  var ul = selected.querySelector("ul");
  var realEl = selected["__html-tree-builder-el"];
  var outerHTML = realEl.outerHTML;
  //selected.replaceWith(t);
  overlay.scrollTop = t.offsetTop;
  app.codeMirrorEditor(outerHTML, "html")
    .then(value => {
      if (value != outerHTML)
        app.core.htmlMatch.outerHTML(realEl, value);
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