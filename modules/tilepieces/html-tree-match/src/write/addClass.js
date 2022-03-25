HTMLTreeMatch.prototype.addClass = function(el,className){
    var $self = this;
    if(el.classList.contains(className))
        return;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute('class') != el.getAttribute('class')))
        throw new Error("[HTMLTreeMatch addClass] no match");
    var match = found.match;
    var wasWithout;
    if(!el.hasAttribute("class"))
        wasWithout = true;
    el.classList.add(className);
    match.classList.add(className);
    $self.setHistory({
        el,
        match,
        $self,
        wasWithout,
        className,
        method : "addClass"
    });
};
historyMethods.addClass = {
    undo: ho=>{
        ho.el.classList.remove(ho.className);
        ho.match.classList.remove(ho.className);
        if(ho.wasWithout){
            ho.el.removeAttribute("class");
            ho.match.removeAttribute("class");
        }
    },
    redo: ho=>{
        ho.el.classList.add(ho.className);
        ho.match.classList.add(ho.className);
    }
}
