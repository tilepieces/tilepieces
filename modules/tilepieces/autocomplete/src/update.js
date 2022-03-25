function update(selection, tofocus) {
  var isInputType = globalTarget.tagName == "INPUT";
  if (isInputType)
    globalTarget.value = selection.textContent;
  else
    globalTarget.textContent = selection.textContent;
  if (tofocus) {
    globalTarget.focus();
    if (!isInputType) {
      var sel = globalTarget.ownerDocument.defaultView.getSelection();
      var range = new Range();
      range.selectNode(globalTarget.childNodes[0]);
      range.collapse();
      sel.removeAllRanges();
      sel.addRange(range);
    } else globalTarget.select();
  }
  globalTarget.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
}