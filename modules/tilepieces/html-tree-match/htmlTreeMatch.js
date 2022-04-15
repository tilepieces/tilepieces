(()=>{
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
function getChildFromTree(father,tree){
    var res = father;
    for(var i = 0;i<tree.length;i++) {
        var el = res.childNodes[tree[i]];
        if (el)
            res = el;
        else
            return res;
    }
    return res;
}
function getChildTree(father,child){
    var swap = child;
    var tree = [];
    while(swap!=father){
        var childIndex = [...swap.parentNode.childNodes].indexOf(swap);
        tree.unshift(childIndex);
        swap = swap.parentNode;
    }
    return tree;
}

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
function highlightSelection(el){
    var sel = el.ownerDocument.getSelection();
    var isCollapsed = sel.isCollapsed;
    if(!isCollapsed){
        var range = sel.getRangeAt(0);
        var boundings = range.getBoundingClientRect();
        var win = el.ownerDocument.defaultView;
        var frame = win.frameElement;
        var ibound = frame ? frame.getBoundingClientRect() : {x:0,y:0};
        // we assume that iframe has no border, no padding etc.;
        highlightSel.style.width = boundings.width + "px";
        highlightSel.style.height = boundings.height + "px";
        highlightSel.style.transform =
            "translate("+(ibound.x + boundings.left) +"px,"+(ibound.y + boundings.top) +"px)"
    }
    else
        highlightSel.style.transform =
            "translate(-9999px,-9999px)";
}
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
HTMLTreeMatch.prototype.redo = function(){
    var $self = this;
    var history = $self.history;
    if(!history.entries.length
        || history.pointer == history.entries.length)
        return;
    lastEditable && lastEditable.destroy();
    var pointer = history.pointer;
    var historyEntry = history.entries[pointer];
    historyMethods[historyEntry.method].redo(historyEntry,$self);
    history.pointer++;
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
};
HTMLTreeMatch.prototype.setHistory = function(historyObject){
    var $self = this;
    var history = $self.history;
    var pointer = history.pointer;
    var entries = history.entries;
    if(pointer != entries.length)
        history.entries = entries.slice(0,pointer);
    history.pointer = history.entries.push(historyObject);
    /* dispatching */
    $self.dispatchEvent("history-entry",{pointer,historyObject});
    window.dispatchEvent(new Event(domChangeEvent));
};
HTMLTreeMatch.prototype.undo = function(){
    var $self = this;
    var history = $self.history;
    if(!history.entries.length || history.pointer == 0)
        return;
    lastEditable && lastEditable.destroy();
    var pointer;
    history.pointer--;
    pointer = history.pointer;
    var historyEntry = history.entries[pointer];
    if(historyEntry.method == "contenteditable"){
        if(history.pointer == 0)
            historyMethods.contenteditable.undo(historyEntry,$self.firstSelection,$self);
        else
            historyMethods.contenteditable.undo(historyEntry,{
                editable : history.entries[pointer-1].el,
                lastRange : history.entries[pointer-1].lastRange
            },$self,history.entries[pointer-1]);
    }
    else historyMethods[historyEntry.method].undo(historyEntry);
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
};
const domChangeEvent = "DOM-change";
let historyMethods = {};
function HTMLTreeMatch(source,contentDocument,skipMatchAll){
    var $self = this;
    var domparser = new DOMParser();
    $self.source = domparser.parseFromString(source, "text/html");
    $self.lastMatch = {
        el : null,
        match : null
    };
    $self.firstSelection = {};
  	$self.contentDocument = contentDocument;
    $self.history = {
        entries : [],
        pointer : 0
    };
    $self.matches = [];
    !skipMatchAll && [...contentDocument.querySelectorAll("*")].forEach(DOMel=>$self.match(DOMel));
    var events = {};
    $self.dispatchEvent = (event,eObj)=>{
        Array.isArray(events[event]) && events[event].forEach(func=>func(eObj))
    };
    $self.on = (e,cb)=>{
        if(events[e])
            events[e].push(cb);
        else
            events[e] = [cb]
    };
    return $self;
};
window.HTMLTreeMatch = function(source,doc,skipMatchAll){
    return new HTMLTreeMatch(source,doc || document,skipMatchAll);
};
HTMLTreeMatch.prototype.find = function(el){
    var $self = this;
    var source=$self.source;
    var findMatch;
    $self.matches = $self.matches.filter(v=>{
        if(!v.DOMel.ownerDocument || !v.DOMel.ownerDocument.documentElement.contains(v.DOMel))
            return false;
        if(el==v.DOMel)
            findMatch = v;
        return true;
    });
    if(findMatch && !source.documentElement.contains(findMatch.match))
        $self.matches.splice($self.matches.indexOf(findMatch), 1);
    else if(findMatch) {
        var textMatch = findMatch.match.nodeType == 1 ?
            findMatch.match.innerHTML :
            findMatch.match.textContent;
        var textEl = el.nodeType == 1 ?
            el.innerHTML :
            el.textContent;
        return {
            attributes: findMatch.match.cloneNode().isEqualNode(el.cloneNode()),
            HTML: textMatch.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "")
            == textEl.replace(/[\u200B-\u200D\uFEFF\r\n]/g, ""),
            match: findMatch.match
        };
    }
    var match = $self.match(el);
    if(match)
        return{
            attributes:true,
            HTML:true,
            match:match
        };
    else return false;
}

function getLevels(el,bodyRoot){
    var levels = [];
    do{
        levels.unshift(el);
        if((el.tagName == "HTML" && el.ownerDocument.defaultView.frameElement)||
            (el == el.ownerDocument.body && el != bodyRoot))
            el = el.ownerDocument.defaultView.frameElement;
        else
            el = el.parentElement;
    }
    while(el && el != bodyRoot);
    return levels;
}
function isEqualNode(el,equalNode,isLast,relax=true){
    //*
    var cloneChildrenArray = isLast ? [...el.childNodes] :[...el.children];
    var find = cloneChildrenArray.filter(child=>{
        if(!isLast || relax)
            return child.cloneNode().isEqualNode(equalNode.cloneNode());
        //return child.nodeName == equalNode.nodeName;
        else {
            // innerText is not always valorized ( see drag/automatic_test )
            // textContent has some problem with spaces...
            var childText = child.textContent;
            var equalNodeText = equalNode.textContent;
            var isEqual = equalNode.nodeType == 3 ?
            childText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") ==
            equalNodeText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") :
            child.outerHTML == equalNode.outerHTML;
            return isEqual;
        }
    });
    if(find.length > 1){
        var originalChilds = isLast ? [...equalNode.parentNode.childNodes] : [...equalNode.parentNode.children];
        var originals = originalChilds.filter(child=>{
            if(!isLast || relax)
                return child.cloneNode().isEqualNode(equalNode.cloneNode());
            else {
                var childText = child.textContent;
                var equalNodeText = equalNode.textContent;
                var isEqual = equalNode.nodeType == 3 ?
                childText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") ==
                equalNodeText.replace(/[\u200B-\u200D\uFEFF\r\n]/g, "") :
                child.outerHTML == equalNode.outerHTML;
                return isEqual;
            }
        });
        if(originals.length !== find.length && !relax) // comparing the two trees, there is a difference in length for the current searched noded. return false
            return false;
        var originalPosition = originals.indexOf(equalNode);
        return find[originalPosition];
    }
    return find[0];

}
HTMLTreeMatch.prototype.match = function(el,takeLastMatch = true,relax = false,inverse = false){
    var $self = this;
    var source=inverse ? $self.contentDocument : $self.source;
    var startLevel = source.body;
    var startLevelToCompare= inverse ? $self.source.body : el.getRootNode().body;
    ////
    if(el.tagName == "HTML")
        if(el.cloneNode().isEqualNode(source.documentElement.cloneNode())) {
            !$self.matches.find(v=>v.DOMel == el) &&
            $self.matches.push({
                match : source.documentElement,
                DOMel : el
            });
            return source.documentElement;
        }
        else
            return false;
    if(el.tagName == "HEAD")
        if(el.cloneNode().isEqualNode(source.head.cloneNode())) {
            !$self.matches.find(v=>v.DOMel == el) &&
            $self.matches.push({
                match : source.head,
                DOMel : el
            });
            return source.head;
        }
        else
            return false;
    if(el.ownerDocument.head.contains(el)){
        /*
        var matchHead = $self.matchHead(el);
        matchHead && !$self.matches.find(v=>v.DOMel == el) &&
        $self.matches.push({
            match : matchHead,
            DOMel : el
        });
        return matchHead*/
        startLevel = source.head;
        startLevelToCompare = el.ownerDocument.head;
    }
    if(el.tagName == "BODY")
        if(el.cloneNode().isEqualNode(source.body.cloneNode())){
            !$self.matches.find(v=>v.DOMel == el) &&
            $self.matches.push({
                match : source.body,
                DOMel : el
            });
            return source.body;
        }
        else
            return false;
    var elementToChange = null;
    var levels = getLevels(el,startLevelToCompare);
    for(var search = levels.length-1;search>=0;search--){
        var elInner = levels[search];
        if(elInner.id) {
            try {
                var searchDoubleId = source.querySelectorAll("#" + elInner.id);
            }catch(e){break}
            if(searchDoubleId.length > 1)
                break;
            startLevel = source.getElementById(elInner.id);
            if(!startLevel)
                return;
            //
            if(search == levels.length-1) {
                //if(startLevel.isEqualNode(elInner)) {
                    $self.matches.push({
                        match : startLevel,
                        DOMel : el
                    });
                    return startLevel;
                /*
                }
                else
                    return false;*/
            }
            else
                levels = levels.slice(search+1, levels.length);
            break;
        }
    }
    for(var i = 0;i<levels.length;i++){
        var elToCompare = levels[i];
        var isLast = i==levels.length-1;
        var searchMatches = $self.matches.find(v=>v.DOMel == elToCompare);
        var found = (!inverse && searchMatches &&
            $self.source.documentElement.contains(searchMatches.match) &&
            searchMatches.match) ||
            isEqualNode(startLevel,elToCompare,isLast,relax);
        if(!found)
            break;
        startLevel = found;
        if(i==levels.length-1)
            elementToChange = found;
    }
    elementToChange && !$self.matches.find(v=>v.DOMel == el) &&
        $self.matches.push({
            match : elementToChange,
            DOMel : el
        });
    return elementToChange;
};
HTMLTreeMatch.prototype.matchHead = function(node){
    var $self = this;
    return [...$self.source.head.children].find(v=>v.isEqualNode(node));
};
HTMLTreeMatch.prototype.addClass = function(el,className){
    var $self = this;
    if(el.classList.contains(className))
        return;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute('class') != el.getAttribute('class')))
        throw new Error("[HTMLTreeMatch addClass] no match");
    var match = found.match;
    var wasWithout;
    if(!el.hasAttribute("class"))
        wasWithout = true;
    el.classList.add(className);
    match.classList.add(className);
    $self.setHistory({
        el,
        match,
        $self,
        wasWithout,
        className,
        method : "addClass"
    });
};
historyMethods.addClass = {
    undo: ho=>{
        ho.el.classList.remove(ho.className);
        ho.match.classList.remove(ho.className);
        if(ho.wasWithout){
            ho.el.removeAttribute("class");
            ho.match.removeAttribute("class");
        }
    },
    redo: ho=>{
        ho.el.classList.add(ho.className);
        ho.match.classList.add(ho.className);
    }
}

