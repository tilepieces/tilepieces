function activateKey(e){
    if(!e.target.classList.contains("rule-block__key") || !e.isTrusted)
        return;
    if(e.target.dataset.contenteditable) { // removing on createAutocomplete
        e.target.setAttribute("contenteditable", "");
        e.target.focus();
    }
}