appView.addEventListener("columns", e => {
  var newColumnInputValue = parseInt(e.detail.target.value);
  var tableTarget = globalModel.tableTarget;
  var columns = globalModel.columns;
  var delta, i = 0;
  if (newColumnInputValue > columns) {
    delta = newColumnInputValue - columns;
    for (i = 0; i <= delta; i++)
      htmlMatch.addColumn(tableTarget, columns + i);
  } else if (newColumnInputValue < columns) {
    delta = columns - newColumnInputValue;
    for (i = 0; i <= delta; i++)
      htmlMatch.deleteColumn(tableTarget, columns - i);
  } else
    return;
  t.set("columns", newColumnInputValue);
  e.detail.target.value = newColumnInputValue;
});