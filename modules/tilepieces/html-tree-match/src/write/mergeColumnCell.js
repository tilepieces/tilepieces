HTMLTreeMatch.prototype.mergeColumnCell = function(tableCell,type){
    var $self = this;
    var tableCellFound = $self.find(tableCell);
    if(!tableCellFound || !tableCellFound.HTML)
        throw new Error("[HTMLTreeMatch mergeColumnCell] no match");
    var tableCellMatch = tableCellFound.match;
    var table = tableCell.closest("table");
    var tableMatch = tableCellMatch.closest("table");
    var row = tableCell.parentNode;
    var rowMatch = tableCellMatch.parentNode;
    var indexRow = [...table.rows].indexOf(row);
    var index = [...row.cells].indexOf(tableCell);
    var mergeCell = type=="backward" ? row.cells[index-1] : tableCell;
    var matchMergeCellFind = $self.find(mergeCell);
    if(!matchMergeCellFind || !matchMergeCellFind.HTML)
        throw new Error("[HTMLTreeMatch mergeCell] no match");
    var matchMergeCell = matchMergeCellFind.match;
    var toRemove = type=="backward" ? tableCell : row.cells[index+1];
    var toRemoveMatchFind = $self.find(toRemove);
    if(!toRemoveMatchFind || !toRemoveMatchFind.HTML)
        throw new Error("[HTMLTreeMatch toRemoveMatch] no match");
    var toRemoveIndex = [...row.cells].indexOf(toRemove);
    var toRemoveMatch = toRemoveMatchFind.match;
    toRemove.remove();
    toRemoveMatch.remove();
    var added = [];
    [...toRemove.childNodes].forEach(v=>{
        var newEl = v.cloneNode(true);
        mergeCell.append(newEl);
        added.push(newEl);
    });
    var addedMatch = [];
    [...toRemoveMatch.childNodes].forEach(v=>{
        var newEl = v.cloneNode(true);
        matchMergeCell.append(newEl);
        addedMatch.push(newEl);
    });
    var wasColSpan = mergeCell.hasAttribute("colspan");
    var wasRowSpan = mergeCell.hasAttribute("rowspan");
    mergeCell.colSpan+=toRemove.colSpan;
    var mergeCellRowSpan = mergeCell.rowSpan;
    mergeCell.rowSpan=toRemove.rowSpan;
    matchMergeCell.colSpan=mergeCell.colSpan;
    matchMergeCell.rowSpan=mergeCell.rowSpan;
    $self.setHistory({
        tableCell,
        wasColSpan,
        wasRowSpan,
        tableCellMatch,
        mergeCellRowSpan,
        type,
        toRemove,
        toRemoveIndex,
        toRemoveMatch,
        mergeCell,
        matchMergeCell,
        index,
        rowMatch,
        row,
        added,
        addedMatch,
        method : "mergeColumnCell"
    });
};
historyMethods.mergeColumnCell = {
    undo : ho=>{
        ho.mergeCell.colSpan-=ho.toRemove.colSpan;
        ho.mergeCell.rowSpan=ho.mergeCellRowSpan;
        if(!ho.wasColSpan)
            ho.mergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.mergeCell.removeAttribute("rowspan");
        ho.matchMergeCell.colSpan=ho.mergeCell.colSpan;
        ho.matchMergeCell.rowSpan=ho.mergeCell.rowSpan;
        if(!ho.wasColSpan)
            ho.matchMergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.matchMergeCell.removeAttribute("rowspan");
        ho.added.forEach(v=>v.remove());
        ho.addedMatch.forEach(v=>v.remove());
        var newCell = ho.row.insertCell(ho.toRemoveIndex);
        newCell.replaceWith(ho.toRemove);
        var newCellMatch = ho.rowMatch.insertCell(ho.toRemoveIndex);
        newCellMatch.replaceWith(ho.toRemoveMatch);
    },
    redo : ho=>{
        ho.added.forEach(v=>{
            ho.mergeCell.append(v);
        });
        ho.addedMatch.forEach(v=>{
            ho.matchMergeCell.append(v);
        });
        ho.mergeCell.colSpan+=ho.toRemove.colSpan;
        ho.mergeCell.rowSpan=ho.toRemove.rowSpan;
        ho.matchMergeCell.colSpan=ho.mergeCell.colSpan;
        ho.matchMergeCell.rowSpan=ho.mergeCell.rowSpan;
        ho.toRemove.remove();
        ho.toRemoveMatch.remove();
    }
};
