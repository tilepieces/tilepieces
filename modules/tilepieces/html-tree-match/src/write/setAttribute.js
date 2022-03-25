HTMLTreeMatch.prototype.setAttribute = function(el,attrName,attrValue){
    var $self = this;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute(attrName) != el.getAttribute(attrName)))
        throw new Error("[HTMLTreeMatch setAttribute] no match");
    var match = found.match;
    var oldAttribute = el.getAttribute(attrName);
    if(oldAttribute == attrValue)
        return;
    el.setAttribute(attrName,attrValue);
    match.setAttribute(attrName,attrValue);
    $self.setHistory({
        el,
        attrName,
        attrValue,
        match,
        oldAttribute,
        method : "setAttribute"
    });
};
historyMethods.setAttribute = {
    undo : historyMethods=>{
        if(historyMethods.oldAttribute != null) {
            historyMethods.el.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
            historyMethods.match.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
        }
        else{
            historyMethods.el.removeAttribute(historyMethods.attrName);
            historyMethods.match.removeAttribute(historyMethods.attrName);
        }
    },
    redo : historyMethods=>{
        historyMethods.el.setAttribute(historyMethods.attrName,historyMethods.attrValue);
        historyMethods.match.setAttribute(historyMethods.attrName,historyMethods.attrValue);
    }
}
