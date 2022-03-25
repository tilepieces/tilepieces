// https://stackoverflow.com/questions/7781963/js-get-array-of-all-selected-nodes-in-contenteditable-div
function nextNode(node) {
    if (node.hasChildNodes()) {
        return node.firstChild;
    } else {
        while (node && !node.nextSibling) {
            node = node.parentNode;
        }
        if (!node) {
            return null;
        }
        return node.nextSibling;
    }
}
function getSelectedNodes(range) {
    var node = range.startContainer;
    var endNode = range.endContainer;
    // Special case for a range that is contained within a single node
    if (node == endNode) {
        if(node.nodeType == 3) {
            if (range.endOffset != node.textContent.length)
                node.splitText(range.endOffset);
            if (range.startOffset > 0)
                node = node.splitText(range.startOffset);
        }
        return [node];
    }
    // Iterate nodes until we hit the end container
    var rangeNodes = [];
    while (node && node != endNode) {
        node = nextNode(node);
        node && node!=endNode && node.nodeType == 3 && node.nodeValue.trim() && rangeNodes.push(node);
    }
    if(node==endNode){
        if(node.nodeType == 3 && range.endOffset != node.textContent.length)
            node.splitText(range.endOffset);
        rangeNodes.push(node);
    }
    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node != range.commonAncestorContainer) {
        if(node.nodeType == 3 && node.nodeValue.trim() && node === range.startContainer) {
            if(range.startOffset > 0) {
                var newNode = node.splitText(range.startOffset);
                rangeNodes.unshift(newNode);
            }
            else
                rangeNodes.unshift(node);
        }
        node = node.parentNode;
    }
    return rangeNodes;
}