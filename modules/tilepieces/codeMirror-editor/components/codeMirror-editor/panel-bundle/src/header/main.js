let opener = window.opener || window.parent;
let settings = opener.tilepieces || {};
let codeArea = document.getElementById("code");
let fileValue = settings.codeMirrorEditorValue?.value || "";
let ext = settings.codeMirrorEditorValue?.ext || "js";
const defaultFontSize = 13;
let fontSize = defaultFontSize;
let editor = createEditor();
editor.setValue(fileValue.trim());
editor.setOption("mode", "text/" + (ext == "js" || ext == "json" ? "javascript" : ext));
var buttonDone = document.getElementById("done");
buttonDone.addEventListener("click",e=>{
    fileValue = editor.getValue().trim();
    opener.dispatchEvent(new CustomEvent("codemirror-editor-done",{detail:fileValue}))
});

