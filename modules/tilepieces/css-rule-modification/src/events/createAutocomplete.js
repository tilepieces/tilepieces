function createAutocomplete(e) {
  var target = e.target;
  if (!target.classList.contains("rule-block__key") || !e.isTrusted)
    return;
  target.nextElementSibling.nextElementSibling.__autocomplete_suggestions =
    target.dataset.key == "font-family" ?
      tilepieces.core.fontSuggestions :
      cssDefaultValues[e.target.textContent] || [];
  target.removeAttribute("contenteditable")
}