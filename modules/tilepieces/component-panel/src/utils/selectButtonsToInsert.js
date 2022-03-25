function selectButtonsToInsert(selectorObject) {
  if (app.contenteditable)
    return;
  var selectTagName = selectorObject.target.tagName;
  var composedPath = selectorObject.composedPath;
  var isMatching = selectorObject.match && (selectorObject.match.HTML ||
    selectorObject.target.tagName == "BODY");
  componentSectionRoot.hidden = !isMatching || selectorObject.target.tagName == "HTML" ||
    (selectorObject.target.tagName == "HEAD" &&
      (app.insertionMode == "after" || app.insertionMode == "before")) ||
    (selectorObject.target.tagName == "BODY" &&
      (app.insertionMode == "after" || app.insertionMode == "before"));
  newTagNameInput.disabled = componentSectionRoot.hidden;
  addNewTagFormButton.disabled = componentSectionRoot.hidden;
  var composedPathSliced = composedPath;
  if (app.insertionMode == "after" || app.insertionMode == "before")
    composedPathSliced = composedPath.slice(1, composedPath.length);
  buttons.forEach(button => {
    button.classList.remove("selected");
    var tagName = button.textContent.trim();
    var directParentTagName = composedPath[0].tagName;
    var HTMLHEADBODYRestrinction = (directParentTagName && directParentTagName.match(/(HTML|HEAD)$/)) ||
      (directParentTagName == "BODY" &&
        (app.insertionMode == "after" || app.insertionMode == "before"));
    var isTextNodeType = composedPath[0].nodeType != 1 &&
      (app.insertionMode == "prepend" || app.insertionMode == "append");
    if (!isMatching || HTMLHEADBODYRestrinction || isTextNodeType)
      button.disabled = true;
    else
      button.disabled = app.utils.notAdmittedTagNameInPosition(tagName, composedPathSliced);
  })
}