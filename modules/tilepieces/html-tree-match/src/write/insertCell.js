HTMLTreeMatch.prototype.insertCell = function(tableRow,index){
    var $self = this;
    var tableRowFound = $self.find(tableRow);
    if(!tableRowFound || !tableRowFound.HTML)
        throw new Error("[HTMLTreeMatch insertCell] no match");
    var tableRowMatch = tableRowFound.match;
    var newCell = tableRow.insertCell(index);
    newCell.innerHTML = "new Cell";
    var newCellMatch = tableRowMatch.insertCell(index);
    newCellMatch.innerHTML = "new Cell";
    $self.setHistory({
        tableRow,
        tableRowMatch,
        index,
        method : "insertCell"
    });
};
historyMethods.insertCell = {
    undo : ho=>{
        ho.tableRow.deleteCell(ho.index);
        ho.tableRowMatch.deleteCell(ho.index);
    },
    redo : ho=>{
        var newCell = ho.tableRow.insertCell(ho.index);
        newCell.innerHTML = "new Cell";
        var newCellMatch = ho.tableRowMatch.insertCell(ho.index);
        newCellMatch.innerHTML = "new Cell";
    }
};