HTMLTreeMatch.prototype.addColumn = function(tableEl,index){
    var $self = this;
    var tableFound = $self.find(tableEl);
    if(!tableFound || !tableFound.HTML)
        throw new Error("[HTMLTreeMatch addColumn] no match");
    var tableMatch = tableFound.match;
    [...tableEl.rows].forEach(v=>{
        v.insertCell(index)
    });
    [...tableMatch.rows].forEach(v=>{
        v.insertCell(index)
    });
    $self.setHistory({
        tableEl,
        $self,
        tableMatch,
        index,
        method : "addColumn"
    });
};
historyMethods.addColumn = {
    undo : ho=>{
        [...ho.tableEl.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
        [...ho.tableMatch.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
    },
    redo : ho=>{
        [...ho.tableEl.rows].forEach(v=>{
            v.insertCell(ho.index)
        });
        [...ho.tableMatch.rows].forEach(v=>{
            v.insertCell(ho.index)
        });
    }
};

HTMLTreeMatch.prototype.addHeadNode = function(node){
    var $self = this;
    var newMatch = node.cloneNode(true);
    node.ownerDocument.head.appendChild(node);
    $self.source.head.appendChild(newMatch);
    $self.setHistory({
        newMatch,
        el:node,
        nodeDocument:node.ownerDocument,
        matchDocument:$self.source,
        method : "addHeadNode"
    });
};
historyMethods.addHeadNode = {
    undo : ho=>{
        ho.nodeDocument.head.removeChild(ho.el);
        ho.matchDocument.head.removeChild(ho.newMatch);
    },
    redo : ho=>{
        ho.nodeDocument.head.appendChild(ho.el);
        ho.matchDocument.head.appendChild(ho.newMatch);
    }
};

HTMLTreeMatch.prototype.after = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"after",child);
};
HTMLTreeMatch.prototype.append = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"append",child);
};
HTMLTreeMatch.prototype.appendChild = function(el,child){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch appendChild] no match");
    var match = found.match;
    el.appendChild(child);
    var newMatch = child.cloneNode(true);
    match.appendChild(newMatch);
    $self.setHistory({
        el,
        match,
        newMatch,
        newEl:child,
        method : "appendChild"
    });
};
historyMethods.appendChild = {
    undo : ho=>{
        ho.el.removeChild(ho.newEl);
        ho.match.removeChild(ho.newMatch);
    },
    redo : ho=>{
        ho.el.appendChild(ho.newEl);
        ho.match.appendChild(ho.newMatch);
    }
}
HTMLTreeMatch.prototype.before = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"before",child);
};
let lastEditable;
let contentEditableThrottle;
let styleContentEditable = document.createElement("style");
styleContentEditable.innerHTML = `[contenteditable]::selection,[contenteditable] *::selection{
background:transparent!important;
}`;
let highlightSel = document.createElement("div");
highlightSel.className = "highlight-contenteditable-selection";
highlightSel.style="position:absolute;top:0;left:0;transform:translate(-9999px,-9999px);z-index:2;" +
    "box-shadow:0 0 2px 2px rgb(0,0,0,0.4), 0 0 3px 3px rgb(255,255,255,0.4)";
