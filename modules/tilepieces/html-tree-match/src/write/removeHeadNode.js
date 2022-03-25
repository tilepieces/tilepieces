HTMLTreeMatch.prototype.removeHeadNode = function(node){
    var $self = this;
    var match = [...$self.source.head.children].find(v=>v.isEqualNode(node));
    if(!match){
        console.error("no match");
        console.trace();
        return;
    }
    var parentNode = node.ownerDocument.head;
    var nodeIndex = [...parentNode.childNodes].findIndex(v=>v==node);
    var parentMatch = $self.source.head;
    var matchIndex = [...parentMatch.childNodes].findIndex(v=>v==match);
    var oldChild = node.ownerDocument.head.removeChild(node);
    var oldMatch = $self.source.head.removeChild(match);
    $self.setHistory({
        node,
        parentNode,
        match,
        nodeIndex,
        parentMatch,
        matchIndex,
        oldChild,
        oldMatch,
        method : "removeChild"
    });
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
};
function addHeadNodeUndo(historyObject){
    var parentNode = historyObject.parentNode;
    var parentMatch = historyObject.parentMatch;
    var nodePivot = parentNode.childNodes[historyObject.nodeIndex];
    if(nodePivot)
        parentNode.insertBefore(historyObject.oldChild,nodePivot.nextSibling);
    else
        parentNode.appendChild(nodePivot);

    var matchPivot=parentMatch.childNodes[historyObject.matchIndex];
    if(matchPivot)
        parentMatch.insertBefore(historyObject.oldMatch,nodePivot.nextSibling);
    else
        parentMatch.appendChild(nodePivot);
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
}
