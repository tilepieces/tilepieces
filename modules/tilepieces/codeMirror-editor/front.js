(function(){
    let codeMirrorEditor = document.getElementById("codeMirror-editor");
    let codeMirrorEditorPanel = panel(codeMirrorEditor,null,false,46);
    codeMirrorEditor.style.zIndex = 46;
    let preventDockableResizableMouseOut = document.querySelector(".__drag-prevent-mouse-out");
    let firstChange = true;
    tilepieces.codeMirrorEditor = function(sourceString,ext){
        return new Promise((resolve,reject)=>{
            tilepieces.codeMirrorEditorValue = {
                value: sourceString,
                ext
            };
            preventDockableResizableMouseOut.style.zIndex = 45;
            function dispose(){
                window.removeEventListener("codemirror-editor-done", done);
                window.removeEventListener("panel-close", close);
                preventDockableResizableMouseOut.zIndex = "";
                firstChange = true;
                tilepieces.codeMirrorEditorValue = {};
                window.dispatchEvent(new Event("release"));
            }
            function done(e) {
                dispose();
                codeMirrorEditorPanel.close();
                return resolve(e.detail);
            }
            function close() {
                dispose();
                reject();
            }
            window.dispatchEvent(new Event("lock-down"));
            codeMirrorEditorPanel.show();
            window.addEventListener("codemirror-editor-done", done);
            window.addEventListener("panel-close", close);
        });
    }
})();