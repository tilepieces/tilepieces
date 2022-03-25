function removeTag(tagName,contenteditable){
    var selectionContents = getSelectedNodes(globalRange);
    var range = globalRange;
    var startContainer = range.startContainer.nodeType != 3 ?
        range.startContainer : range.startContainer.parentElement;
    var commonAncestor = range.commonAncestorContainer;
    var doc = startContainer.ownerDocument;
    if(!selectionContents.length || selectionContents.length == 1) {
        var swap = startContainer;
        var frag = swap.ownerDocument.createDocumentFragment();
        var toAppend = frag;
        while (swap && swap.nodeName.toLowerCase() != tagName.toLowerCase()) {
            var cloneNode = swap.cloneNode();
            cloneNode.removeAttribute("id");
            toAppend.appendChild(cloneNode);
            toAppend = cloneNode;
            swap = swap.parentNode;
        }
        var collapsed = range.collapsed;
        var newTextT = collapsed ? "\uFEFF\uFEFF" : range.toString();
        var first = splitTag(swap, range,selectionContents[0],!collapsed);
        var newText = toAppend.appendChild(swap.ownerDocument.createTextNode(newTextT));
        if (first.textContent.replace(zeroWidthChars,"").length)
            swap.parentNode.insertBefore(first, swap);
        swap.parentNode.insertBefore(frag,swap);
        if (!swap.textContent.replace(zeroWidthChars,"").length)
            swap.parentNode.removeChild(swap);
        if(collapsed) {
            range.setStart(newText, 1);
            range.collapse(true);
        }
        else {
            range.extractContents();
            selectionContents[0] && selectionContents[0].parentNode.removeChild(selectionContents[0]);
            range.selectNodeContents(newText);
        }
    }
    else
        selectionContents.forEach((v,i,a)=>{
            var parent = v.parentElement;
            var el, toMove = [];
            while(parent!=commonAncestor){
                if(parent.tagName == tagName.toUpperCase()){
                    el = parent;
                    break;
                }
                else toMove.push(parent);
                parent = parent.parentElement;
            }
            if (el) {
                var elSanitizeContent = el.textContent.replace(zeroWidthChars, "");
                var vTextContent = v.textContent.replace(zeroWidthChars, "");
                if (elSanitizeContent != vTextContent) {
                    var startsWith = elSanitizeContent.startsWith(vTextContent);
                    var frag = doc.createDocumentFragment();
                    var newEl = frag;
                    toMove.forEach(p=> {
                        var newNested = p.cloneNode();
                        newEl.appendChild(newNested);
                        newEl = newNested;
                    });
                    newEl.appendChild(v);
                    if (startsWith)
                        el.before(frag);
                    else
                        el.after(frag);
                    if (!el.textContent.replace(zeroWidthChars, "").length)
                        el.remove();
                }
                else
                    unwrap([...el.childNodes]);
            }
            if (i == 0)
                range.setStart(v, 0);
            if (i == a.length - 1)
                range.setEnd(v, v.textContent.length);
        });
}