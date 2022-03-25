function addTag(tagName,properties = [],node = false,contenteditable = null){
    if(tagName.toUpperCase().match(app.utils.notEditableTags)){
        createNotEditableTag(tagName,node);
        return;
    }
    var range = globalRange;
    var selectionContents = textNodesUnder(globalRange.commonAncestorContainer).filter(v=>v.textContent.trim()); //getSelectedNodes(globalRange);
    var startContainer = range.startContainer.nodeType != 3 ?
        range.startContainer : range.startContainer.parentElement;
    var doc = startContainer.ownerDocument;
    if(!selectionContents.length || selectionContents.length == 1){
        var newSpan = doc.createElement(tagName);
        properties.forEach(v=>newSpan.setAttribute(v.name,v.value));
        if (range.collapsed) {
            if(tagName == "a")
                newSpan.appendChild(doc.createTextNode("\uFEFF\uFEFF"));
            else {
                newSpan.appendChild(doc.createTextNode("\uFEFF"));
            }
            range.insertNode(newSpan);
            range.collapse(true);
            range.setStart(newSpan.firstChild,1);
        }
        else{
            newSpan.appendChild(range.extractContents());
            if(tagName == "a") {
                if(newSpan.textContent.charCodeAt(0) != 65279)
                    newSpan.insertBefore(doc.createTextNode("\uFEFF"),newSpan.firstChild);
                if(newSpan.textContent.charCodeAt(newSpan.textContent.length-1) != 65279)
                    newSpan.appendChild(doc.createTextNode("\uFEFF"));
            }
            range.insertNode(newSpan);
            range.selectNodeContents(newSpan);
        }
    }
    else {
        var newRange = new Range();
        selectionContents.forEach((v, i, a)=> {
            var parent = v.parentElement;
            var newEl = doc.createElement(tagName);
            properties.forEach(v=>newEl.setAttribute(v.name,v.value));
            while(parent) { // check if already has this tag
                if(parent.tagName == tagName.toUpperCase()) {
                    break;
                }
                else parent = parent.parentElement;
            }
            if(!parent) {
                 v.replaceWith(newEl);
                 newEl.appendChild(v);
            }
            if(i==0)
                newRange.setStart(v,0);
            if(i==a.length-1)
                newRange.setEnd(v,v.textContent.length);
        });
        globalSel.removeAllRanges();
        globalSel.addRange(newRange);
        globalRange = newRange;
    }
}