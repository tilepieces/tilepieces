HTMLTreeMatch.prototype.addHeadNode = function(node){
    var $self = this;
    var newMatch = node.cloneNode(true);
    node.ownerDocument.head.appendChild(node);
    $self.source.head.appendChild(newMatch);
    $self.setHistory({
        newMatch,
        el:node,
        nodeDocument:node.ownerDocument,
        matchDocument:$self.source,
        method : "addHeadNode"
    });
};
historyMethods.addHeadNode = {
    undo : ho=>{
        ho.nodeDocument.head.removeChild(ho.el);
        ho.matchDocument.head.removeChild(ho.newMatch);
    },
    redo : ho=>{
        ho.nodeDocument.head.appendChild(ho.el);
        ho.matchDocument.head.appendChild(ho.newMatch);
    }
};
