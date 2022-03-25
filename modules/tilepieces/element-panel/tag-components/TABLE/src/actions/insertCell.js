function insertCell(after) {
  var target = globalModel.target;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.insertCell(row, after ? cellIndex + 1 : cellIndex);
  setTemplate(target);
}