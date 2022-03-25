HTMLTreeMatch.prototype.deleteColumn = function(tableEl,index){
    var $self = this;
    var tableFound = $self.find(tableEl);
    if(!tableFound || !tableFound.HTML)
        throw new Error("[HTMLTreeMatch deleteColumn] no match");
    var tableMatch = tableFound.match;
    var removed = [];
    var removedMatch = [];
    [...tableEl.rows].forEach((v,i)=>{
        if(v.cells[index]) {
            removed.push(v.cells[index]);
            v.deleteCell(index)
        }
    });
    [...tableMatch.rows].forEach((v,i)=>{
        if(v.cells[index]) {
            removedMatch.push(v.cells[index]);
            v.deleteCell(index)
        }
    });
    $self.setHistory({
        tableEl,
        tableMatch,
        removed,
        removedMatch,
        $self,
        index,
        method : "deleteColumn"
    });
};
historyMethods.deleteColumn = {
    undo : ho=>{
        [...ho.tableEl.rows].forEach((v,i)=>{
            var newCell = v.insertCell(ho.index);
            newCell.replaceWith(ho.removed[i]);
        });
        [...ho.tableMatch.rows].forEach((v,i)=>{
            var newCell = v.insertCell(ho.index);
            newCell.replaceWith(ho.removedMatch[i]);
        });
    },
    redo : ho=>{
        [...ho.tableEl.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
        [...ho.tableMatch.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
    }
};
