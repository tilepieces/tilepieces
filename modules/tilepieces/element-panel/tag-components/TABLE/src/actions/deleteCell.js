function deleteCell() {
  var target = globalModel.target;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.deleteCell(row, cellIndex);
  setTemplate(row);
}