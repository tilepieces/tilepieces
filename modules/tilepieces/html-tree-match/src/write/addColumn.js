HTMLTreeMatch.prototype.addColumn = function(tableEl,index){
    var $self = this;
    var tableFound = $self.find(tableEl);
    if(!tableFound || !tableFound.HTML)
        throw new Error("[HTMLTreeMatch addColumn] no match");
    var tableMatch = tableFound.match;
    [...tableEl.rows].forEach(v=>{
        v.insertCell(index)
    });
    [...tableMatch.rows].forEach(v=>{
        v.insertCell(index)
    });
    $self.setHistory({
        tableEl,
        $self,
        tableMatch,
        index,
        method : "addColumn"
    });
};
historyMethods.addColumn = {
    undo : ho=>{
        [...ho.tableEl.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
        [...ho.tableMatch.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
    },
    redo : ho=>{
        [...ho.tableEl.rows].forEach(v=>{
            v.insertCell(ho.index)
        });
        [...ho.tableMatch.rows].forEach(v=>{
            v.insertCell(ho.index)
        });
    }
};
