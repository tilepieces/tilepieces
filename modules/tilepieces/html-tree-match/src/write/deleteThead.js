HTMLTreeMatch.prototype.deleteTHead = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteTHead] no match");
    var tableMatch = found.match;
    var tHeadDeleted = tableEl.tHead;
    tableEl.deleteTHead();
    tableMatch.deleteTHead();
    $self.setHistory({
        tableEl,
        tableMatch,
        tHeadDeleted,
        method : "deleteTHead"
    });
};
historyMethods.deleteTHead = {
    undo: ho=>{
        ho.tableEl.createTHead();
        ho.tableEl.tHead.replaceWith(ho.tHeadDeleted);
        ho.tableMatch.createTHead();
        ho.tableMatch.tHead.replaceWith(ho.tHeadDeleted.cloneNode(true));
    },
    redo: ho=>{
        ho.tableEl.deleteTHead();
        ho.tableMatch.deleteTHead();
    }
}
