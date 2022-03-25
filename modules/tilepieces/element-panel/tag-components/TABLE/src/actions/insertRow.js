function insertRow(after) {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var rowIndex = [...table.rows].indexOf(row);
  htmlMatch.insertRow(table, after ? rowIndex + 1 : rowIndex);
  setTemplate(target);
}