//document.body.appendChild(highlightSel);
let oldHTML;
let oldMatchHTML;
function contentEditableOnInput($self,el,match){
    clearTimeout(contentEditableThrottle);
    contentEditableThrottle = setTimeout(()=> {
        oldHTML = [...el.childNodes];
        var newHTML = oldHTML.map(v=>v.cloneNode(true));
        var oldMatchHTML = [...match.childNodes].map(v=>v.cloneNode(true));
        match.innerHTML = "";
        for (var i = 0; i < newHTML.length; i++)
            match.appendChild(newHTML[i].cloneNode(true));
        var lastRange = getLastSelection(el);
        $self.setHistory({
            el,
            match,
            oldHTML,
            //HTML,
            oldMatchHTML,
            newHTML,
            lastRange,
            method: "contenteditable"
        });
        //oldHTML = HTML;
    },250);
}
function ce($self,el,match){
    let wasContentEditable;
    var hasBeenEdited = false;
    oldHTML = [...el.childNodes];
    oldMatchHTML = [...match.childNodes];
    el.innerHTML = "";
    oldHTML.forEach(v=>el.appendChild(v.cloneNode(true)));
    if(el.contentEditable != "true")
        el.setAttribute("contenteditable","");
    else wasContentEditable = true;
    //el.ownerDocument.head.appendChild(el.ownerDocument.adoptNode(styleContentEditable,true));
    setTimeout(()=>{
        var sel = el.ownerDocument.defaultView.getSelection();
        var range = new Range();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
        window.dispatchEvent(new CustomEvent(
            "WYSIWYG-start",{detail:el}))
    });
    var proxyInput = function(e){
        //highlightSelection(el);
        hasBeenEdited = true;
        //contentEditableOnInput($self,el,match);
    };
    var selectionChange = function(e) {
        //highlightSelection(el);
        window.dispatchEvent(new CustomEvent(
            "WYSIWYG-start",{detail:el}))
    };
    var keydown = function(e) {
        //ctOnKeyDown(e,el);
        window.dispatchEvent(new CustomEvent(
            "WYSIWYG-start",{detail:el}))
        window.dispatchEvent(new CustomEvent(
            "WYSIWYG-keydown",{detail:{e,el}}));
    };
    let throttleHighlight;
    var scrollResizeHighlight = function(e) {
        clearTimeout(throttleHighlight);
        throttleHighlight = setTimeout(()=>{
            highlightSelection(el);
        });
    };
    el.addEventListener("input",proxyInput);
    el.addEventListener("keydown",keydown);
    el.ownerDocument.addEventListener('selectionchange',selectionChange);
    el.addEventListener("paste",onPaste);
    el.ownerDocument.addEventListener("scroll",scrollResizeHighlight,true);
    el.ownerDocument.defaultView.addEventListener("resize",scrollResizeHighlight);
    return lastEditable = {
        destroy : ()=>{
            if(!wasContentEditable)
                el.removeAttribute("contenteditable");
            //styleContentEditable.remove();
            highlightSel.style.transform =
                "translate(-9999px,-9999px)";
            el.removeEventListener("input",proxyInput);
            el.removeEventListener("keydown",keydown);
            el.removeEventListener("paste",onPaste);
            el.ownerDocument.removeEventListener("scroll",scrollResizeHighlight);
            el.ownerDocument.defaultView.removeEventListener("resize",scrollResizeHighlight);
            el.ownerDocument.removeEventListener('selectionchange',selectionChange);
            lastEditable = null;
            if(hasBeenEdited) {
                var newHTML = [...el.childNodes];
                while(match.firstChild)
                    match.firstChild.remove();
                newHTML.forEach(v=>match.appendChild(v.cloneNode(true)));
                $self.setHistory({
                    el,
                    match,
                    oldHTML,
                    oldMatchHTML,
                    newMatchHtml : [...match.childNodes],
                    newHTML,
                    method: "contenteditable"
                });
            }
            else{
                while(el.firstChild)
                    el.firstChild.remove();
                oldHTML.forEach(v=>el.appendChild(v));
            }
            window.dispatchEvent(new Event("WYSIWYG-end"))
        },
        el
    };
}
HTMLTreeMatch.prototype.contenteditable = function(el){
    var $self = this;
    if(el == lastEditable)
        return;
    var found = $self.find(el);
    lastEditable && lastEditable.destroy();
    if(!found || !found.HTML)
        return {
            match : false
        };
    return ce($self,el,found.match)
};
historyMethods.contenteditable = {
    undo : ho=>{
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        ho.oldHTML.forEach(v=>
            ho.el.appendChild(v));
        ho.oldMatchHTML.forEach(v=>
            ho.match.appendChild(v));
    },
    redo : ho=>{
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        ho.newHTML.forEach(v=>
            ho.el.appendChild(v));
        ho.newMatchHtml.forEach(v=>
            ho.match.appendChild(v));
    }
}
/*
historyMethods.contenteditable = {
    undo : (ho,previousRange,$self)=>{
        var toChange = [];
        $self.history.entries.forEach((v,i)=>{
            if(ho.el.contains(v.el) && ho.el!=v.el) {
                v.tree = getChildTree(ho.el, v.el);
                toChange.push(i);
            }
        });
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        for(var i = 0;i<ho.oldMatchHTML.length;i++) {
            ho.el.appendChild(ho.oldMatchHTML[i]);
            ho.match.appendChild(ho.oldMatchHTML[i].cloneNode(true));
        }
        if(ho.el != lastEditable){
            lastEditable.destroy && lastEditable.destroy();
            ce($self,ho.el,ho.match);
        }
        if(previousRange.lastRange)
            doLastSelection(previousRange.lastRange,ho.el.ownerDocument,previousRange.editable);

        toChange.forEach(index=>{
            var entry = $self.history.entries[index];
            entry.el = getChildFromTree(ho.el,entry.tree);
            lastEditable.el.removeAttribute("contenteditable");
            var found = $self.find(entry.el);
            if(!found || !found.match)
                throw new Error("error match");
            entry.match = found.match;
            lastEditable.el.setAttribute("contenteditable","");
        });
    },
    redo : (ho,$self)=>{
        var toChange = [];
        $self.history.entries.forEach((v,i)=>{
            if(ho.el.contains(v.el) && ho.el!=v.el) {
                v.tree = getChildTree(ho.el, v.el);
                toChange.push(i);
            }
        });
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        for(var i = 0;i<ho.newHTML.length;i++) {
            ho.el.appendChild(ho.newHTML[i]);
            ho.match.appendChild(ho.newHTML[i].cloneNode(true));
        }
        if(ho.el != lastEditable){
            lastEditable.destroy && lastEditable.destroy();
            ce($self,ho.el,ho.match);
        }
        if(ho.lastRange)
            doLastSelection(ho.lastRange,ho.el.ownerDocument,ho.el);
        toChange.forEach(index=>{
            var entry = $self.history.entries[index];
            entry.el = getChildFromTree(ho.el,entry.tree);
            lastEditable.el.removeAttribute("contenteditable");
            var found = $self.find(entry.el);
            if(!found || !found.match)
                throw new Error("error match");
            entry.match = found.match;
            lastEditable.el.setAttribute("contenteditable","");
        });
    }
}
    */
HTMLTreeMatch.prototype.createCaption = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch createCaption] no match");
    var tableMatch = found.match;
    var caption = tableEl.createCaption();
    caption.textContent = "table caption";
    var captionMatch = tableMatch.createCaption();
    captionMatch.textContent = "table caption";
    $self.setHistory({
        tableEl,
        tableMatch,
        method : "createCaption"
    });
};
historyMethods.createCaption = {
    undo: ho=>{
        ho.tableEl.deleteCaption();
        ho.tableMatch.deleteCaption();
    },
    redo: ho=>{
        var caption = ho.tableEl.createCaption();
        caption.textContent = "table caption";
        var captionMatch = ho.tableMatch.createCaption();
        captionMatch.textContent = "table caption";
    }
}

HTMLTreeMatch.prototype.createTFoot = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch createTFoot] no match");
    var tableMatch = found.match;
    var TFoot = tableEl.createTFoot();
    var firstRow = TFoot.insertRow();
    var TFootMatch = tableMatch.createTFoot();
    var firstMatchRow = TFootMatch.insertRow();
    var cells = tableEl.rows[0] && tableEl.rows[0].cells ? tableEl.rows[0].cells.length : 1;
    for(var i = 0;i<cells;i++) {
        var newRow = firstRow.insertCell(i);
        newRow.textContent = "TFoot Cell";
        var newRowMatch = firstMatchRow.insertCell(i);
        newRowMatch.textContent = "TFoot Cell";
    }
    $self.setHistory({
        tableEl,
        tableMatch,
        TFoot,
        TFootMatch,
        method : "createTFoot"
    });
};
historyMethods.createTFoot = {
    undo: ho=>{
        ho.tableEl.deleteTFoot();
        ho.tableMatch.deleteTFoot();
    },
    redo: ho=>{
        var TFoot = ho.tableEl.createTFoot();
        TFoot.replaceWith(ho.TFoot);
        var TFootMatch = ho.tableMatch.createTFoot();
        TFootMatch.replaceWith(ho.TFootMatch);
    }
}

HTMLTreeMatch.prototype.createTHead = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch createTHead] no match");
    var tableMatch = found.match;
    var tHead = tableEl.createTHead();
    var firstRow = tHead.insertRow();
    var tHeadMatch = tableMatch.createTHead();
    var firstMatchRow = tHeadMatch.insertRow();
    var cells = tableEl.rows[1] && tableEl.rows[1].cells ? tableEl.rows[1].cells.length : 1;
    for(var i = 0;i<cells;i++) {
        var newRow = firstRow.insertCell(i);
        newRow.textContent = "THead Cell";
        var newRowMatch = firstMatchRow.insertCell(i);
        newRowMatch.textContent = "THead Cell";
    }
    $self.setHistory({
        tableEl,
        tableMatch,
        tHead,
        tHeadMatch,
        method : "createTHead"
    });
};
historyMethods.createTHead = {
    undo: ho=>{
        ho.tableEl.deleteTHead();
        ho.tableMatch.deleteTHead();
    },
    redo: ho=>{
        var tHead = ho.tableEl.createTHead();
        tHead.replaceWith(ho.tHead);
        var tHeadMatch = ho.tableMatch.createTHead();
        tHeadMatch.replaceWith(ho.tHeadMatch);
    }
}

HTMLTreeMatch.prototype.deleteCaption = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteCaption] no match");
    var tableMatch = found.match;
    var captionDeleted = tableEl.caption;
    tableEl.deleteCaption();
    tableMatch.deleteCaption();
    $self.setHistory({
        tableEl,
        tableMatch,
        captionDeleted,
        method : "deleteCaption"
    });
};
historyMethods.deleteCaption = {
    undo: ho=>{
        ho.tableEl.createCaption();
        ho.tableEl.caption.replaceWith(ho.captionDeleted);
        ho.tableMatch.createCaption();
        ho.tableMatch.caption.replaceWith(ho.captionDeleted.cloneNode(true));
    },
    redo: ho=>{
        ho.tableEl.deleteCaption();
        ho.tableMatch.deleteCaption();
    }
}

