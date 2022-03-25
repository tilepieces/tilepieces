HTMLTreeMatch.prototype.createCaption = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch createCaption] no match");
    var tableMatch = found.match;
    var caption = tableEl.createCaption();
    caption.textContent = "table caption";
    var captionMatch = tableMatch.createCaption();
    captionMatch.textContent = "table caption";
    $self.setHistory({
        tableEl,
        tableMatch,
        method : "createCaption"
    });
};
historyMethods.createCaption = {
    undo: ho=>{
        ho.tableEl.deleteCaption();
        ho.tableMatch.deleteCaption();
    },
    redo: ho=>{
        var caption = ho.tableEl.createCaption();
        caption.textContent = "table caption";
        var captionMatch = ho.tableMatch.createCaption();
        captionMatch.textContent = "table caption";
    }
}
