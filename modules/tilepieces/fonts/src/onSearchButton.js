appView.addEventListener("click", e => {
  if (!e.target.classList.contains("search-button"))
    return;
  var font = e.target.closest(".font");
  var fontModel = model.fonts[font.dataset.index];
  var index = +e.target.dataset.index;
  var dialogSearch = opener.dialogReader("fonts", app.core.currentStylesheet?.href?.replace(location.origin, ""));
  dialogSearch.then(dialog => {
    dialog.on("submit", src => {
      fontModel.srcResources[index].url = src;
      appView.dispatchEvent(new CustomEvent("template-digest", {detail: {target: e.target}}))
    })
  })
});
