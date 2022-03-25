function createEditor(){
    return CodeMirror.fromTextArea(codeArea, {
        autoCloseTags: true,
        matchTags: {bothTags: true},
        matchBrackets : true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lineNumbers: true,
        extraKeys: {
            "Alt-F": "findPersistent",
            "Ctrl-Space": "autocomplete",
            "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor())},
            "Ctrl-J": "toMatchingTag"
        }
    });
}