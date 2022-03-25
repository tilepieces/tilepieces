HTMLTreeMatch.prototype.deleteTFoot = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteTFoot] no match");
    var tableMatch = found.match;
    var TFootDeleted = tableEl.tFoot;
    var TFootDeletedMatch = tableMatch.tFoot;
    tableEl.deleteTFoot();
    tableMatch.deleteTFoot();
    $self.setHistory({
        tableEl,
        tableMatch,
        TFootDeleted,
        TFootDeletedMatch,
        method : "deleteTFoot"
    });
};
historyMethods.deleteTFoot = {
    undo: ho=>{
        ho.tableEl.createTFoot();
        ho.tableEl.tFoot.replaceWith(ho.TFootDeleted);
        ho.tableMatch.createTFoot();
        ho.tableMatch.tFoot.replaceWith(ho.TFootDeletedMatch);
    },
    redo: ho=>{
        ho.tableEl.deleteTFoot();
        ho.tableMatch.deleteTFoot();
    }
}
