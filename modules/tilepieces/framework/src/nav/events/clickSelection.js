function clickSelection(e) {
  if (tilepieces.lastEditable && (e.target == tilepieces.lastEditable.el || tilepieces.lastEditable.el.contains(e.target)))
    return;
  else if (tilepieces.lastEditable) {
    tilepieces.lastEditable.destroy();
    tilepieces.lastEditable = null;
  }
  tilepieces.highlight = null;
  var target = e.target.nodeName == "HTML" && tilepieces.contenteditable ?
    e.target.ownerDocument.body :
    e.target;
  var composedPath = e.composedPath ? e.composedPath() : tilepieces.selectorObj.composedPath;
  if (target.nodeType != 1 && tilepieces.contenteditable) {
    target = target.parentNode;
    composedPath = composedPath.slice(1);
  }
  var match = tilepieces.core.htmlMatch.find(target);
  tilepieces.core.selectElement(target, match, composedPath);
  if (tilepieces.contenteditable && match.HTML && match.match &&
    !composedPath.find(v => v.tagName && v.tagName.match(tilepieces.utils.notEditableTags))) {
    tilepieces.core.contenteditable(target);
  }
}