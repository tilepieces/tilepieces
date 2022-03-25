function getLevels(el,bodyRoot){
    var levels = [];
    do{
        levels.unshift(el);
        if((el.tagName == "HTML" && el.ownerDocument.defaultView.frameElement)||
            (el == el.ownerDocument.body && el != bodyRoot))
            el = el.ownerDocument.defaultView.frameElement;
        else
            el = el.parentElement;
    }
    while(el && el != bodyRoot);
    return levels;
}