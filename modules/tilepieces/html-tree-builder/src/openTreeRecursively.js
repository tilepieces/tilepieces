function openTreeRecursively(el) {
  var caret = el.querySelector(".html-tree-builder__caret");
  if (!caret)
    return;
  if (!caret.closest("li").classList.contains("open"))
    openTree({target: caret});
  var ul = el.querySelector("ul");
  var carets = ul.querySelectorAll(".html-tree-builder-el");
  for (var i = 0; i < carets.length; i++)
    openTreeRecursively(carets[i])
}