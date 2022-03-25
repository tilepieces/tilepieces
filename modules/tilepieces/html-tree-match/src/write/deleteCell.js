HTMLTreeMatch.prototype.deleteCell = function(tableRow,index){
    var $self = this;
    var found = $self.find(tableRow);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteCell] no match");
    var tableRowMatch = found.match;
    var del = tableRow.cells[index];
    tableRow.deleteCell(index);
    var delMatch = tableRowMatch.cells[index];
    tableRowMatch.deleteCell(index);
    $self.setHistory({
        tableRow,
        tableRowMatch,
        del,
        delMatch,
        index,
        method : "deleteCell"
    });
};
historyMethods.deleteCell = {
    undo : ho=>{
        var newCell = ho.tableRow.insertCell(ho.index);
        newCell.replaceWith(ho.del);
        var newCellMatch = ho.tableRowMatch.insertCell(ho.index);
        newCellMatch.replaceWith(ho.delMatch);
    },
    redo : ho=>{
        ho.tableRow.deleteCell(ho.index);
        ho.tableRowMatch.deleteCell(ho.index);
    }
};
