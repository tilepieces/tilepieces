function onInput(e) {
  var target = e.target;
  if (!target || !target.classList)
    return;
  if (!target.classList.contains("input-css"))
    return;
  if (!target.hasAttribute("contenteditable"))
    return;
  if (target.__autocomplete_is_running)
    return;
  var sel = e.target.ownerDocument.defaultView.getSelection();
  var range = sel.getRangeAt(0);
  var tokens = matchValue(target.innerHTML);
  var token = tokens
    .find(v => range.startOffset >= v.start && range.endOffset <= v.end);
  if (e.key == "Enter")
    e.preventDefault();
  if (!token)
    return;
  if ((e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "PageUp" || e.key == "PageDown") && token.type == "number") {
    e.preventDefault();
    var moveDir = e.key == "ArrowUp" || e.key == "PageUp" ? "up" : "down";
    var incr = 1;
    if (e.ctrlKey)
      incr = 100;
    else if (e.shiftKey)
      incr = 10;
    else if (e.altKey)
      incr = 0.1;
    move(target, token, moveDir, range, incr);
  }
}

document.addEventListener("keydown", onInput, true);