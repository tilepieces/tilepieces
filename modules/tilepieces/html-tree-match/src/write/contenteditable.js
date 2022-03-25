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