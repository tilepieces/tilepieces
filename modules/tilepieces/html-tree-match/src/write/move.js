HTMLTreeMatch.prototype.move = function(pivotEl,el,position){
    var $self = this;
    var pivotElFound = $self.find(pivotEl);
    if(!pivotElFound)
        throw new Error("[HTMLTreeMatch move] pivotEl no match");
    var pivotElMatch = pivotElFound.match;
    var elFound = $self.find(el);
    if(!elFound)
        throw new Error("[HTMLTreeMatch move] el no match");
    var elMatch = elFound.match;
    var parentNode = el.parentNode;
    var parentMatch = elMatch.parentNode;
    var elSibling = el.nextSibling;
    var matchSibling = elMatch.nextSibling;
    pivotEl[position](el);
    pivotElMatch[position](elMatch);
    $self.setHistory({
        el,
        pivotEl,
        pivotElMatch,
        elMatch,
        position,
        parentNode,
        parentMatch,
        elSibling,
        matchSibling,
        method : "move"
    });
};
historyMethods.move = {
    undo : ho=>{
        if(ho.elSibling && ho.elSibling.parentNode) {
            ho.parentNode.insertBefore(ho.el, ho.elSibling);
            ho.parentMatch.insertBefore(ho.elMatch, ho.matchSibling);
        }
        else{
            ho.parentNode.appendChild(ho.el);
            ho.parentMatch.appendChild(ho.elMatch);
        }
    },
    redo : ho=>{
        ho.pivotEl[ho.position](ho.el);
        ho.pivotElMatch[ho.position](ho.elMatch);
    }
};