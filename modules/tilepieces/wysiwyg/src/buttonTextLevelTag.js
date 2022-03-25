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