HTMLTreeMatch.prototype.deleteCell = function(tableRow,index){
    var $self = this;
    var found = $self.find(tableRow);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteCell] no match");
    var tableRowMatch = found.match;
    var del = tableRow.cells[index];
    tableRow.deleteCell(index);
    var delMatch = tableRowMatch.cells[index];
    tableRowMatch.deleteCell(index);
    $self.setHistory({
        tableRow,
        tableRowMatch,
        del,
        delMatch,
        index,
        method : "deleteCell"
    });
};
historyMethods.deleteCell = {
    undo : ho=>{
        var newCell = ho.tableRow.insertCell(ho.index);
        newCell.replaceWith(ho.del);
        var newCellMatch = ho.tableRowMatch.insertCell(ho.index);
        newCellMatch.replaceWith(ho.delMatch);
    },
    redo : ho=>{
        ho.tableRow.deleteCell(ho.index);
        ho.tableRowMatch.deleteCell(ho.index);
    }
};

HTMLTreeMatch.prototype.deleteColumn = function(tableEl,index){
    var $self = this;
    var tableFound = $self.find(tableEl);
    if(!tableFound || !tableFound.HTML)
        throw new Error("[HTMLTreeMatch deleteColumn] no match");
    var tableMatch = tableFound.match;
    var removed = [];
    var removedMatch = [];
    [...tableEl.rows].forEach((v,i)=>{
        if(v.cells[index]) {
            removed.push(v.cells[index]);
            v.deleteCell(index)
        }
    });
    [...tableMatch.rows].forEach((v,i)=>{
        if(v.cells[index]) {
            removedMatch.push(v.cells[index]);
            v.deleteCell(index)
        }
    });
    $self.setHistory({
        tableEl,
        tableMatch,
        removed,
        removedMatch,
        $self,
        index,
        method : "deleteColumn"
    });
};
historyMethods.deleteColumn = {
    undo : ho=>{
        [...ho.tableEl.rows].forEach((v,i)=>{
            var newCell = v.insertCell(ho.index);
            newCell.replaceWith(ho.removed[i]);
        });
        [...ho.tableMatch.rows].forEach((v,i)=>{
            var newCell = v.insertCell(ho.index);
            newCell.replaceWith(ho.removedMatch[i]);
        });
    },
    redo : ho=>{
        [...ho.tableEl.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
        [...ho.tableMatch.rows].forEach(v=>{
            v.deleteCell(ho.index)
        });
    }
};

HTMLTreeMatch.prototype.deleteRow = function(tableEl,index){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteRow] no match");
    var tableMatch = found.match;
    var deletedEl = tableEl.rows[index];
    var matchedEl = $self.match(deletedEl);
    tableEl.deleteRow(index);
    tableMatch.deleteRow(index);
    $self.setHistory({
        tableEl,
        deletedEl,
        matchedEl,
        tableMatch,
        index,
        method : "deleteRow"
    });
};
historyMethods.deleteRow = {
    undo : ho=>{
        var newRow = ho.tableEl.insertRow(ho.index);
        newRow.replaceWith(ho.deletedEl);
        var newRowMatch = ho.tableMatch.insertRow(ho.index);
        newRowMatch.replaceWith(ho.matchedEl);
    },
    redo : ho=>{
        ho.tableEl.deleteRow(ho.index);
        ho.tableMatch.deleteRow(ho.index);
    }
};

HTMLTreeMatch.prototype.deleteTFoot = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteTFoot] no match");
    var tableMatch = found.match;
    var TFootDeleted = tableEl.tFoot;
    var TFootDeletedMatch = tableMatch.tFoot;
    tableEl.deleteTFoot();
    tableMatch.deleteTFoot();
    $self.setHistory({
        tableEl,
        tableMatch,
        TFootDeleted,
        TFootDeletedMatch,
        method : "deleteTFoot"
    });
};
historyMethods.deleteTFoot = {
    undo: ho=>{
        ho.tableEl.createTFoot();
        ho.tableEl.tFoot.replaceWith(ho.TFootDeleted);
        ho.tableMatch.createTFoot();
        ho.tableMatch.tFoot.replaceWith(ho.TFootDeletedMatch);
    },
    redo: ho=>{
        ho.tableEl.deleteTFoot();
        ho.tableMatch.deleteTFoot();
    }
}

HTMLTreeMatch.prototype.deleteTHead = function(tableEl){
    var $self = this;
    var found = $self.find(tableEl);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch deleteTHead] no match");
    var tableMatch = found.match;
    var tHeadDeleted = tableEl.tHead;
    tableEl.deleteTHead();
    tableMatch.deleteTHead();
    $self.setHistory({
        tableEl,
        tableMatch,
        tHeadDeleted,
        method : "deleteTHead"
    });
};
historyMethods.deleteTHead = {
    undo: ho=>{
        ho.tableEl.createTHead();
        ho.tableEl.tHead.replaceWith(ho.tHeadDeleted);
        ho.tableMatch.createTHead();
        ho.tableMatch.tHead.replaceWith(ho.tHeadDeleted.cloneNode(true));
    },
    redo: ho=>{
        ho.tableEl.deleteTHead();
        ho.tableMatch.deleteTHead();
    }
}

HTMLTreeMatch.prototype.innerHTML = function(el,HTML){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch innerHTML] no match");
    var match = found.match;
    var oldHTML = [...el.childNodes];
    var oldMatchHTML = [...match.childNodes];
    el.innerHTML = HTML;
    match.innerHTML = HTML;
    var newHTML = [...el.childNodes];
    var newMatchHtml = [...match.childNodes];
    $self.setHistory({
        el,
        match,
        HTML,
        newHTML,
        newMatchHtml,
        oldMatchHTML,
        oldHTML,
        method : "innerHTML"
    });
};
historyMethods.innerHTML = {
    undo : ho=>{
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        ho.oldHTML.forEach(v=>
            ho.el.appendChild(v));
        ho.oldMatchHTML.forEach(v=>
            ho.match.appendChild(v));
    },
    redo : ho=>{
        ho.el.innerHTML = "";
        ho.match.innerHTML = "";
        ho.newHTML.forEach(v=>
            ho.el.appendChild(v));
        ho.newMatchHtml.forEach(v=>
            ho.match.appendChild(v));
    }
}
HTMLTreeMatch.prototype.insertAdjacentElement = function(el,position,newEl){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch insertAdjacentElement] no match");
    var match = found.match;
    var newEls = newEl.nodeType==11 ? [...newEl.childNodes] : [newEl];
    var newMatch = newEl.cloneNode(true);
    var newMatches = newMatch.nodeType==11 ? [...newMatch.childNodes] : [newMatch];
    el[position](newEl);
    match[position](newMatch);
    $self.setHistory({
        el,
        match,
        newMatches,
        newEls,
        position,
        method : "insertAdjacentElement"
    });
};
historyMethods.insertAdjacentElement = {
    undo : ho=>{
        ho.newEls.forEach(n=>n.remove());
        ho.newMatches.forEach(n=>n.remove());
    },
    redo : ho=>{
        ho.el[ho.position](...ho.newEls);
        ho.match[ho.position](...ho.newMatches);
    }
};

HTMLTreeMatch.prototype.insertAdjacentElements = function(el,position,newEls){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch insertAdjacentElements] no match");
    var match = found.match;
    if(!Array.isArray(newEls))
        newEls = [newEls];
    var newMatchs = [];
    if(position.match(/afterbegin|afterend/))
        newEls.reverse();
    newEls.forEach(ne=>{
        var newMatch = ne.cloneNode(true);
        newMatchs.push(newMatch);
        el.insertAdjacentElement(position, ne);
        match.insertAdjacentElement(position,newMatch);
    });
    $self.setHistory({
        el,
        match,
        position,
        newEls,
        newMatchs,
        method : "insertAdjacentElements"
    });
};
historyMethods.insertAdjacentElements = {
    undo : ho=>{
        ho.newEls.forEach(ne=>ne.remove());
        ho.newMatchs.forEach(ne=>ne.remove());
    },
    redo : ho=>{
        ho.newEls.forEach(ne=>ho.el.insertAdjacentElement(ho.position, ne));
        ho.newMatchs.forEach(ne=>ho.match.insertAdjacentElement(ho.position,ne));
    }
};

