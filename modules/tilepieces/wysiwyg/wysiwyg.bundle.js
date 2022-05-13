(()=>{
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
function buttonTextLevelTag(element,tagName,
                            properties = [],
                            nodes = false){
    var isPermittedPhrasingTag = tagName.match(textPermittedPhrasingTags);
    var isPermittedFlowTag = tagName.match(textPermittedFlowTags);
    let aElement;
    let contenteditable;
    let tagNameLowerCase = tagName.toLowerCase();
    let tagNameUpperCase = tagName.toUpperCase();
    element.addEventListener("click",buttonProxy);
    function buttonProxy(e){
        if(!app.contenteditable)
            return;
        var doc = app.core.currentDocument;
        var win = doc.defaultView;
        globalSel = win.getSelection();
        if(!globalSel.anchorNode){
            console.error("No selection");
            return;
        }
        globalRange = globalSel.getRangeAt(0);
        if(element.classList.contains("selected"))
            removeTag(tagNameLowerCase,contenteditable);
        else
            addTag(tagNameLowerCase, properties, nodes,contenteditable);
        element.classList.toggle("selected");
        app.lastEditable.el.dispatchEvent(new Event('input'));
        app.lastEditable.el.focus();
    }
    opener.addEventListener("WYSIWYG-el-parsed",e=>{
        var parent = e.detail.target;
        contenteditable = e.detail.event.detail;
        aElement = null;
        do{
            if(parent.tagName == tagNameUpperCase) {
                aElement = parent;
                break;
            }
        }
        while(parent = parent.parentElement);
        if(aElement) {
            element.classList.add("selected");
            if(tagNameLowerCase == "a"){
                if(aElement.textContent.charCodeAt(0) != 65279)
                    aElement.insertBefore(aElement.ownerDocument.createTextNode("\uFEFF"),aElement.firstChild);
                if(aElement.textContent.charCodeAt(aElement.textContent.length-1) != 65279)
                    aElement.appendChild(aElement.ownerDocument.createTextNode("\uFEFF"));
            }
        }
        else
            element.classList.remove("selected");
    });
}
// https://stackoverflow.com/questions/56203483/how-to-detect-invisible-zero-width-or-whitespace-characters-in-unicode-in-java?noredirect=1&lq=1
// https://stackoverflow.com/questions/11305797/remove-zero-width-space-characters-from-a-javascript-string/11305926#11305926
//let zeroWidthChars = /\u{0}+|\u{feff}+|\u{200b}+|\u{200c}+|\u{200d}/gu;
let zeroWidthChars = /[\u200B-\u200D\uFEFF]/g;
let opener = window;
var app = opener.tilepieces;
let regexNumbers = /[+-]?\d+(?:\.\d+)?/; // https://codereview.stackexchange.com/questions/115885/extract-numbers-from-a-string-javascript
let globalSel,globalRange;
let textPermittedPhrasingTags = app.utils.textPermittedPhrasingTags;
let textPermittedFlowTags = app.utils.textPermittedFlowTags;
opener.addEventListener("WYSIWYG-start",e=>{
    var el = e.detail;
    globalSel = el.ownerDocument.defaultView.getSelection();
    if(!globalSel.anchorNode){
        console.error("WYSIWYG started with no selection. exit");
        return;
    }
    globalRange = globalSel.getRangeAt(0);
    var anchorNode = globalSel.anchorNode;
    var elToParse = anchorNode ?
        (anchorNode.nodeType == 3 ? anchorNode.parentElement : anchorNode) :
        el;
    opener.dispatchEvent(
        new CustomEvent("WYSIWYG-el-parsed",{detail:{target: elToParse,event:e}})
    )
});

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
function insertString(string){
    var doc = globalRange.startContainer.ownerDocument;
    var text= doc.createTextNode(string);
    globalRange.extractContents();
    globalRange.insertNode(text);
    globalRange.setStartAfter(text);
    globalRange.collapse(true);
}
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
function splitTag(el,range,p,removePivot){
    var pivot = p || range.commonAncestorContainer;
    if(!el.contains(pivot) && el != pivot){
        console.error("el,parentPivot ->",el,"\n",pivot);
        throw new Error("Error in split tag. Split tag called with !el.contains(parentPivot);")
    }
    var firstAncestor = el.nodeType != 3 ? el.cloneNode() : el.ownerDocument.createDocumentFragment();
    if(pivot.nodeType == 3 && pivot == range.commonAncestorContainer && range.collapsed) {
        if(range.startOffset == 0)
            return firstAncestor;
        else
            pivot = pivot.splitText(range.startOffset);
        /*
         else if(range.startOffset == pivot.textContent.length) {
         var newPivot = pivot.ownerDocument.createTextNode("");
         pivot.parentNode.appendChild(newPivot,pivot);
         pivot = newPivot;
         }
         */
    }
    if(el.nodeType != 3)
        firstAncestor.removeAttribute("id");
    if(pivot != el) {
        var split1 = pivot;
        while (split1 != el) {
            var newAncestor = split1.cloneNode();
            split1.id && split1.removeAttribute("id");
            if(firstAncestor.childNodes.length) {
                while(firstAncestor.firstChild)
                    newAncestor.appendChild(firstAncestor.firstChild);
                firstAncestor.appendChild(newAncestor);
            }
            else if(!removePivot)
                firstAncestor.appendChild(newAncestor);

            while(split1.previousSibling)
                firstAncestor.insertBefore(split1.previousSibling,firstAncestor.firstChild);
            split1 = split1.parentNode;
        }
    }
    return firstAncestor;
}
function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}
// https://stackoverflow.com/questions/37624455/how-to-remove-wrapper-of-multiple-elements-without-jquery?noredirect=1&lq=1
function unwrap(elems) {
    elems = Array.isArray(elems) ? elems : [elems];
    var newElements = [];
    for (var i = 0; i < elems.length; i++) {
        var elem        = elems[i];
        var parent      = elem.parentNode;
        var grandparent = parent.parentNode;
        newElements.push(grandparent.insertBefore(elem, parent));
        if (!parent.firstChild)
            grandparent.removeChild(parent);
    }
    return newElements;
}
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
window.wysiwyg = {
    removeTag,
    addTag,
    buttonTextLevelTag,
    insertString,
    selection:()=>globalSel,
    range:()=>globalRange
}
})();