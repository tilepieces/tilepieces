HTMLTreeMatch.prototype.createTFoot = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch createTFoot] no match");
    var tableMatch = found.match;
    var TFoot = tableEl.createTFoot();
    var firstRow = TFoot.insertRow();
    var TFootMatch = tableMatch.createTFoot();
    var firstMatchRow = TFootMatch.insertRow();
    var cells = tableEl.rows[0] && tableEl.rows[0].cells ? tableEl.rows[0].cells.length : 1;
    for(var i = 0;i<cells;i++) {
        var newRow = firstRow.insertCell(i);
        newRow.textContent = "TFoot Cell";
        var newRowMatch = firstMatchRow.insertCell(i);
        newRowMatch.textContent = "TFoot Cell";
    }
    $self.setHistory({
        tableEl,
        tableMatch,
        TFoot,
        TFootMatch,
        method : "createTFoot"
    });
};
historyMethods.createTFoot = {
    undo: ho=>{
        ho.tableEl.deleteTFoot();
        ho.tableMatch.deleteTFoot();
    },
    redo: ho=>{
        var TFoot = ho.tableEl.createTFoot();
        TFoot.replaceWith(ho.TFoot);
        var TFootMatch = ho.tableMatch.createTFoot();
        TFootMatch.replaceWith(ho.TFootMatch);
    }
}
