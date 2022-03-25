HTMLTreeMatch.prototype.mergeRowCell = function(tableCell,type){
    var $self = this;
    var tableCellFound = $self.find(tableCell);
    if(!tableCellFound || !tableCellFound.HTML)
        throw new Error("[HTMLTreeMatch mergeRowCell] no match");
    var tableCellMatch = tableCellFound.match;
    var table = tableCell.closest("table");
    var tableMatch = tableCellMatch.closest("table");
    var row = tableCell.parentNode;
    var indexRow = [...table.rows].indexOf(row);
    var indexCell = [...tableCell.parentNode.cells].indexOf(tableCell);
    var indexRowToExpand;
    var trLength = table.rows[indexRow].cells.length;
    var searchForColumn,searchRowLength;
    if(type=="backward"){
        searchForColumn = indexRow-1;
        searchRowLength = table.rows[searchForColumn].cells.length;
        var searchCellRowSpan = table.rows[searchForColumn].cells[indexCell].rowSpan;
        while(table.rows[searchForColumn] &&
            ( searchRowLength!= trLength &&
            searchCellRowSpan == 1 )
            ){
            searchForColumn--;
            searchRowLength = table.rows[searchForColumn] && table.rows[searchForColumn].cells.length;
            searchCellRowSpan = table.rows[searchForColumn] && table.rows[searchForColumn].cells[indexCell] ?
                table.rows[searchForColumn].cells[indexCell].rowSpan : 1;
        }
        if(table.rows[searchForColumn])
            indexRowToExpand = searchForColumn;
        else
            indexRowToExpand = indexRow-1;
    }
    else
        indexRowToExpand = indexRow;
    var rowToExpand = table.rows[indexRowToExpand];
    var mergeCell = rowToExpand.cells[indexCell];
    var mergeCellClone = mergeCell.cloneNode(true);
    var indexRowToRemove = indexRow+1;
    if(type=="backward")
        indexRowToRemove = indexRow;
    else if(type!="backward" && mergeCell.rowSpan > 1){
        searchForColumn = indexRow+1;
        searchRowLength = table.rows[searchForColumn].cells.length;
        while(table.rows[searchForColumn] &&
        searchRowLength != trLength){
            searchForColumn++;
            searchRowLength = table.rows[searchForColumn] && table.rows[searchForColumn].cells.length;
        }
        if(table.rows[searchForColumn])
            indexRowToRemove = searchForColumn;
        else{
            while(table.rows[indexRowToRemove] && !table.rows[indexRowToRemove].cells[indexCell])
                indexRowToRemove++;
        }
    }
    var rowToRemove =  table.rows[indexRowToRemove];
    var toRemove = rowToRemove.cells[indexCell];
    toRemove.parentNode.removeChild(toRemove);
    if(indexRowToRemove>indexRowToExpand)
        [...toRemove.childNodes].forEach(v=>{
            mergeCell.appendChild(v.cloneNode(true));
        });
    else
        [...toRemove.childNodes].forEach(v=>{
            mergeCell.insertBefore(v.cloneNode(true),mergeCell.firstChild);
        });
    var wasColSpan = mergeCell.hasAttribute("colspan");
    var wasRowSpan = mergeCell.hasAttribute("rowspan");
    mergeCell.rowSpan+=toRemove.rowSpan;
    var mergeCellColSpan = toRemove.colSpan;
    mergeCell.colSpan=toRemove.colSpan;
    tableMatch.rows[indexRowToExpand].replaceWith(rowToExpand.cloneNode(true));
    tableMatch.rows[indexRowToRemove].replaceWith(rowToRemove.cloneNode(true));
    $self.setHistory({
        tableCell,
        wasColSpan,
        wasRowSpan,
        tableCellMatch,
        tableMatch,
        type,
        toRemove,
        mergeCell,
        mergeCellColSpan,
        mergeCellnewHtml : mergeCell.innerHTML,
        indexCell,
        indexRow,
        indexRowToExpand,
        indexRowToRemove,
        row,
        rowToExpand,
        rowToRemove,
        mergeCellClone,
        method : "mergeRowCell"
    });
};
historyMethods.mergeRowCell = {
    undo : ho=>{
        ho.mergeCell.rowSpan-=ho.toRemove.rowSpan;
        ho.mergeCell.colSpan=ho.mergeCellColSpan;
        if(!ho.wasColSpan)
            ho.mergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.mergeCell.removeAttribute("rowspan");
        var newCell = ho.rowToRemove.insertCell(ho.indexCell);
        newCell.replaceWith(ho.toRemove);
        ho.mergeCell.innerHTML = ho.mergeCellClone.innerHTML;
        ho.tableMatch.rows[ho.indexRowToExpand].replaceWith(ho.rowToExpand.cloneNode(true));
        ho.tableMatch.rows[ho.indexRowToRemove].replaceWith(ho.rowToRemove.cloneNode(true));
    },
    redo : ho=>{
        ho.toRemove.parentNode.removeChild(ho.toRemove);
        ho.mergeCell.innerHTML = ho.mergeCellnewHtml;
        ho.mergeCell.rowSpan+=ho.toRemove.rowSpan;
        ho.mergeCell.colSpan=ho.toRemove.colSpan;
        ho.tableMatch.rows[ho.indexRowToExpand].replaceWith(ho.rowToExpand.cloneNode(true));
        ho.tableMatch.rows[ho.indexRowToRemove].replaceWith(ho.rowToRemove.cloneNode(true));
    }
};
