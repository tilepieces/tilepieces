function deleteColumn() {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.deleteColumn(table, cellIndex);
  setTemplate(row);
}