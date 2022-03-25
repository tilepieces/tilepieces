HTMLTreeMatch.prototype.innerHTML = function(el,HTML){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch innerHTML] no match");
    var match = found.match;
    var oldHTML = [...el.childNodes];
    var oldMatchHTML = [...match.childNodes];
    el.innerHTML = HTML;
    match.innerHTML = HTML;
    var newHTML = [...el.childNodes];
    var newMatchHtml = [...match.childNodes];
    $self.setHistory({
        el,
        match,
        HTML,
        newHTML,
        newMatchHtml,
        oldMatchHTML,
        oldHTML,
        method : "innerHTML"
    });
};
historyMethods.innerHTML = {
    undo : ho=>{
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        ho.oldHTML.forEach(v=>
            ho.el.appendChild(v));
        ho.oldMatchHTML.forEach(v=>
            ho.match.appendChild(v));
    },
    redo : ho=>{
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        ho.newHTML.forEach(v=>
            ho.el.appendChild(v));
        ho.newMatchHtml.forEach(v=>
            ho.match.appendChild(v));
    }
}