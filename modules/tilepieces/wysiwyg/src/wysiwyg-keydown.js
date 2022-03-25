/*
 If the endContainer is a Node of type Text, Comment, or CDATASection,
 then the offset is the number of characters from the start of the endContainer
 to the boundary point of the Range. For other Node types, the endOffset is the number of child
 nodes between the start of the endContainer and the boundary point of the Range.
 */
opener.addEventListener("WYSIWYG-keydown",ev=>{
    var el = ev.detail.el;
    var e = ev.detail.e;
    var doc = el.getRootNode();
    if(e.key == "Enter") {
        e.preventDefault();
        createNotEditableTag("br");
        el.dispatchEvent(new Event('input'))
    }
});