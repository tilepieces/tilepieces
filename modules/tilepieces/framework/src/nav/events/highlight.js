function highlight(e) {
  if (tilepieces.lastEditable && tilepieces.lastEditable.el.contains(e.target))
    return;
  tilepieces.highlight = e.target;
}