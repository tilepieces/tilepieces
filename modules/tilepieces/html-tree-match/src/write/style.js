HTMLTreeMatch.prototype.style = function(el,prop,value,priority){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.attributes)
        throw new Error("[HTMLTreeMatch style] no match");
    var match = found.match;
    var wasWithout;
    if(!el.hasAttribute("style"))
        wasWithout = true;
    var oldValue = el.style.getPropertyValue(prop);
    var oldPriority = el.style.getPropertyPriority(prop);
    if(value == oldValue && priority == oldPriority)
        return;
    el.style.setProperty(prop, value, priority);
    var newProp = el.style.getPropertyValue(prop);
    var newPrior = el.style.getPropertyPriority(prop);
    if(newProp==oldValue && newPrior==oldPriority)
        return;
    match.style.setProperty(prop, value, priority);
    $self.setHistory({
        el,
        match,
        prop,
        value,
        oldValue,
        oldPriority,
        wasWithout,
        priority,
        method : "style"
    });
};
historyMethods.style = {
    undo:ho=>{
        ho.el.style.setProperty(ho.prop, ho.oldValue, ho.oldPriority);
        ho.match.style.setProperty(ho.prop, ho.oldValue, ho.oldPriority);
        if(ho.wasWithout){
            ho.el.removeAttribute("style");
            ho.match.removeAttribute("style");
        }
    },
    redo:ho=>{
        ho.el.style.setProperty(ho.prop,ho.value, ho.priority);
        ho.match.style.setProperty(ho.prop,ho.value, ho.priority);
    }
}
