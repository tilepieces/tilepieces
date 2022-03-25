function tableTest() {
  var doc = tilepieces.core.currentDocument;
  var body = doc.body;
  var table = doc.querySelector("table");
  var originalRows = table.rows.length;
  var startRow = table.rows[0];
  var originalCells = startRow.cells.length;
  var matchTable = tilepieces.core.htmlMatch.find(table);
  logOnDocument(
    assert(matchTable.match &&
      matchTable.HTML &&
      matchTable.attributes,
      "table matchTable ok"), "success");
  tilepieces.core.htmlMatch.insertRow(table, 0);
  logOnDocument(
    assert(table.rows.length == originalRows + 1 &&
      startRow == table.rows[1],
      "table insertRow ok"), "success");
  var lastCell = startRow.cells[originalCells - 1];
  // without originalCells, the last one cell would be changed
  tilepieces.core.htmlMatch.insertCell(startRow, originalCells);
  logOnDocument(
    assert(startRow.cells.length == originalCells + 1 &&
      lastCell == startRow.cells[originalCells - 1],
      "table insertCell ok"), "success");
  tilepieces.core.htmlMatch.deleteCell(startRow, originalCells);
  logOnDocument(
    assert(startRow.cells.length == originalCells &&
      lastCell == startRow.cells[originalCells - 1],
      "table deletecell ok"), "success");
  tilepieces.core.htmlMatch.deleteRow(table, 0);
  logOnDocument(
    assert(table.rows.length == originalRows &&
      startRow == table.rows[0],
      "table deleterow ok"), "success");
  tilepieces.core.htmlMatch.addColumn(table, originalCells);
  logOnDocument(
    assert(startRow.cells.length == originalCells + 1 &&
      table.rows[1].cells.length == originalCells + 1 &&
      table.rows[2].cells.length == originalCells + 1 &&
      lastCell == startRow.cells[originalCells - 1],
      "table addColumn ok"), "success");
  tilepieces.core.htmlMatch.deleteColumn(table, originalCells);
  logOnDocument(
    assert(startRow.cells.length == originalCells &&
      table.rows[1].cells.length == originalCells &&
      table.rows[2].cells.length == originalCells &&
      lastCell == startRow.cells[originalCells - 1],
      "table deleteColumn ok"), "success");
  tilepieces.core.htmlMatch.createCaption(table);
  var findCaption = tilepieces.core.htmlMatch.find(table.caption);
  logOnDocument(
    assert(table.caption &&
      findCaption.match &&
      findCaption.HTML &&
      findCaption.attributes &&
      table.caption.textContent == "table caption",
      "table createCaption ok"), "success");
  tilepieces.core.htmlMatch.deleteCaption(table);
  logOnDocument(
    assert(!table.caption &&
      !matchTable.caption,
      "table deleteCaption ok"), "success");
  tilepieces.core.htmlMatch.createTFoot(table);
  var findTfoot = tilepieces.core.htmlMatch.find(table.tFoot);
  logOnDocument(
    assert(table.tFoot &&
      findTfoot.match &&
      findTfoot.HTML &&
      findTfoot.attributes &&
      table.tFoot.rows[0].cells[0].textContent == "TFoot Cell",
      "table createTFoot ok"), "success");
  tilepieces.core.htmlMatch.deleteTFoot(table);
  logOnDocument(
    assert(!table.tFoot &&
      !matchTable.tFoot,
      "table deleteTFoot ok"), "success");
  tilepieces.core.htmlMatch.createTHead(table);
  var findTHead = tilepieces.core.htmlMatch.find(table.tHead);
  logOnDocument(
    assert(table.tHead &&
      findTHead.match &&
      findTHead.HTML &&
      findTHead.attributes &&
      table.tHead.rows[0].cells[0].textContent == "THead Cell",
      "table createTHead ok"), "success");
  tilepieces.core.htmlMatch.deleteTHead(table);
  logOnDocument(
    assert(!table.tHead &&
      !matchTable.tHead,
      "table deleteTHead ok"), "success");

  tilepieces.core.htmlMatch.mergeColumnCell(table.rows[0].cells[0]);
  var newCell = tilepieces.core.htmlMatch.find(table.rows[0].cells[0]);
  logOnDocument(
    assert(newCell.match &&
      newCell.HTML &&
      newCell.attributes &&
      newCell.match.textContent == "12" &&
      table.rows[0].cells.length == 2,
      "table mergeColumnCell test1 ok"), "success");
  tilepieces.core.htmlMatch.mergeColumnCell(table.rows[0].cells[1], "backward");
  newCell = tilepieces.core.htmlMatch.find(table.rows[0].cells[0]);
  logOnDocument(
    assert(newCell.match &&
      newCell.HTML &&
      newCell.attributes &&
      newCell.match.textContent == "123" &&
      table.rows[0].cells.length == 1,
      "table mergeColumnCell test2 ok"), "success");
  //merge rowCell has error
  /*
      tilepieces.core.htmlMatch.insertRow(table,1);
      tilepieces.core.htmlMatch.insertCell(table.rows[1]);
      tilepieces.core.htmlMatch.insertCell(table.rows[1]);
      var row1cell2 = table.rows[1].cells[2];
      var row2cell2 = table.rows[2].cells[2];
      var row3cell2 = table.rows[3].cells[2];
      tilepieces.core.htmlMatch.innerHTML(row1cell2,"31");
      tilepieces.core.htmlMatch.innerHTML(row2cell2,"32");
      tilepieces.core.htmlMatch.innerHTML(row3cell2,"33");
      tilepieces.core.htmlMatch.mergeRowCell(row1cell2);
      var newRowCell = tilepieces.core.htmlMatch.find(table.rows[1].cells[2]);
      table = tilepieces.core.htmlMatch.find(table);
      logOnDocument(
          assert(newRowCell.match &&
              newRowCell.HTML &&
              newRowCell.attributes &&
              newRowCell.match.textContent == "3132" &&
              newRowCell.match.rowSpan == 2 &&
              table.match &&
              table.HTML &&
              table.attributes,
              "table mergeRowCell ok"),"success");
      tilepieces.core.htmlMatch.mergeRowCell(row3cell2,"backward");
      newRowCell = tilepieces.core.htmlMatch.find(table.match.rows[1].cells[2]);
      table = tilepieces.core.htmlMatch.find(table.match);
      logOnDocument(
          assert(newRowCell.match &&
              newRowCell.HTML &&
              newRowCell.attributes &&
              newRowCell.match.textContent == "313233" &&
              newRowCell.match.rowSpan == 3 &&
              table.match &&
              table.HTML &&
              table.attributes,
              "table mergeRowCell test2 ok"),"success");*/
}