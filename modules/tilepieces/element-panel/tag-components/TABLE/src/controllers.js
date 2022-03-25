console.log("[table activated]", app.elementSelected);
// we should have app.elementSelected. Check just in case...
let elementSelected = app.elementSelected;
app.elementSelected && setTemplate(app.elementSelected);
openerParent.addEventListener("highlight-click", e => {
  console.log("[table activated]", app.elementSelected);
  if (app.elementSelected == elementSelected)
    return;
  // Uncaught RangeError: Maximum call stack size exceeded
  elementSelected = app.elementSelected;
  setTemplate(app.elementSelected);
});
appView.addEventListener("click", e => {
  var action = e.target.dataset.action;
  if (!action)
    return;
  switch (action) {
    case "insert-row-before":
      insertRow();
      break;
    case "insert-row-after":
      insertRow(true);
      break;
    case "delete-row":
      deleteRow();
      break;
    case "insert-column-before":
      addColumn();
      break;
    case "insert-column-after":
      addColumn(true);
      break;
    case "delete-column":
      deleteColumn("deleteRow");
      break;
    case "insert-cell-row-before":
      insertCell();
      break;
    case "insert-cell-row-after":
      insertCell(true);
      break;
    case "delete-cell":
      deleteCell(true);
      break;
    case "merge-cell-with-row-cell-before":
      mergeRowCell();
      break;
    case "merge-cell-with-row-cell-after":
      mergeRowCell(true);
      break;
    case "merge-cell-with-column-cell-before":
      mergeColCell();
      break;
    case "merge-cell-with-column-cell-after":
      mergeColCell(true);
      break;
  }
});
