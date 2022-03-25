HTMLTreeMatch.prototype.insertAdjacentElement = function(el,position,newEl){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch insertAdjacentElement] no match");
    var match = found.match;
    var newEls = newEl.nodeType==11 ? [...newEl.childNodes] : [newEl];
    var newMatch = newEl.cloneNode(true);
    var newMatches = newMatch.nodeType==11 ? [...newMatch.childNodes] : [newMatch];
    el[position](newEl);
    match[position](newMatch);
    $self.setHistory({
        el,
        match,
        newMatches,
        newEls,
        position,
        method : "insertAdjacentElement"
    });
};
historyMethods.insertAdjacentElement = {
    undo : ho=>{
        ho.newEls.forEach(n=>n.remove());
        ho.newMatches.forEach(n=>n.remove());
    },
    redo : ho=>{
        ho.el[ho.position](...ho.newEls);
        ho.match[ho.position](...ho.newMatches);
    }
};
