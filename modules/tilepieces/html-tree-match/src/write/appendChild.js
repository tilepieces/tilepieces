HTMLTreeMatch.prototype.appendChild = function(el,child){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch appendChild] no match");
    var match = found.match;
    el.appendChild(child);
    var newMatch = child.cloneNode(true);
    match.appendChild(newMatch);
    $self.setHistory({
        el,
        match,
        newMatch,
        newEl:child,
        method : "appendChild"
    });
};
historyMethods.appendChild = {
    undo : ho=>{
        ho.el.removeChild(ho.newEl);
        ho.match.removeChild(ho.newMatch);
    },
    redo : ho=>{
        ho.el.appendChild(ho.newEl);
        ho.match.appendChild(ho.newMatch);
    }
}