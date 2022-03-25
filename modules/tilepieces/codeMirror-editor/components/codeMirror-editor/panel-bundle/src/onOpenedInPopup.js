/*
window.addEventListener("window-popup-open",e=>{
    if(!editor)
        return;
    editor.focus();
    editor.setCursor(editor.getCursor());
    e.detail.newWindow.addEventListener("wheel",zoomControl,{passive:false});
    e.detail.newWindow.document.addEventListener("keydown",zoomControl);
});
window.addEventListener("window-popup-close",e=>{
    if(!editor)
        return;
    editor.focus();
    editor.setCursor(editor.getCursor());
});*/
/*
window.addEventListener("window-popup-open",function(e){
    var dockableElement = e.detail.dockableElement;
    var dockableElementIframe = e.detail.dockableElementIframe;
    var newWindow = e.detail.newWindow;
    if(!dockableElementIframe.contentDocument.defaultView.editor)
        return;
    fileValue = dockableElementIframe.contentDocument.defaultView.editor.getValue();
    ext = dockableElementIframe.contentDocument.defaultView.ext;
    filePath =  dockableElementIframe.contentDocument.defaultView.filePath;
    editor = createEditor();
    write();
    editor.setValue(fileValue);
    editor.setOption("mode","text/" + (ext == "js" || ext == "json" ? "javascript" : ext));
    editor.setCursor(dockableElementIframe.contentDocument.defaultView.editor.getCursor());
});
window.addEventListener("window-popup-close",function(e){
    var dockableElement = e.detail.dockableElement;
    var dockableElementIframe = e.detail.dockableElementIframe;
    var newWindow = e.detail.newWindow;
    if(!newWindow.editor)
        return;
    fileValue = newWindow.editor.getValue();
    ext = newWindow.ext;
    filePath =  newWindow.filePath;
    if(!editor) {
        editor = createEditor();
        write();
    }
    editor.setValue(fileValue);
    editor.setOption("mode","text/" + (ext == "js" || ext == "json" ? "javascript" : ext));
    editor.setCursor(newWindow.editor.getCursor());
    editor.refresh();
    dockableElementIframe.focus();
});
    */