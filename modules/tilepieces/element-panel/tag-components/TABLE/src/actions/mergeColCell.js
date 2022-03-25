function mergeColCell(after) {
  var cell = globalModel.target;
  htmlMatch.mergeColumnCell(cell, after ? "frontward" : "backward");
  var target = globalModel.target;
  if (!app.core.currentDocument.body.contains(globalModel.target)) {
    target = globalModel.tableTarget;
  }
  setTemplate(target);
}