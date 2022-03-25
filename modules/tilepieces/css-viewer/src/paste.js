appView.addEventListener("paste", e => {
  var t = e.target;
  if (t.dataset.bind != "currentSelector")
    return;
  e.preventDefault();
  if (e.clipboardData && e.clipboardData.getData) {
    var text = e.clipboardData.getData("text/plain");
    if (text.length) {
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
      var en = new KeyboardEvent("input", {bubbles: true});
      t.dispatchEvent(en);
    }
  }
});