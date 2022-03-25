HTMLTreeMatch.prototype.insertBefore = function(newNode,referenceNode){
    var $self = this;
    var found = $self.find(referenceNode);
    if(!found)
        throw new Error("[HTMLTreeMatch insertBefore] no match");
    var refMatch = found.match;
    var match = refMatch.parentNode;
    var newNodeMatch = newNode.cloneNode(true);
    var parentNode = referenceNode.parentNode;
    parentNode.insertBefore(newNode, referenceNode);
    match.insertBefore(newNodeMatch,refMatch);
    $self.setHistory({
        match,
        parentNode,
        newNode,
        newNodeMatch,
        referenceNode,
        refMatch,
        method : "insertBefore"
    });
};
historyMethods.insertBefore = {
    undo : ho=>{
        ho.parentNode.removeChild(ho.newNode, ho.referenceNode);
        ho.match.removeChild(ho.newNodeMatch,ho.refMatch);
    },
    redo : ho=>{
        ho.parentNode.insertBefore(ho.newNode, ho.referenceNode);
        ho.match.insertBefore(ho.newNodeMatch,ho.refMatch);
    }
};
