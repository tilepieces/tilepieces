HTMLTreeMatch.prototype.deleteRow = function(tableEl,index){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteRow] no match");
    var tableMatch = found.match;
    var deletedEl = tableEl.rows[index];
    var matchedEl = $self.match(deletedEl);
    tableEl.deleteRow(index);
    tableMatch.deleteRow(index);
    $self.setHistory({
        tableEl,
        deletedEl,
        matchedEl,
        tableMatch,
        index,
        method : "deleteRow"
    });
};
historyMethods.deleteRow = {
    undo : ho=>{
        var newRow = ho.tableEl.insertRow(ho.index);
        newRow.replaceWith(ho.deletedEl);
        var newRowMatch = ho.tableMatch.insertRow(ho.index);
        newRowMatch.replaceWith(ho.matchedEl);
    },
    redo : ho=>{
        ho.tableEl.deleteRow(ho.index);
        ho.tableMatch.deleteRow(ho.index);
    }
};
