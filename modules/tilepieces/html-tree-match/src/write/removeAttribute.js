HTMLTreeMatch.prototype.removeAttribute = function(el,attrName){
    var $self = this;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute(attrName) != el.getAttribute(attrName)))
        throw new Error("[HTMLTreeMatch removeAttribute] no match");
    var match = found.match;
    var oldAttribute = el.getAttribute(attrName);
    if(oldAttribute == null)
        return;
    el.removeAttribute(attrName);
    match.removeAttribute(attrName);
    $self.setHistory({
        el,
        match,
        attrName,
        oldAttribute,
        method : "removeAttribute"
    });
};
historyMethods.removeAttribute = {
    undo : historyMethods=>{
        historyMethods.el.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
        historyMethods.match.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
    },
    redo : historyMethods=>{
        historyMethods.el.removeAttribute(historyMethods.attrName);
        historyMethods.match.removeAttribute(historyMethods.attrName);
    }
}