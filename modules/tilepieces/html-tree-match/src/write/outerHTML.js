HTMLTreeMatch.prototype.outerHTML = function(el,text){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch outerHTML] no match");
    var match = found.match;
    var placeholderDiv = el.ownerDocument.createElement("div");
    var placeholderMatchDiv = match.ownerDocument.createElement("div");
    placeholderDiv.innerHTML = text;
    placeholderMatchDiv.innerHTML = text;
    var newNodes = [...placeholderDiv.childNodes];
    var newMatchNodes = [...placeholderMatchDiv.childNodes];
    el.replaceWith(...newNodes);
    match.replaceWith(...newMatchNodes);
    $self.setHistory({
        el,
        match,
        newNodes,
        newMatchNodes,
        method : "outerHTML"
    });
};
historyMethods.outerHTML = {
    undo : ho=>{
        ho.newNodes[0].before(ho.el);
        ho.newMatchNodes[0].before(ho.match);
        ho.newNodes.forEach(v=>v.remove());
        ho.newMatchNodes.forEach(v=>v.remove());
    },
    redo : ho=>{
        ho.el.replaceWith(...ho.newNodes);
        ho.match.replaceWith(...ho.newMatchNodes);
    }
}