HTMLTreeMatch.prototype.insertRow = function(tableEl,index){
    var $self = this;
    var tableFound = $self.find(tableEl);
    if(!tableFound || !tableFound.HTML)
        throw new Error("[HTMLTreeMatch insertRow] no match");
    var tableMatch = tableFound.match;
    var cells = tableEl.rows[0].cells.length;
    var newRow = tableEl.insertRow(index);
    var newRomMatch = tableMatch.insertRow(index);
    for(var i = 0;i<cells;i++) {
        newRow.insertCell(i);
        newRomMatch.insertCell(i);
    }
    $self.setHistory({
        tableEl,
        tableMatch,
        cells,
        index,
        method : "insertRow"
    });
};
historyMethods.insertRow = {
    undo : ho=>{
        ho.tableEl.deleteRow(ho.index);
        ho.tableMatch.deleteRow(ho.index);
    },
    redo : ho=>{
        var newRow = ho.tableEl.insertRow(ho.index);
        var newRomMatch = ho.tableMatch.insertRow(ho.index);
        for(var i = 0;i<ho.cells;i++) {
            newRow.insertCell(i);
            newRomMatch.insertCell(i);
        }
    }
};
