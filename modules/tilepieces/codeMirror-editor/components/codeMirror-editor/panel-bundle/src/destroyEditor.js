function destroyEditor(){
    var oldEditor = document.body.querySelector(".CodeMirror");
    oldEditor.parentNode.removeChild(oldEditor);
    editor = null;
}