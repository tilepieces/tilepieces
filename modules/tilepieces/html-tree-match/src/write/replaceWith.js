HTMLTreeMatch.prototype.replaceWith = function(el,node){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch replaceWith] no match");
    var match = found.match;
    el.replaceWith(node);
    var newMatch = node.cloneNode(true);
    match.replaceWith(newMatch);
    $self.lastMatch.el = node;
    $self.lastMatch.match = newMatch;
    $self.setHistory({
        el,
        match,
        newMatch,
        newEl:node,
        method : "replaceWith"
    });
};
historyMethods.replaceWith = {
    undo:historyObject=>{
        historyObject.newEl.replaceWith(historyObject.el);
        historyObject.newMatch.replaceWith(historyObject.match);
    },
    redo:historyObject=>{
        historyObject.el.replaceWith(historyObject.newEl);
        historyObject.match.replaceWith(historyObject.newMatch);
    }
}
