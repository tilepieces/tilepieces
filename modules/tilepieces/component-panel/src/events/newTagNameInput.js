addNewTagForm.addEventListener("submit", e => {
  e.preventDefault();
  var newTag = newTagNameInput.value.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "").toUpperCase();
  if (!newTag.length)
    return;
  var composedPath = app.selectorObj.composedPath;
  var composedPathSliced = composedPath;
  if (app.insertionMode == "after" || app.insertionMode == "before")
    composedPathSliced = composedPath.slice(1, composedPath.length);
  var isNotAdmittedHere = app.elementSelected.nodeType != 1 || app.utils.notAdmittedTagNameInPosition(newTag, composedPathSliced);
  if (isNotAdmittedHere)
    addNewTagFormSmall.classList.add("show");
  else {
    var newEl;
    if (templates[newTag])
      newEl = templates[newTag].cloneNode(true);
    else {
      newEl = app.elementSelected.getRootNode().createElement(newTag);
      newEl.innerHTML = !newTag.match(app.utils.notEditableTags) ? "This is a " + newTag + " tag" : "";
    }
    app.core.htmlMatch.insertAdjacentElement(app.elementSelected, app.insertionMode, newEl);
    //app.core.selectElement(newEl);
    newTagNameInput.value = "";
  }
});

function removeNewTagErrorBanner() {
  addNewTagFormSmall.classList.remove("show")
}

newTagNameInput.addEventListener("input", removeNewTagErrorBanner);
newTagNameInput.addEventListener("focus", removeNewTagErrorBanner);