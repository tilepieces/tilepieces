function handleCssTooltip(li, e) {
  var el = li["__html-tree-builder-el"];
  var notDisplay = [];
  if (li.classList.contains("not-match"))
    notDisplay = [1, 2, 3];
  if (el.sheet == app.core.currentStyleSheet)
    notDisplay.push(2);
  else
    notDisplay.push(4);
  var sameDomain = el.tagName == "STYLE" ||
    (el.tagName == "LINK" &&
      el.getAttribute("href") &&
      !el.getAttribute("href").match(/^(http:\/\/)|^(https:\/\/)/));
  if (!sameDomain || (el.tagName == "LINK" && !app.storageInterface))
    notDisplay.push(3,4);
  [...cssViewTooltip.children].forEach((v, i) =>
    v.style.display = notDisplay.indexOf(i) > -1 ? "none" : "block");
  tooltip(e, cssViewTooltip);
}