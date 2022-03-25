HTMLTreeMatch.prototype.replaceChild = function(newChild,oldChild){
    var $self = this;
    var parentNode = oldChild.parentNode;
    var found = $self.find(parentNode);
    if(!found)
        throw new Error("[HTMLTreeMatch replaceChild] no match");
    var match = found.match;
    var oldMatch = $self.match(oldChild);
    var newMatch = newChild.cloneNode(true);
    parentNode.replaceChild(newChild, oldChild);
    match.replaceChild(newMatch,oldMatch);
    $self.lastMatch.el = newChild;
    $self.lastMatch.match = newMatch;
    $self.setHistory({
        match,
        oldMatch,
        newMatch,
        parentNode,
        newEl:newChild,
        oldEl:oldChild,
        method : "replaceChild"
    });
};
historyMethods.replaceChild = {
    undo:historyObject=>{
        historyObject.parentNode.replaceChild(historyObject.oldEl,historyObject.newEl);
        historyObject.match.replaceChild(historyObject.oldMatch,historyObject.newMatch);
    },
    redo:historyObject=>{
        historyObject.parentNode.replaceChild(historyObject.newEl,historyObject.oldEl);
        historyObject.match.replaceChild(historyObject.newMatch,historyObject.oldMatch);
    }
}