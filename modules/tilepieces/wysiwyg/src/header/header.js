// https://stackoverflow.com/questions/56203483/how-to-detect-invisible-zero-width-or-whitespace-characters-in-unicode-in-java?noredirect=1&lq=1
// https://stackoverflow.com/questions/11305797/remove-zero-width-space-characters-from-a-javascript-string/11305926#11305926
//let zeroWidthChars = /\u{0}+|\u{feff}+|\u{200b}+|\u{200c}+|\u{200d}/gu;
let zeroWidthChars = /[\u200B-\u200D\uFEFF]/g;
let opener = window;
var app = opener.tilepieces;
let regexNumbers = /[+-]?\d+(?:\.\d+)?/; // https://codereview.stackexchange.com/questions/115885/extract-numbers-from-a-string-javascript
let globalSel,globalRange;
let textPermittedPhrasingTags = app.utils.textPermittedPhrasingTags;
let textPermittedFlowTags = app.utils.textPermittedFlowTags;
opener.addEventListener("WYSIWYG-start",e=>{
    var el = e.detail;
    globalSel = el.ownerDocument.defaultView.getSelection();
    if(!globalSel.anchorNode){
        console.error("WYSIWYG started with no selection. exit");
        return;
    }
    globalRange = globalSel.getRangeAt(0);
    var anchorNode = globalSel.anchorNode;
    var elToParse = anchorNode ?
        (anchorNode.nodeType == 3 ? anchorNode.parentElement : anchorNode) :
        el;
    opener.dispatchEvent(
        new CustomEvent("WYSIWYG-el-parsed",{detail:{target: elToParse,event:e}})
    )
});
