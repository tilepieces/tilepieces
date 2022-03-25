function focusInput(e) {
  var el = e.target;
  var cssInputPlaceholder = el.closest(".input-css-placeholder");
  if (!cssInputPlaceholder)
    return;
  if (el.classList.contains("prevent-click") || el.closest(".prevent-click"))
    return;
  var cssInput = cssInputPlaceholder.previousElementSibling;
  cssInput.classList.remove("focus-control");
  if (!cssInputPlaceholder.innerText.trim()) {
    cssInput.focus();
    return;
  }
  var isToken = el.closest("div.token");
  var dti = isToken && isToken.dataset.tokenIndex;
  var selection = cssInput.ownerDocument.defaultView.getSelection();
  var range = new Range();
  if (dti) {
    var tokens = matchValue(cssInput.innerText);
    var token = tokens[dti];
    range.setStart(cssInput.childNodes[0], token.start);
    range.setEnd(cssInput.childNodes[0], token.end);
  } else
    range.selectNodeContents(cssInput.childNodes[0]);
  selection.removeAllRanges();
  selection.addRange(range);
  cssInput.focus();
}