HTMLTreeMatch.prototype.insertBefore = function(newNode,referenceNode){
    var $self = this;
    var found = $self.find(referenceNode);
    if(!found)
        throw new Error("[HTMLTreeMatch insertBefore] no match");
    var refMatch = found.match;
    var match = refMatch.parentNode;
    var newNodeMatch = newNode.cloneNode(true);
    var parentNode = referenceNode.parentNode;
    parentNode.insertBefore(newNode, referenceNode);
    match.insertBefore(newNodeMatch,refMatch);
    $self.setHistory({
        match,
        parentNode,
        newNode,
        newNodeMatch,
        referenceNode,
        refMatch,
        method : "insertBefore"
    });
};
historyMethods.insertBefore = {
    undo : ho=>{
        ho.parentNode.removeChild(ho.newNode, ho.referenceNode);
        ho.match.removeChild(ho.newNodeMatch,ho.refMatch);
    },
    redo : ho=>{
        ho.parentNode.insertBefore(ho.newNode, ho.referenceNode);
        ho.match.insertBefore(ho.newNodeMatch,ho.refMatch);
    }
};

HTMLTreeMatch.prototype.insertCell = function(tableRow,index){
    var $self = this;
    var tableRowFound = $self.find(tableRow);
    if(!tableRowFound || !tableRowFound.HTML)
        throw new Error("[HTMLTreeMatch insertCell] no match");
    var tableRowMatch = tableRowFound.match;
    var newCell = tableRow.insertCell(index);
    newCell.innerHTML = "new Cell";
    var newCellMatch = tableRowMatch.insertCell(index);
    newCellMatch.innerHTML = "new Cell";
    $self.setHistory({
        tableRow,
        tableRowMatch,
        index,
        method : "insertCell"
    });
};
historyMethods.insertCell = {
    undo : ho=>{
        ho.tableRow.deleteCell(ho.index);
        ho.tableRowMatch.deleteCell(ho.index);
    },
    redo : ho=>{
        var newCell = ho.tableRow.insertCell(ho.index);
        newCell.innerHTML = "new Cell";
        var newCellMatch = ho.tableRowMatch.insertCell(ho.index);
        newCellMatch.innerHTML = "new Cell";
    }
};

HTMLTreeMatch.prototype.insertRow = function(tableEl,index){
    var $self = this;
    var tableFound = $self.find(tableEl);
    if(!tableFound || !tableFound.HTML)
        throw new Error("[HTMLTreeMatch insertRow] no match");
    var tableMatch = tableFound.match;
    var cells = tableEl.rows[0].cells.length;
    var newRow = tableEl.insertRow(index);
    var newRomMatch = tableMatch.insertRow(index);
    for(var i = 0;i<cells;i++) {
        newRow.insertCell(i);
        newRomMatch.insertCell(i);
    }
    $self.setHistory({
        tableEl,
        tableMatch,
        cells,
        index,
        method : "insertRow"
    });
};
historyMethods.insertRow = {
    undo : ho=>{
        ho.tableEl.deleteRow(ho.index);
        ho.tableMatch.deleteRow(ho.index);
    },
    redo : ho=>{
        var newRow = ho.tableEl.insertRow(ho.index);
        var newRomMatch = ho.tableMatch.insertRow(ho.index);
        for(var i = 0;i<ho.cells;i++) {
            newRow.insertCell(i);
            newRomMatch.insertCell(i);
        }
    }
};

HTMLTreeMatch.prototype.mergeColumnCell = function(tableCell,type){
    var $self = this;
    var tableCellFound = $self.find(tableCell);
    if(!tableCellFound || !tableCellFound.HTML)
        throw new Error("[HTMLTreeMatch mergeColumnCell] no match");
    var tableCellMatch = tableCellFound.match;
    var table = tableCell.closest("table");
    var tableMatch = tableCellMatch.closest("table");
    var row = tableCell.parentNode;
    var rowMatch = tableCellMatch.parentNode;
    var indexRow = [...table.rows].indexOf(row);
    var index = [...row.cells].indexOf(tableCell);
    var mergeCell = type=="backward" ? row.cells[index-1] : tableCell;
    var matchMergeCellFind = $self.find(mergeCell);
    if(!matchMergeCellFind || !matchMergeCellFind.HTML)
        throw new Error("[HTMLTreeMatch mergeCell] no match");
    var matchMergeCell = matchMergeCellFind.match;
    var toRemove = type=="backward" ? tableCell : row.cells[index+1];
    var toRemoveMatchFind = $self.find(toRemove);
    if(!toRemoveMatchFind || !toRemoveMatchFind.HTML)
        throw new Error("[HTMLTreeMatch toRemoveMatch] no match");
    var toRemoveIndex = [...row.cells].indexOf(toRemove);
    var toRemoveMatch = toRemoveMatchFind.match;
    toRemove.remove();
    toRemoveMatch.remove();
    var added = [];
    [...toRemove.childNodes].forEach(v=>{
        var newEl = v.cloneNode(true);
        mergeCell.append(newEl);
        added.push(newEl);
    });
    var addedMatch = [];
    [...toRemoveMatch.childNodes].forEach(v=>{
        var newEl = v.cloneNode(true);
        matchMergeCell.append(newEl);
        addedMatch.push(newEl);
    });
    var wasColSpan = mergeCell.hasAttribute("colspan");
    var wasRowSpan = mergeCell.hasAttribute("rowspan");
    mergeCell.colSpan+=toRemove.colSpan;
    var mergeCellRowSpan = mergeCell.rowSpan;
    mergeCell.rowSpan=toRemove.rowSpan;
    matchMergeCell.colSpan=mergeCell.colSpan;
    matchMergeCell.rowSpan=mergeCell.rowSpan;
    $self.setHistory({
        tableCell,
        wasColSpan,
        wasRowSpan,
        tableCellMatch,
        mergeCellRowSpan,
        type,
        toRemove,
        toRemoveIndex,
        toRemoveMatch,
        mergeCell,
        matchMergeCell,
        index,
        rowMatch,
        row,
        added,
        addedMatch,
        method : "mergeColumnCell"
    });
};
historyMethods.mergeColumnCell = {
    undo : ho=>{
        ho.mergeCell.colSpan-=ho.toRemove.colSpan;
        ho.mergeCell.rowSpan=ho.mergeCellRowSpan;
        if(!ho.wasColSpan)
            ho.mergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.mergeCell.removeAttribute("rowspan");
        ho.matchMergeCell.colSpan=ho.mergeCell.colSpan;
        ho.matchMergeCell.rowSpan=ho.mergeCell.rowSpan;
        if(!ho.wasColSpan)
            ho.matchMergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.matchMergeCell.removeAttribute("rowspan");
        ho.added.forEach(v=>v.remove());
        ho.addedMatch.forEach(v=>v.remove());
        var newCell = ho.row.insertCell(ho.toRemoveIndex);
        newCell.replaceWith(ho.toRemove);
        var newCellMatch = ho.rowMatch.insertCell(ho.toRemoveIndex);
        newCellMatch.replaceWith(ho.toRemoveMatch);
    },
    redo : ho=>{
        ho.added.forEach(v=>{
            ho.mergeCell.append(v);
        });
        ho.addedMatch.forEach(v=>{
            ho.matchMergeCell.append(v);
        });
        ho.mergeCell.colSpan+=ho.toRemove.colSpan;
        ho.mergeCell.rowSpan=ho.toRemove.rowSpan;
        ho.matchMergeCell.colSpan=ho.mergeCell.colSpan;
        ho.matchMergeCell.rowSpan=ho.mergeCell.rowSpan;
        ho.toRemove.remove();
        ho.toRemoveMatch.remove();
    }
};

