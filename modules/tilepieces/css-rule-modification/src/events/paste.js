function insertTextAtCursor(text,t) {
    var sel, range;
    sel = t.ownerDocument.defaultView.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(t.ownerDocument.createTextNode(text));
    var en = new KeyboardEvent("input", {bubbles : true});
    t.dispatchEvent(en);
}
function onPaste(e,autocompleteSingleton,t,model,appView,cbFunction){
    if(!e.target.classList.contains("rule-block__key") &&
        !e.target.classList.contains("rule-block__value"))
        return;
    if (e.clipboardData && e.clipboardData.getData) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        if(!text.length)
            return;
        var semicomma = text.indexOf(";");
        if(semicomma==-1){
            insertTextAtCursor(text,e.target);
        }
        else {
            var ruleEl = e.target.closest(".rule-block__list");
            var rule = ruleEl["__css-viewer-rule"];
            if(e.target.classList.contains("rule-block__value")){
                var newTextSplitted = text.slice(0,semicomma);
                insertTextAtCursor(newTextSplitted,e.target);
                text = text.slice(semicomma+1);
            }
            opener.getCssTextProperties(text).forEach(v=>{
                modifyValueProperty(rule,v.property,v.value,rule.isStyle);
            });
            if(e.target.classList.contains("rule-block__key")) {
                autocompleteSingleton.blur();
                updateRuleOnBlur(e.target,t,model,appView,cbFunction);
            }
            else
                e.target.blur();
        }
    }
}