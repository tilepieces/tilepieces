function zoomControl(e){
    if(e.type == "wheel" && e.ctrlKey){
        fontSize = fontSize - (e.deltaY / 100);
        editor.getWrapperElement().style["font-size"] = fontSize+"px";
        editor.refresh();
        e.preventDefault();
    }
    if(e.ctrlKey && e.key == "+") {
        fontSize++;
        editor.getWrapperElement().style["font-size"] = fontSize+"px";
        editor.refresh();
        e.preventDefault();
    }
    if(e.ctrlKey && e.key == "-") {
        fontSize--;
        editor.getWrapperElement().style["font-size"] = fontSize+"px";
        editor.refresh();
        e.preventDefault();
    }
    if(e.ctrlKey && e.key == "0") {
        fontSize = defaultFontSize;
        editor.getWrapperElement().style["font-size"] = fontSize+"px";
        editor.refresh();
        e.preventDefault();
    }
}
document.addEventListener("keydown",zoomControl);
window.addEventListener("wheel",zoomControl,{passive:false});