// TODO TESTS!
HTMLTreeMatch.prototype.removeNodeList = function(nodeList){
    var $self = this;
    var list = [];
    [...nodeList].forEach(n=>{
        var parentNode = n.parentNode;
        var found = $self.find(n);
        if(!found){
            console.error("[HTMLTreeMatch removeNodeList] not found element",n);
            console.error("[HTMLTreeMatch removeNodeList] continue",n);
            return;
        }
        var match = found.match;
        var parentMatch = match.parentNode;
        list.push({
            nodeSibling : n.nextSibling,
            matchSibling : match.nextSibling,
            oldChild : parentNode.removeChild(n),
            oldMatch : parentMatch.removeChild(match),
            parentNode,
            match,
            parentMatch
        });
    });
    $self.setHistory({
        list,
        method : "removeNodeList"
    });
};
historyMethods.removeNodeList = {
    undo:ho=>{
        ho.list.forEach(v=>{
            var c = v.oldChild;
            if(v.nodeSibling && v.nodeSibling.parentNode) {
                v.parentNode.insertBefore(c, v.nodeSibling);
                v.parentMatch.insertBefore(v.oldMatch, v.matchSibling);
            }
            else{
                v.parentNode.appendChild(c);
                v.parentMatch.appendChild(v.oldMatch);
            }
        })
    },
    redo:ho=>{
        ho.list.forEach(v=> {
            v.parentNode.removeChild(v.oldChild);
            v.parentMatch.removeChild(v.oldMatch);
        });
    }
};
