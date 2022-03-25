function blur(e) {
  var t = e.target;
  if (!t.classList.contains("input-css"))
    return;
  t.__current_token = false;
  if (!t.hasAttribute("contenteditable")) {
    t.classList.add("focus-control");
    return;
  }
  setTargetHTML(e.target);
}