HTMLTreeMatch.prototype.mergeRowCell = function(tableCell,type){
    var $self = this;
    var tableCellFound = $self.find(tableCell);
    if(!tableCellFound || !tableCellFound.HTML)
        throw new Error("[HTMLTreeMatch mergeRowCell] no match");
    var tableCellMatch = tableCellFound.match;
    var table = tableCell.closest("table");
    var tableMatch = tableCellMatch.closest("table");
    var row = tableCell.parentNode;
    var indexRow = [...table.rows].indexOf(row);
    var indexCell = [...tableCell.parentNode.cells].indexOf(tableCell);
    var indexRowToExpand;
    var trLength = table.rows[indexRow].cells.length;
    var searchForColumn,searchRowLength;
    if(type=="backward"){
        searchForColumn = indexRow-1;
        searchRowLength = table.rows[searchForColumn].cells.length;
        var searchCellRowSpan = table.rows[searchForColumn].cells[indexCell].rowSpan;
        while(table.rows[searchForColumn] &&
            ( searchRowLength!= trLength &&
            searchCellRowSpan == 1 )
            ){
            searchForColumn--;
            searchRowLength = table.rows[searchForColumn] && table.rows[searchForColumn].cells.length;
            searchCellRowSpan = table.rows[searchForColumn] && table.rows[searchForColumn].cells[indexCell] ?
                table.rows[searchForColumn].cells[indexCell].rowSpan : 1;
        }
        if(table.rows[searchForColumn])
            indexRowToExpand = searchForColumn;
        else
            indexRowToExpand = indexRow-1;
    }
    else
        indexRowToExpand = indexRow;
    var rowToExpand = table.rows[indexRowToExpand];
    var mergeCell = rowToExpand.cells[indexCell];
    var mergeCellClone = mergeCell.cloneNode(true);
    var indexRowToRemove = indexRow+1;
    if(type=="backward")
        indexRowToRemove = indexRow;
    else if(type!="backward" && mergeCell.rowSpan > 1){
        searchForColumn = indexRow+1;
        searchRowLength = table.rows[searchForColumn].cells.length;
        while(table.rows[searchForColumn] &&
        searchRowLength != trLength){
            searchForColumn++;
            searchRowLength = table.rows[searchForColumn] && table.rows[searchForColumn].cells.length;
        }
        if(table.rows[searchForColumn])
            indexRowToRemove = searchForColumn;
        else{
            while(table.rows[indexRowToRemove] && !table.rows[indexRowToRemove].cells[indexCell])
                indexRowToRemove++;
        }
    }
    var rowToRemove =  table.rows[indexRowToRemove];
    var toRemove = rowToRemove.cells[indexCell];
    toRemove.parentNode.removeChild(toRemove);
    if(indexRowToRemove>indexRowToExpand)
        [...toRemove.childNodes].forEach(v=>{
            mergeCell.appendChild(v.cloneNode(true));
        });
    else
        [...toRemove.childNodes].forEach(v=>{
            mergeCell.insertBefore(v.cloneNode(true),mergeCell.firstChild);
        });
    var wasColSpan = mergeCell.hasAttribute("colspan");
    var wasRowSpan = mergeCell.hasAttribute("rowspan");
    mergeCell.rowSpan+=toRemove.rowSpan;
    var mergeCellColSpan = toRemove.colSpan;
    mergeCell.colSpan=toRemove.colSpan;
    tableMatch.rows[indexRowToExpand].replaceWith(rowToExpand.cloneNode(true));
    tableMatch.rows[indexRowToRemove].replaceWith(rowToRemove.cloneNode(true));
    $self.setHistory({
        tableCell,
        wasColSpan,
        wasRowSpan,
        tableCellMatch,
        tableMatch,
        type,
        toRemove,
        mergeCell,
        mergeCellColSpan,
        mergeCellnewHtml : mergeCell.innerHTML,
        indexCell,
        indexRow,
        indexRowToExpand,
        indexRowToRemove,
        row,
        rowToExpand,
        rowToRemove,
        mergeCellClone,
        method : "mergeRowCell"
    });
};
historyMethods.mergeRowCell = {
    undo : ho=>{
        ho.mergeCell.rowSpan-=ho.toRemove.rowSpan;
        ho.mergeCell.colSpan=ho.mergeCellColSpan;
        if(!ho.wasColSpan)
            ho.mergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.mergeCell.removeAttribute("rowspan");
        var newCell = ho.rowToRemove.insertCell(ho.indexCell);
        newCell.replaceWith(ho.toRemove);
        ho.mergeCell.innerHTML = ho.mergeCellClone.innerHTML;
        ho.tableMatch.rows[ho.indexRowToExpand].replaceWith(ho.rowToExpand.cloneNode(true));
        ho.tableMatch.rows[ho.indexRowToRemove].replaceWith(ho.rowToRemove.cloneNode(true));
    },
    redo : ho=>{
        ho.toRemove.parentNode.removeChild(ho.toRemove);
        ho.mergeCell.innerHTML = ho.mergeCellnewHtml;
        ho.mergeCell.rowSpan+=ho.toRemove.rowSpan;
        ho.mergeCell.colSpan=ho.toRemove.colSpan;
        ho.tableMatch.rows[ho.indexRowToExpand].replaceWith(ho.rowToExpand.cloneNode(true));
        ho.tableMatch.rows[ho.indexRowToRemove].replaceWith(ho.rowToRemove.cloneNode(true));
    }
};

HTMLTreeMatch.prototype.__mergeRowCell = function(tableCell,type){
    var $self = this;
    var tableCellFound = $self.find(tableCell);
    if(!tableCellFound || !tableCellFound.HTML)
        throw new Error("[HTMLTreeMatch mergeRowCell] no match");
    var tableCellMatch = tableCellFound.match;
    var table = tableCell.closest("table");
    var tableMatch = tableCellMatch.closest("table");
    var row = tableCell.parentNode;
    var indexRow = [...table.rows].indexOf(row);
    var indexCell = [...tableCell.parentNode.cells].indexOf(tableCell);
    var indexRowToExpand;
    var trLength = table.rows[indexRow].cells.length;
    var searchForColumn,searchRowLength;
    if(type=="backward"){
        searchForColumn = indexRow-1;
        searchRowLength = table.rows[searchForColumn].cells.length;
        var searchCellRowSpan = table.rows[searchForColumn].cells[indexCell].rowSpan;
        while(table.rows[searchForColumn] &&
        ( searchRowLength!= trLength &&
        searchCellRowSpan == 1 )
            ){
            searchForColumn--;
            searchRowLength = table.rows[searchForColumn] && table.rows[searchForColumn].cells.length;
            searchCellRowSpan = table.rows[searchForColumn] && table.rows[searchForColumn].cells[indexCell] ?
                table.rows[searchForColumn].cells[indexCell].rowSpan : 1;
        }
        if(table.rows[searchForColumn])
            indexRowToExpand = searchForColumn;
        else
            indexRowToExpand = indexRow-1;
    }
    else
        indexRowToExpand = indexRow;
    var rowToExpand = table.rows[indexRowToExpand];
    var mergeCell = rowToExpand.cells[indexCell];
    var matchMergeCellFind = $self.find(mergeCell);
    if(!matchMergeCellFind || !matchMergeCellFind.HTML)
        throw new Error("[HTMLTreeMatch mergeCell] no match");
    var matchMergeCell = matchMergeCellFind.match;
    var indexRowToRemove = indexRow+1;
    if(type=="backward")
        indexRowToRemove = indexRow;
    else if(type!="backward" && mergeCell.rowSpan > 1){
        searchForColumn = indexRow+1;
        searchRowLength = table.rows[searchForColumn].cells.length;
        while(table.rows[searchForColumn] &&
        searchRowLength != trLength){
            searchForColumn++;
            searchRowLength = table.rows[searchForColumn] && table.rows[searchForColumn].cells.length;
        }
        if(table.rows[searchForColumn])
            indexRowToRemove = searchForColumn;
        else{
            while(table.rows[indexRowToRemove] && !table.rows[indexRowToRemove].cells[indexCell])
                indexRowToRemove++;
        }
    }
    var rowToRemove =  table.rows[indexRowToRemove];
    var toRemove = rowToRemove.cells[indexCell];
    var toRemoveMatchFind = $self.find(toRemove);
    if(!toRemoveMatchFind || !toRemoveMatchFind.HTML)
        throw new Error("[HTMLTreeMatch toRemoveMatch] no match");
    var toRemoveIndex = [...row.cells].indexOf(toRemove);
    var toRemoveMatch = toRemoveMatchFind.match;
    toRemove.remove();
    toRemoveMatch.remove();
    var added = [];
    var addedMatch = [];
    if(indexRowToRemove>indexRowToExpand) {
        [...toRemove.childNodes].forEach(v=> {
            var newEl = v.cloneNode(true);
            mergeCell.appendChild(newEl);
            added.push(newEl);
        });
        [...toRemove.childNodes].forEach(v=> {
            var newEl = v.cloneNode(true);
            matchMergeCell.appendChild(newEl);
            addedMatch.push(newEl);
        });
    }
    else {
        [...toRemove.childNodes].forEach(v=> {
            var newEl = v.cloneNode(true);
            mergeCell.insertBefore(newEl, mergeCell.firstChild);
            added.push(newEl);
        });
        [...toRemove.childNodes].forEach(v=> {
            var newEl = v.cloneNode(true);
            mergeCell.insertBefore(newEl, mergeCell.firstChild);
            addedMatch.push(newEl);
        });
    }
    var wasColSpan = mergeCell.hasAttribute("colspan");
    var wasRowSpan = mergeCell.hasAttribute("rowspan");
    mergeCell.rowSpan+=toRemove.rowSpan;
    var mergeCellColSpan = toRemove.colSpan;
    mergeCell.colSpan=toRemove.colSpan;
    tableMatch.rows[indexRowToExpand].replaceWith(rowToExpand.cloneNode(true));
    tableMatch.rows[indexRowToRemove].replaceWith(rowToRemove.cloneNode(true));
    $self.setHistory({
        tableCell,
        wasColSpan,
        wasRowSpan,
        tableCellMatch,
        tableMatch,
        type,
        toRemove,
        mergeCell,
        mergeCellColSpan,
        mergeCellnewHtml : mergeCell.innerHTML,
        indexCell,
        indexRow,
        indexRowToExpand,
        indexRowToRemove,
        row,
        rowToExpand,
        rowToRemove,
        mergeCellClone,
        method : "mergeRowCell"
    });
};
historyMethods.__mergeRowCell = {
    undo : ho=>{
        ho.mergeCell.rowSpan-=ho.toRemove.rowSpan;
        ho.mergeCell.colSpan=ho.mergeCellColSpan;
        if(!ho.wasColSpan)
            ho.mergeCell.removeAttribute("colspan");
        if(!ho.wasRowSpan)
            ho.mergeCell.removeAttribute("rowspan");
        var newCell = ho.rowToRemove.insertCell(ho.indexCell);
        newCell.replaceWith(ho.toRemove);
        ho.mergeCell.innerHTML = ho.mergeCellClone.innerHTML;
        ho.tableMatch.rows[ho.indexRowToExpand].replaceWith(ho.rowToExpand.cloneNode(true));
        ho.tableMatch.rows[ho.indexRowToRemove].replaceWith(ho.rowToRemove.cloneNode(true));
    },
    redo : ho=>{
        ho.toRemove.parentNode.removeChild(ho.toRemove);
        ho.mergeCell.innerHTML = ho.mergeCellnewHtml;
        ho.mergeCell.rowSpan+=ho.toRemove.rowSpan;
        ho.mergeCell.colSpan=ho.toRemove.colSpan;
        ho.tableMatch.rows[ho.indexRowToExpand].replaceWith(ho.rowToExpand.cloneNode(true));
        ho.tableMatch.rows[ho.indexRowToRemove].replaceWith(ho.rowToRemove.cloneNode(true));
    }
};

