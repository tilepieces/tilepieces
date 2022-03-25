function changeText(e) {
  var el = selected["__html-tree-builder-el"];
  isAutoInsertionFlag = true;
  app.core.htmlMatch.textContent(el, e.target.textContent);
}