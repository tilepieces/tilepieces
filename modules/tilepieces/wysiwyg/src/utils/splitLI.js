function splitLI(li){
    var list = li.parentNode;
    if(list.tagName.match(/UL|OL/))
        return;
    // avoid processing text nodes that are already removed
    var liChilds = [...li.childNodes].map(v=>v.cloneNode(true));
    var previousUl = li.ownerDocument.createElement("UL");
    while(li.previousElementSibling){
        previousUl.appendChild(li.previousElementSibling);
    }
    if(previousUl.children.length)
        list.before(previousUl);
    list.before(...liChilds);
    li.remove();
    if(!list.children.length)
        list.remove();
}