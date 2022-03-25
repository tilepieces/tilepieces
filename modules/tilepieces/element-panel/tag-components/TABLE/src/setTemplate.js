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
  if (target != globalModel.target) {
    app.core.selectElement(target);
  }
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