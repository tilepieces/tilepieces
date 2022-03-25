HTMLTreeMatch.prototype.removeClass = function(el,className){
    var $self = this;
    if(!el.classList.contains(className))
        return;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute('class') != el.getAttribute('class')))
        throw new Error("[HTMLTreeMatch removeClass] no match");
    var match = found.match;
    el.classList.remove(className);
    match.classList.remove(className);
    $self.setHistory({
        el,
        match,
        className,
        method : "removeClass"
    });
};
historyMethods.removeClass = {
    undo: ho=>{
        ho.el.classList.add(ho.className);
        ho.match.classList.add(ho.className);
    },
    redo: ho=>{
        ho.el.classList.remove(ho.className);
        ho.match.classList.remove(ho.className);
    }
}
