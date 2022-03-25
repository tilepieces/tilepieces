function insertString(string){
    var doc = globalRange.startContainer.ownerDocument;
    var text= doc.createTextNode(string);
    globalRange.extractContents();
    globalRange.insertNode(text);
    globalRange.setStartAfter(text);
    globalRange.collapse(true);
}