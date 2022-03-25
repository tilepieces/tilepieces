appView.addEventListener("rows", e => {
  var newRowInputValue = parseInt(e.detail.target.value);
  var tableTarget = globalModel.tableTarget;
  var count = 0;
  if (newRowInputValue > tableTarget.rows.length) {
    while (tableTarget.rows.length != newRowInputValue)
      htmlMatch.insertRow(tableTarget, tableTarget.rows.length);
  } else if (newRowInputValue < tableTarget.rows.length)
    while (tableTarget.rows.length != newRowInputValue)
      htmlMatch.deleteRow(tableTarget, tableTarget.rows.length - 1);
  t.set("rows", tableTarget.rows.length);
  e.detail.target.value = newRowInputValue;
});