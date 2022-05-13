const opener = window.opener || window.parent || window;
const openerParent = opener.opener || opener.parent || opener;
const app = openerParent.tilepieces;
const htmlMatch = app.core.htmlMatch;
const appView = document.getElementById("app-view");
globalModel = {
  rows: 3,
  columns: 3,
  caption: false,
  theader: false,
  tfooter: false,
  disabled: "disabled",
  deactivated: true,
  target: null,
  tableTarget: null
};
let t = new openerParent.TT(appView, globalModel);
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

function setTemplate(target) {
  console.log("setTemplate called");
  if ([1].indexOf(target.nodeType) == -1)
    target = target.parentNode;
  var tableTarget = target.closest("table");
  var isTh = target.tagName == "TH";
  var isTd = target.tagName == "TD" || isTh;
  var disabled = isTd ? "" : "disabled";
  var wideRow = [...tableTarget.rows].sort((a, b) => b.cells.length - a.cells.length)[0];
  var d = "disabled";
  var mergecelrowbefore = d,
    mergecellrowafter = d,
    mergecellcolbefore = d,
    mergecellcolafter = d,
    deleterow = d,
    deletecolumn = d;
  if (isTd) {
    var rowPosition = [...tableTarget.rows].indexOf(target.parentNode);
    var cellPosition = [...target.parentNode.cells].indexOf(target);
    if (tableTarget.rows.length > 1)
      deleterow = "";
    if (target.parentNode.cells.length > 1)
      deletecolumn = "";
    if (rowPosition > 0) {
      mergecelrowbefore = ""
    }
    if (rowPosition < tableTarget.rows.length - 1
      && target.rowSpan != tableTarget.rows.length) {
      mergecellrowafter = "";
    }
    if (cellPosition > 0) {
      mergecellcolbefore = "";
    }
    if (cellPosition < target.parentNode.cells.length - 1 &&
      target.colSpan != target.parentNode.cells.length) {
      mergecellcolafter = "";
    }
  }
  /*
  if (target != globalModel.target) {
    app.core.selectElement(target);
  }
  */
  globalModel = {
    rows: tableTarget.rows.length,
    columns: wideRow.cells.length,
    caption: tableTarget.caption,
    theader: tableTarget.tHead,
    tfooter: tableTarget.tFoot,
    mergecelrowbefore,
    mergecellrowafter,
    mergecellcolbefore,
    mergecellcolafter,
    deleterow,
    deletecolumn,
    deactivated: false,
    isTh,
    disabled,
    target,
    tableTarget
  };
  t.set("", globalModel);
}

function addColumn(after) {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.addColumn(table, after ? cellIndex + 1 : cellIndex);
  setTemplate(target);
}

appView.addEventListener("caption", e => {
  var captionValue = e.detail.target.checked;
  var tableTarget = globalModel.tableTarget;
  if (captionValue)
    htmlMatch.createCaption(tableTarget);
  else
    htmlMatch.deleteCaption(tableTarget);
});
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

function deleteCell() {
  var target = globalModel.target;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.deleteCell(row, cellIndex);
  setTemplate(row);
}

function deleteColumn() {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.deleteColumn(table, cellIndex);
  setTemplate(row);
}

function deleteRow() {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var rowIndex = [...table.rows].indexOf(row);
  htmlMatch.deleteRow(table, rowIndex);
  var newTarget = table.rows[rowIndex] || table.rows[rowIndex - 1] || table.rows[rowIndex + 1];
  setTemplate(newTarget);
}

function insertCell(after) {
  var target = globalModel.target;
  var row = target.parentNode;
  var cellIndex = [...row.cells].indexOf(target);
  htmlMatch.insertCell(row, after ? cellIndex + 1 : cellIndex);
  setTemplate(target);
}

function insertRow(after) {
  var target = globalModel.target;
  var table = globalModel.tableTarget;
  var row = target.parentNode;
  var rowIndex = [...table.rows].indexOf(row);
  htmlMatch.insertRow(table, after ? rowIndex + 1 : rowIndex);
  setTemplate(target);
}

function toggleTH(target, isTh) {
  var docFragment = target.ownerDocument.createDocumentFragment();
  var newNode = target.ownerDocument.createElement(isTh ? "TH" : "TD");
  for (var i = 0, l = target.attributes.length; i < l; ++i) {
    var nodeName = target.attributes.item(i).nodeName;
    var nodeValue = target.attributes.item(i).nodeValue;
    newNode.setAttribute(nodeName, nodeValue);
  }
  [...target.childNodes].forEach(c => newNode.appendChild(c.cloneNode(true)));
  docFragment.appendChild(newNode);
  htmlMatch.replaceWith(target, newNode);
  app.core.selectElement(newNode);
  globalModel.target = newNode;
}

appView.addEventListener("isTh", e => {
  var value = e.detail.target.checked;
  var target = globalModel.target;
  toggleTH(target, value)
});

function mergeColCell(after) {
  var cell = globalModel.target;
  htmlMatch.mergeColumnCell(cell, after ? "frontward" : "backward");
  var target = globalModel.target;
  if (!app.core.currentDocument.body.contains(globalModel.target)) {
    target = globalModel.tableTarget;
  }
  setTemplate(target);
}

function mergeRowCell(after) {
  var cell = globalModel.target;
  htmlMatch.mergeRowCell(cell, after ? "frontward" : "backward");
  var target = globalModel.target;
  if (!app.core.currentDocument.body.contains(globalModel.target)) {
    target = globalModel.tableTarget;
  }
  setTemplate(target);
}

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
appView.addEventListener("tfooter", e => {
  var tfooterValue = e.detail.target.checked;
  var tableTarget = globalModel.tableTarget;
  if (tfooterValue)
    htmlMatch.createTFoot(tableTarget);
  else
    htmlMatch.deleteTFoot(tableTarget);
});
appView.addEventListener("theader", e => {
  var theaderValue = e.detail.target.checked;
  var tableTarget = globalModel.tableTarget;
  if (theaderValue)
    htmlMatch.createTHead(tableTarget);
  else
    htmlMatch.deleteTHead(tableTarget);
});
