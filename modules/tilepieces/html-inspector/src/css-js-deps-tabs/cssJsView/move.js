function cssJsMove(DOMList) {
  var dragList = __dragList(DOMList, {
    convalidateStart: function (el) {
      console.log(multiSelectionJsCss.find(v => v.listEl == el),);
      if (app.multiselected && multiSelectionJsCss.find(v => v.listEl == el)) {
        return {multiselection: multiSelectionJsCss.map(v => v.listEl).sort((a, b) => a.offsetTop - b.offsetTop)}
      }
      if (el == selectedJsCSS)
        return true
    },
    convalidate: function (el) {
      if (!el.classList.contains("not-match"))
        return true;
    },
    handlerSelector: ".html-tree-build-dragger"
  });
  dragList.on("move", e => {
    var nodes = e.target;
    var prevEl = e.prev && e.prev["__html-tree-builder-el"];
    var prevFound = prevEl && app.core.htmlMatch.find(prevEl);
    if (prevFound) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        app.core.htmlMatch.move(prevEl,
          nodes[i]["__html-tree-builder-el"],
          "after");
      }
    } else {
      for (var i = 0; i < nodes.length; i++) {
        app.core.htmlMatch.move(e.next["__html-tree-builder-el"],
          nodes[i]["__html-tree-builder-el"],
          "before");
      }
    }
  });
  return dragList;
}