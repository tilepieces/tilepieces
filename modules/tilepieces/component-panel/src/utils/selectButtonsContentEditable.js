function selectButtonsContentEditable(elContentEditable) {
  newTagNameInput.disabled = true;
  addNewTagFormButton.disabled = true;
  utf8CharsDetails.forEach(detail => detail.classList.remove("disabled"));
  buttons.forEach(v => {
    var tagName = v.textContent.trim();
    v.disabled = !tagName.match(app.utils.phrasingTags) || tagName == elContentEditable.tagName;
  })
}