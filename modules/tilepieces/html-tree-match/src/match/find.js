HTMLTreeMatch.prototype.find = function(el){
    var $self = this;
    var source=$self.source;
    var findMatch;
    $self.matches = $self.matches.filter(v=>{
        if(!v.DOMel.ownerDocument || !v.DOMel.ownerDocument.documentElement.contains(v.DOMel))
            return false;
        if(el==v.DOMel)
            findMatch = v;
        return true;
    });
    if(findMatch && !source.documentElement.contains(findMatch.match))
        $self.matches.splice($self.matches.indexOf(findMatch), 1);
    else if(findMatch) {
        var textMatch = findMatch.match.nodeType == 1 ?
            findMatch.match.innerHTML :
            findMatch.match.textContent;
        var textEl = el.nodeType == 1 ?
            el.innerHTML :
            el.textContent;
        return {
            attributes: findMatch.match.cloneNode().isEqualNode(el.cloneNode()),
            HTML: textMatch.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "")
            == textEl.replace(/[\u200B-\u200D\uFEFF\r\n]/g, ""),
            match: findMatch.match
        };
    }
    var match = $self.match(el);
    if(match)
        return{
            attributes:true,
            HTML:true,
            match:match
        };
    else return false;
}
