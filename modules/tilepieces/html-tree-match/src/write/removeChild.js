HTMLTreeMatch.prototype.removeChild = function(node){
    var $self = this;
    var parentNode = node.parentNode;
    var found = $self.find(node);
    if(!found)
        throw new Error("[HTMLTreeMatch removeChild] no match");
    var match = found.match;
    var parentMatch = match.parentNode;
    var nodeSibling = node.nextSibling;
    var matchSibling = match.nextSibling;
    var oldChild = parentNode.removeChild(node);
    var oldMatch = parentMatch.removeChild(match);
    $self.setHistory({
        el:node,
        match,
        nodeSibling,
        parentNode,
        parentMatch,
        matchSibling,
        oldChild,
        oldMatch,
        method : "removeChild"
    });
};
historyMethods.removeChild = {
    undo:ho=>{
        var c = ho.oldChild;
        if(ho.nodeSibling && ho.nodeSibling.parentNode) {
            ho.parentNode.insertBefore(c, ho.nodeSibling);
            ho.parentMatch.insertBefore(ho.oldMatch, ho.matchSibling);
        }
        else{
            ho.parentNode.appendChild(c);
            ho.parentMatch.appendChild(ho.oldMatch);
        }
    },
    redo:ho=>{
        ho.parentNode.removeChild(ho.oldChild);
        ho.parentMatch.removeChild(ho.oldMatch);
    }
};
