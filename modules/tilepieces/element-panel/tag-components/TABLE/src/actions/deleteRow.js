function deleteRow() {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var rowIndex = [...table.rows].indexOf(row);
  htmlMatch.deleteRow(table, rowIndex);
  var newTarget = table.rows[rowIndex] || table.rows[rowIndex - 1] || table.rows[rowIndex + 1];
  setTemplate(newTarget);
}