childrenElementUL.addEventListener("click", e => {
  if (e.target.classList.contains("children-grabber"))
    return;
  var link = e.target.closest("li");
  if (!link)
    return;
  var el = app.elementSelected.children[link.dataset.index];
  app.core.selectElement(el);
});
childrenElementUL.addEventListener("mousemove", e => {
  var link = e.target.closest("li");
  if (!link) {
    app.highlight = null;
    return;
  }
  app.highlight = app.elementSelected.children[link.dataset.index];
});
childrenElementUL.addEventListener("mouseout", e => {
  app.highlight = null;
});
