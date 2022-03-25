HTMLTreeMatch.prototype.deleteCaption = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteCaption] no match");
    var tableMatch = found.match;
    var captionDeleted = tableEl.caption;
    tableEl.deleteCaption();
    tableMatch.deleteCaption();
    $self.setHistory({
        tableEl,
        tableMatch,
        captionDeleted,
        method : "deleteCaption"
    });
};
historyMethods.deleteCaption = {
    undo: ho=>{
        ho.tableEl.createCaption();
        ho.tableEl.caption.replaceWith(ho.captionDeleted);
        ho.tableMatch.createCaption();
        ho.tableMatch.caption.replaceWith(ho.captionDeleted.cloneNode(true));
    },
    redo: ho=>{
        ho.tableEl.deleteCaption();
        ho.tableMatch.deleteCaption();
    }
}
