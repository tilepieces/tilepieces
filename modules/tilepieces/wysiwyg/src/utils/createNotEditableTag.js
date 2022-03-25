function createNotEditableTag(tagName,node){
    var doc = globalRange.startContainer.ownerDocument;
    var el = node ? node.cloneNode(true) : doc.createElement(tagName);
    var last = node && node.nodeType == 11 ? el.lastChild : el;
    var textPlaceholder = doc.createTextNode("\uFEFF");
    globalRange.extractContents();
    globalRange.insertNode(el);
    globalRange.setStartAfter(last);
    globalRange.insertNode(textPlaceholder);
    globalRange.setStartAfter(textPlaceholder);
    globalRange.collapse(true);
}