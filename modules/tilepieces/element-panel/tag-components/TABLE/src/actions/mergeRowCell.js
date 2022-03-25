function mergeRowCell(after) {
  var cell = globalModel.target;
  htmlMatch.mergeRowCell(cell, after ? "frontward" : "backward");
  var target = globalModel.target;
  if (!app.core.currentDocument.body.contains(globalModel.target)) {
    target = globalModel.tableTarget;
  }
  setTemplate(target);
}