HTMLTreeMatch.prototype.move = function(pivotEl,el,position){
    var $self = this;
    var pivotElFound = $self.find(pivotEl);
    if(!pivotElFound)
        throw new Error("[HTMLTreeMatch move] pivotEl no match");
    var pivotElMatch = pivotElFound.match;
    var elFound = $self.find(el);
    if(!elFound)
        throw new Error("[HTMLTreeMatch move] el no match");
    var elMatch = elFound.match;
    var parentNode = el.parentNode;
    var parentMatch = elMatch.parentNode;
    var elSibling = el.nextSibling;
    var matchSibling = elMatch.nextSibling;
    pivotEl[position](el);
    pivotElMatch[position](elMatch);
    $self.setHistory({
        el,
        pivotEl,
        pivotElMatch,
        elMatch,
        position,
        parentNode,
        parentMatch,
        elSibling,
        matchSibling,
        method : "move"
    });
};
historyMethods.move = {
    undo : ho=>{
        if(ho.elSibling && ho.elSibling.parentNode) {
            ho.parentNode.insertBefore(ho.el, ho.elSibling);
            ho.parentMatch.insertBefore(ho.elMatch, ho.matchSibling);
        }
        else{
            ho.parentNode.appendChild(ho.el);
            ho.parentMatch.appendChild(ho.elMatch);
        }
    },
    redo : ho=>{
        ho.pivotEl[ho.position](ho.el);
        ho.pivotElMatch[ho.position](ho.elMatch);
    }
};
HTMLTreeMatch.prototype.outerHTML = function(el,text){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch outerHTML] no match");
    var match = found.match;
    var placeholderDiv = el.ownerDocument.createElement("div");
    var placeholderMatchDiv = match.ownerDocument.createElement("div");
    placeholderDiv.innerHTML = text;
    placeholderMatchDiv.innerHTML = text;
    var newNodes = [...placeholderDiv.childNodes];
    var newMatchNodes = [...placeholderMatchDiv.childNodes];
    el.replaceWith(...newNodes);
    match.replaceWith(...newMatchNodes);
    $self.setHistory({
        el,
        match,
        newNodes,
        newMatchNodes,
        method : "outerHTML"
    });
};
historyMethods.outerHTML = {
    undo : ho=>{
        ho.newNodes[0].before(ho.el);
        ho.newMatchNodes[0].before(ho.match);
        ho.newNodes.forEach(v=>v.remove());
        ho.newMatchNodes.forEach(v=>v.remove());
    },
    redo : ho=>{
        ho.el.replaceWith(...ho.newNodes);
        ho.match.replaceWith(...ho.newMatchNodes);
    }
}
HTMLTreeMatch.prototype.prepend = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"prepend",child);
};
HTMLTreeMatch.prototype.removeAttribute = function(el,attrName){
    var $self = this;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute(attrName) != el.getAttribute(attrName)))
        throw new Error("[HTMLTreeMatch removeAttribute] no match");
    var match = found.match;
    var oldAttribute = el.getAttribute(attrName);
    if(oldAttribute == null)
        return;
    el.removeAttribute(attrName);
    match.removeAttribute(attrName);
    $self.setHistory({
        el,
        match,
        attrName,
        oldAttribute,
        method : "removeAttribute"
    });
};
historyMethods.removeAttribute = {
    undo : historyMethods=>{
        historyMethods.el.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
        historyMethods.match.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
    },
    redo : historyMethods=>{
        historyMethods.el.removeAttribute(historyMethods.attrName);
        historyMethods.match.removeAttribute(historyMethods.attrName);
    }
}
HTMLTreeMatch.prototype.removeChild = function(node){
    var $self = this;
    var parentNode = node.parentNode;
    var found = $self.find(node);
    if(!found)
        throw new Error("[HTMLTreeMatch removeChild] no match");
    var match = found.match;
    var parentMatch = match.parentNode;
    var nodeSibling = node.nextSibling;
    var matchSibling = match.nextSibling;
    var oldChild = parentNode.removeChild(node);
    var oldMatch = parentMatch.removeChild(match);
    $self.setHistory({
        el:node,
        match,
        nodeSibling,
        parentNode,
        parentMatch,
        matchSibling,
        oldChild,
        oldMatch,
        method : "removeChild"
    });
};
historyMethods.removeChild = {
    undo:ho=>{
        var c = ho.oldChild;
        if(ho.nodeSibling && ho.nodeSibling.parentNode) {
            ho.parentNode.insertBefore(c, ho.nodeSibling);
            ho.parentMatch.insertBefore(ho.oldMatch, ho.matchSibling);
        }
        else{
            ho.parentNode.appendChild(c);
            ho.parentMatch.appendChild(ho.oldMatch);
        }
    },
    redo:ho=>{
        ho.parentNode.removeChild(ho.oldChild);
        ho.parentMatch.removeChild(ho.oldMatch);
    }
};

HTMLTreeMatch.prototype.removeClass = function(el,className){
    var $self = this;
    if(!el.classList.contains(className))
        return;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute('class') != el.getAttribute('class')))
        throw new Error("[HTMLTreeMatch removeClass] no match");
    var match = found.match;
    el.classList.remove(className);
    match.classList.remove(className);
    $self.setHistory({
        el,
        match,
        className,
        method : "removeClass"
    });
};
historyMethods.removeClass = {
    undo: ho=>{
        ho.el.classList.add(ho.className);
        ho.match.classList.add(ho.className);
    },
    redo: ho=>{
        ho.el.classList.remove(ho.className);
        ho.match.classList.remove(ho.className);
    }
}

