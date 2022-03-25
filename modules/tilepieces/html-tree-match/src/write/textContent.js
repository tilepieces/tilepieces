HTMLTreeMatch.prototype.textContent = function(el,text){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch textContent] no match");
    var match = found.match;
    var oldTxtContent = el.textContent;
    var oldMatchTxtContent = match.textContent;
    el.textContent = text;
    match.textContent = text;
    $self.setHistory({
        el,
        match,
        text,
        oldTxtContent,
        oldMatchTxtContent,
        method : "textContent"
    });
};
historyMethods.textContent = {
    undo : ho=>{
        ho.el.textContent = ho.oldTxtContent;
        ho.match.textContent = ho.oldMatchTxtContent;
    },
    redo : ho=>{
        ho.el.textContent = ho.text;
        ho.match.textContent = ho.text;
    }
}