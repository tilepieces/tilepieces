const dragList = __dragList(childrenElementUL, {
  handlerSelector: ".children-grabber",
  convalidate: function (el) {
    if (el.querySelector(".children-grabber")) {
      return true
    }
  }
});
dragList.on("move", e => {
  var nodes = e.target;
  for (var i = nodes.length - 1; i >= 0; i--) {
    var node = nodes[i];
    var index = +node.dataset.index;
    var el = app.elementSelected.children[index];
    if (e.prev) {
      var indexP = +e.prev.dataset.index;
      var prevEl = app.elementSelected.children[indexP];
      app.core.htmlMatch.move(prevEl, el, "after");
    } else {
      var indexN = +e.next.dataset.index;
      var nextEl = app.elementSelected.children[indexN];
      app.core.htmlMatch.move(nextEl, el, "before");
    }
  }
  [...childrenElementUL.children].forEach((v, i) => v.dataset.index = i);
})