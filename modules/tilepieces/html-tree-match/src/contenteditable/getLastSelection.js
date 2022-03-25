function getLastSelection(contenteditable){
    var selection = contenteditable.ownerDocument.defaultView.getSelection();
    var range = selection.getRangeAt(0);
    return {
        startContainer : range.startContainer,
        startOffset : range.startOffset,
        startContainerTree : getChildTree(contenteditable,range.startContainer),
        collapsed : range.collapsed,
        endContainer : range.endContainer,
        endContainerTree : getChildTree(contenteditable,range.endContainer),
        endOffset : range.endOffset
    };
};
HTMLTreeMatch.prototype.getLastSelection = getLastSelection;