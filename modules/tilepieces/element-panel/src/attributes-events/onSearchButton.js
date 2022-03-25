attributesView.addEventListener("click", e => {
  if (!e.target.closest(".search-button"))
    return;
  var tagName = modelAttributes.nodeName;
  var tagParentName = app.elementSelected.parentNode.tagName;
  var isSOURCE = tagName == "SOURCE";
  var typeSearch = isSOURCE ? tagParentName.toLowerCase() : tagName.toLowerCase();
  var dialogSearch = opener.dialogReader(typeSearch);
  dialogSearch.then(dialog => {
    dialog.on("submit", src => {
      var sel = app.elementSelected;
      app.core.htmlMatch.setAttribute(isSOURCE ? sel.parentNode : sel, "src", src);
    })
  })
})
