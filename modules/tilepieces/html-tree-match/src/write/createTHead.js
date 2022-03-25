HTMLTreeMatch.prototype.createTHead = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch createTHead] no match");
    var tableMatch = found.match;
    var tHead = tableEl.createTHead();
    var firstRow = tHead.insertRow();
    var tHeadMatch = tableMatch.createTHead();
    var firstMatchRow = tHeadMatch.insertRow();
    var cells = tableEl.rows[1] && tableEl.rows[1].cells ? tableEl.rows[1].cells.length : 1;
    for(var i = 0;i<cells;i++) {
        var newRow = firstRow.insertCell(i);
        newRow.textContent = "THead Cell";
        var newRowMatch = firstMatchRow.insertCell(i);
        newRowMatch.textContent = "THead Cell";
    }
    $self.setHistory({
        tableEl,
        tableMatch,
        tHead,
        tHeadMatch,
        method : "createTHead"
    });
};
historyMethods.createTHead = {
    undo: ho=>{
        ho.tableEl.deleteTHead();
        ho.tableMatch.deleteTHead();
    },
    redo: ho=>{
        var tHead = ho.tableEl.createTHead();
        tHead.replaceWith(ho.tHead);
        var tHeadMatch = ho.tableMatch.createTHead();
        tHeadMatch.replaceWith(ho.tHeadMatch);
    }
}
