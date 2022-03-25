function mousewheel(e) {
  var target = e.target;
  if (!target || !target.classList)
    return;
  if (!target.classList.contains("input-css"))
    return;
  if (!target.hasAttribute("contenteditable"))
    return;
  if (target.__autocomplete_is_running)
    return;
  var sel = target.ownerDocument.defaultView.getSelection();
  var range = sel.getRangeAt(0);
  var tokens = matchValue(target.innerHTML);
  var token = tokens
    .find(v => range.startOffset >= v.start && range.endOffset <= v.end);
  if (e.key == "Enter")
    e.preventDefault();
  if (!token)
    return;
  var delta = Math.sign(e.deltaY);
  var moveDir = delta < 0 ? "up" : "down";
  var incr;
  if (e.ctrlKey)
    incr = 100;
  else if (e.shiftKey)
    incr = 10;
  else if (e.altKey)
    incr = 0.1;
  else incr = 1;
  move(target, token, moveDir, range, incr);
  e.preventDefault();
}

window.addEventListener('mousewheel', mousewheel, {passive: false});