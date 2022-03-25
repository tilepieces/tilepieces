function doLastSelection(range,currentDocument,contenteditable){
    //
    contenteditable.focus();
    //
    var start;
    var body = currentDocument.body;
    if(body.contains(range.startContainer))
        start = range.startContainer;
    else
        start = getChildFromTree(contenteditable,
            range.startContainerTree);
    var end;
    if(body.contains(range.endContainer))
        end = range.endContainer;
    else
        end = getChildFromTree(contenteditable,
            range.endContainerTree);
    var newRange = currentDocument.createRange();
    try {
        newRange.setStart(start, range.startOffset);
    }
    catch(e){
        console.error(e);
        return;
    }
    if (range.collapsed)
        newRange.collapse(true);
    else {
        try {
            newRange.setEnd(end, range.endOffset);
        }
        catch(e){
            console.error(e);
            return;
        }
    }
    var sel = currentDocument.defaultView.getSelection();
    sel.removeAllRanges();
    sel.addRange(newRange);
    // calculating if is in view. If not, scroll to pos;
    /*
    var win = frontartApp.currentDocument.defaultView;
    var pos = newRange.getBoundingClientRect();
    //var iframesPos = win.frameElement.getBoundingClientRect();
    if(pos < win.scrollY ||
        pos > ( win.scrollY + win.innerHeight )){
        var currentY = pos - 100;
        currentY = currentY < 0 ? 0 : currentY;
        win.scrollTo(win.scrollX,currentY);
    }
    */
}