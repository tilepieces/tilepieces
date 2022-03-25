HTMLTreeMatch.prototype.insertAdjacentElements = function(el,position,newEls){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch insertAdjacentElements] no match");
    var match = found.match;
    if(!Array.isArray(newEls))
        newEls = [newEls];
    var newMatchs = [];
    if(position.match(/afterbegin|afterend/))
        newEls.reverse();
    newEls.forEach(ne=>{
        var newMatch = ne.cloneNode(true);
        newMatchs.push(newMatch);
        el.insertAdjacentElement(position, ne);
        match.insertAdjacentElement(position,newMatch);
    });
    $self.setHistory({
        el,
        match,
        position,
        newEls,
        newMatchs,
        method : "insertAdjacentElements"
    });
};
historyMethods.insertAdjacentElements = {
    undo : ho=>{
        ho.newEls.forEach(ne=>ne.remove());
        ho.newMatchs.forEach(ne=>ne.remove());
    },
    redo : ho=>{
        ho.newEls.forEach(ne=>ho.el.insertAdjacentElement(ho.position, ne));
        ho.newMatchs.forEach(ne=>ho.match.insertAdjacentElement(ho.position,ne));
    }
};
