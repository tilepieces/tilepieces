insidePath.addEventListener("click", e => {
  var link = e.target.closest("a");
  if (!link)
    return;
  var el = app.cssSelectorObj.composedPath[link.dataset.index];
  app.core.selectElement(el);
});
insidePath.addEventListener("mousemove", e => {
  var link = e.target.closest("a");
  if (!link) {
    app.highlight = null;
    return;
  }
  app.highlight = app.cssSelectorObj.composedPath[link.dataset.index];
});
insidePath.addEventListener("mouseout", e => {
  app.highlight = null;
});
