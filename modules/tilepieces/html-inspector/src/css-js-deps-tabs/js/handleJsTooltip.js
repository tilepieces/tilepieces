function handleJsTooltip(li, e) {
  var el = li["__html-tree-builder-el"];
  var notDisplay = [];
  if (li.classList.contains("not-match"))
    notDisplay = [1, 2];
  var sameDomain = !el.src || (el.tagName == "SCRIPT" && el.src
    && !el.getAttribute("src").match(/^(http:\/\/)|^(https:\/\/)/));
  if (!sameDomain || (el.src && !app.storageInterface))
    notDisplay.push(3);
  [...jsViewTooltip.children].forEach((v, i) =>
    v.style.display = notDisplay.indexOf(i) > -1 ? "none" : "block");
  tooltip(e, jsViewTooltip);
}