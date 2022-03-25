function addColumn(after) {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.addColumn(table, after ? cellIndex + 1 : cellIndex);
  setTemplate(target);
}