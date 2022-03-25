function highlightSelection(el){
    var sel = el.ownerDocument.getSelection();
    var isCollapsed = sel.isCollapsed;
    if(!isCollapsed){
        var range = sel.getRangeAt(0);
        var boundings = range.getBoundingClientRect();
        var win = el.ownerDocument.defaultView;
        var frame = win.frameElement;
        var ibound = frame ? frame.getBoundingClientRect() : {x:0,y:0};
        // we assume that iframe has no border, no padding etc.;
        highlightSel.style.width = boundings.width + "px";
        highlightSel.style.height = boundings.height + "px";
        highlightSel.style.transform =
            "translate("+(ibound.x + boundings.left) +"px,"+(ibound.y + boundings.top) +"px)"
    }
    else
        highlightSel.style.transform =
            "translate(-9999px,-9999px)";
}