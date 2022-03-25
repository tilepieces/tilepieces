function insertTextAtCursor(text,t) {
    var sel, range;
    sel = t.ownerDocument.defaultView.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(t.ownerDocument.createTextNode(text));
    t.dispatchEvent(new KeyboardEvent("input", {bubbles : true}));
    window.dispatchEvent(new Event("WYSIWYG-modify"))
}
function onPaste(e){
    var target = e.target;
    var clipboardData = e.clipboardData;
    if (clipboardData && clipboardData.getData) {
        var text = clipboardData.getData("text/plain");
        if (text.length)
            return;//insertTextAtCursor(text, target);
        else{
            for(var i = 0;i<clipboardData.items.length;i++){
                var file = clipboardData.files[i];
                e.preventDefault();
                if(file.type.startsWith("image/"))
                    window.dispatchEvent(new CustomEvent("onContentEditablePasteImage", {
                        detail:{
                            file,
                            target
                        }
                    }))
            }
        }
    }
}