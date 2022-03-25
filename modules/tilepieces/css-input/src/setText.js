function setText(inputCssPlaceholder) {
  var inputCss = inputCssPlaceholder.previousElementSibling;
  inputCss.textContent = textNodesUnder(inputCssPlaceholder).map(t => t.textContent).join("");
  inputCss.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
  inputCss.dispatchEvent(new Event("css-input-set-text", {bubbles: true}))
}