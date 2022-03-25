HtmlTreeBuilder.prototype.collapseChildren = function () {
  var sel = this.selected;
  var carets = sel.querySelectorAll(".html-tree-builder__caret");
  [...carets].forEach(v=>{
    var closest = v.closest("li");
    closest != sel && closest?.classList.remove("open")
  });
}