function onAttrPaste(e) {
  e.preventDefault();
  var t = e.target;
  var clipboardData = e.clipboardData;
  if (clipboardData && clipboardData.getData) {
    var text = clipboardData.getData("text/plain");
    if (text.length) {
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
    }
  }
}