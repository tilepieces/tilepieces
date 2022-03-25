function insertTextAtCursor(text, t) {
  var sel, range;
  sel = t.ownerDocument.defaultView.getSelection();
  range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(t.ownerDocument.createTextNode(text));
  var en = new KeyboardEvent("input", {bubbles: true});
  t.dispatchEvent(en);
}

function onPaste(e) {
  if (!e.target.classList.contains("input-css"))
    return;
  e.preventDefault();
  if (e.clipboardData && e.clipboardData.getData) {
    var text = e.clipboardData.getData("text/plain");
    if (text.length)
      insertTextAtCursor(text, e.target);
  }
}