const dragList = __dragList(overlay, {
  convalidateStart: function (el, originalEl) {
    if (originalEl.closest("[contenteditable]"))
      return;
    var selectedEl = selected ? selected["__html-tree-builder-el"] : null;
    var targetEl = el["__html-tree-builder-el"];
    if (treeBuilder.multiselected.length && targetEl &&
      treeBuilder.multiselected.find(n => n.el == targetEl)) {
      return {multiselection: treeBuilder.multiselected.map(v => v.listEl).sort((a, b) => a.offsetTop - b.offsetTop)}
    }
    if (selectedEl &&
      selectedIsMatch &&
      targetEl &&
      el == selected &&
      !selectedEl.nodeName.match(/(HTML|HEAD|BODY)$/) &&
      !targetEl.nodeName.match(/(HTML|HEAD|BODY)$/))
      return true
  },
  convalidate: function (el) {
    var selectedEl = selected ? selected["__html-tree-builder-el"] : null;
    var targetEl = el["__html-tree-builder-el"];
    var targetElMatch = targetEl && app.core.htmlMatch.find(targetEl);
    if (targetElMatch &&
      selectedEl &&
      selectedIsMatch &&
      targetEl &&
      selectedEl != targetEl &&
      !selectedEl.contains(targetEl) &&
      !selectedEl.nodeName.match(/(HTML|HEAD|BODY)$/) &&
      !targetEl.nodeName.match(/(HTML|HEAD|BODY)$/) &&
      el.parentNode != overlay.children[0] &&
      el.parentNode != overlay)
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
})