HTMLTreeMatch.prototype.removeHeadNode = function(node){
    var $self = this;
    var match = [...$self.source.head.children].find(v=>v.isEqualNode(node));
    if(!match){
        console.error("no match");
        console.trace();
        return;
    }
    var parentNode = node.ownerDocument.head;
    var nodeIndex = [...parentNode.childNodes].findIndex(v=>v==node);
    var parentMatch = $self.source.head;
    var matchIndex = [...parentMatch.childNodes].findIndex(v=>v==match);
    var oldChild = node.ownerDocument.head.removeChild(node);
    var oldMatch = $self.source.head.removeChild(match);
    $self.setHistory({
        node,
        parentNode,
        match,
        nodeIndex,
        parentMatch,
        matchIndex,
        oldChild,
        oldMatch,
        method : "removeChild"
    });
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
};
function addHeadNodeUndo(historyObject){
    var parentNode = historyObject.parentNode;
    var parentMatch = historyObject.parentMatch;
    var nodePivot = parentNode.childNodes[historyObject.nodeIndex];
    if(nodePivot)
        parentNode.insertBefore(historyObject.oldChild,nodePivot.nextSibling);
    else
        parentNode.appendChild(nodePivot);

    var matchPivot=parentMatch.childNodes[historyObject.matchIndex];
    if(matchPivot)
        parentMatch.insertBefore(historyObject.oldMatch,nodePivot.nextSibling);
    else
        parentMatch.appendChild(nodePivot);
    /* dispatching */
    window.dispatchEvent(new Event(domChangeEvent));
}

// TODO TESTS!
HTMLTreeMatch.prototype.removeNodeList = function(nodeList){
    var $self = this;
    var list = [];
    [...nodeList].forEach(n=>{
        var parentNode = n.parentNode;
        var found = $self.find(n);
        if(!found){
            console.error("[HTMLTreeMatch removeNodeList] not found element",n);
            console.error("[HTMLTreeMatch removeNodeList] continue",n);
            return;
        }
        var match = found.match;
        var parentMatch = match.parentNode;
        list.push({
            nodeSibling : n.nextSibling,
            matchSibling : match.nextSibling,
            oldChild : parentNode.removeChild(n),
            oldMatch : parentMatch.removeChild(match),
            parentNode,
            match,
            parentMatch
        });
    });
    $self.setHistory({
        list,
        method : "removeNodeList"
    });
};
historyMethods.removeNodeList = {
    undo:ho=>{
        ho.list.forEach(v=>{
            var c = v.oldChild;
            if(v.nodeSibling && v.nodeSibling.parentNode) {
                v.parentNode.insertBefore(c, v.nodeSibling);
                v.parentMatch.insertBefore(v.oldMatch, v.matchSibling);
            }
            else{
                v.parentNode.appendChild(c);
                v.parentMatch.appendChild(v.oldMatch);
            }
        })
    },
    redo:ho=>{
        ho.list.forEach(v=> {
            v.parentNode.removeChild(v.oldChild);
            v.parentMatch.removeChild(v.oldMatch);
        });
    }
};

HTMLTreeMatch.prototype.replaceChild = function(newChild,oldChild){
    var $self = this;
    var parentNode = oldChild.parentNode;
    var found = $self.find(parentNode);
    if(!found)
        throw new Error("[HTMLTreeMatch replaceChild] no match");
    var match = found.match;
    var oldMatch = $self.match(oldChild);
    var newMatch = newChild.cloneNode(true);
    parentNode.replaceChild(newChild, oldChild);
    match.replaceChild(newMatch,oldMatch);
    $self.lastMatch.el = newChild;
    $self.lastMatch.match = newMatch;
    $self.setHistory({
        match,
        oldMatch,
        newMatch,
        parentNode,
        newEl:newChild,
        oldEl:oldChild,
        method : "replaceChild"
    });
};
historyMethods.replaceChild = {
    undo:historyObject=>{
        historyObject.parentNode.replaceChild(historyObject.oldEl,historyObject.newEl);
        historyObject.match.replaceChild(historyObject.oldMatch,historyObject.newMatch);
    },
    redo:historyObject=>{
        historyObject.parentNode.replaceChild(historyObject.newEl,historyObject.oldEl);
        historyObject.match.replaceChild(historyObject.newMatch,historyObject.oldMatch);
    }
}
HTMLTreeMatch.prototype.replaceWith = function(el,node){
    var $self = this;
    var found = $self.find(el);
    if(!found)
        throw new Error("[HTMLTreeMatch replaceWith] no match");
    var match = found.match;
    el.replaceWith(node);
    var newMatch = node.cloneNode(true);
    match.replaceWith(newMatch);
    $self.lastMatch.el = node;
    $self.lastMatch.match = newMatch;
    $self.setHistory({
        el,
        match,
        newMatch,
        newEl:node,
        method : "replaceWith"
    });
};
historyMethods.replaceWith = {
    undo:historyObject=>{
        historyObject.newEl.replaceWith(historyObject.el);
        historyObject.newMatch.replaceWith(historyObject.match);
    },
    redo:historyObject=>{
        historyObject.el.replaceWith(historyObject.newEl);
        historyObject.match.replaceWith(historyObject.newMatch);
    }
}

HTMLTreeMatch.prototype.setAttribute = function(el,attrName,attrValue){
    var $self = this;
    var found = $self.find(el);
    if(!found || (!found.attributes && found.match.getAttribute(attrName) != el.getAttribute(attrName)))
        throw new Error("[HTMLTreeMatch setAttribute] no match");
    var match = found.match;
    var oldAttribute = el.getAttribute(attrName);
    if(oldAttribute == attrValue)
        return;
    el.setAttribute(attrName,attrValue);
    match.setAttribute(attrName,attrValue);
    $self.setHistory({
        el,
        attrName,
        attrValue,
        match,
        oldAttribute,
        method : "setAttribute"
    });
};
historyMethods.setAttribute = {
    undo : historyMethods=>{
        if(historyMethods.oldAttribute != null) {
            historyMethods.el.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
            historyMethods.match.setAttribute(historyMethods.attrName, historyMethods.oldAttribute);
        }
        else{
            historyMethods.el.removeAttribute(historyMethods.attrName);
            historyMethods.match.removeAttribute(historyMethods.attrName);
        }
    },
    redo : historyMethods=>{
        historyMethods.el.setAttribute(historyMethods.attrName,historyMethods.attrValue);
        historyMethods.match.setAttribute(historyMethods.attrName,historyMethods.attrValue);
    }
}

HTMLTreeMatch.prototype.style = function(el,prop,value,priority){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.attributes)
        throw new Error("[HTMLTreeMatch style] no match");
    var match = found.match;
    var wasWithout;
    if(!el.hasAttribute("style"))
        wasWithout = true;
    var oldValue = el.style.getPropertyValue(prop);
    var oldPriority = el.style.getPropertyPriority(prop);
    if(value == oldValue && priority == oldPriority)
        return;
    el.style.setProperty(prop, value, priority);
    var newProp = el.style.getPropertyValue(prop);
    var newPrior = el.style.getPropertyPriority(prop);
    if(newProp==oldValue && newPrior==oldPriority)
        return;
    match.style.setProperty(prop, value, priority);
    $self.setHistory({
        el,
        match,
        prop,
        value,
        oldValue,
        oldPriority,
        wasWithout,
        priority,
        method : "style"
    });
};
historyMethods.style = {
    undo:ho=>{
        ho.el.style.setProperty(ho.prop, ho.oldValue, ho.oldPriority);
        ho.match.style.setProperty(ho.prop, ho.oldValue, ho.oldPriority);
        if(ho.wasWithout){
            ho.el.removeAttribute("style");
            ho.match.removeAttribute("style");
        }
    },
    redo:ho=>{
        ho.el.style.setProperty(ho.prop,ho.value, ho.priority);
        ho.match.style.setProperty(ho.prop,ho.value, ho.priority);
    }
}

HTMLTreeMatch.prototype.textContent = function(el,text){
    var $self = this;
    var found = $self.find(el);
    if(!found || !found.HTML)
        throw new Error("[HTMLTreeMatch textContent] no match");
    var match = found.match;
    var oldTxtContent = el.textContent;
    var oldMatchTxtContent = match.textContent;
    el.textContent = text;
    match.textContent = text;
    $self.setHistory({
        el,
        match,
        text,
        oldTxtContent,
        oldMatchTxtContent,
        method : "textContent"
    });
};
historyMethods.textContent = {
    undo : ho=>{
        ho.el.textContent = ho.oldTxtContent;
        ho.match.textContent = ho.oldMatchTxtContent;
    },
    redo : ho=>{
        ho.el.textContent = ho.text;
        ho.match.textContent = ho.text;
    }
}

})();