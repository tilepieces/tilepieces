function changeUrlBackground(URL, index) {
  model.backgrounds[index].backgroundImage = "url(" + URL + ")";
  model.backgrounds[index].imageSrc = parsingImageUrl(URL);
  setCss("background-image", createNewBgProp("backgroundImage"));
  t.set("", model);
  inputCss(appView);
}

appView.addEventListener("change", e => {
  if (e.target.dataset.type != "url-background") return;
  var index = e.target.dataset.index;
  var files = e.target.files;
  app.utils.processFile(files[0]).then(res => {
    if (res) changeUrlBackground(res, index)
  })
});
window.addEventListener("dropzone-dropping", e => {
  if (e.detail.target.dataset.type != "url-background") return;
  var index = e.detail.target.dataset.index;
  var type = e.detail.type;
  var currentStyleSheet = app.core.currentStyleSheet;
  var relativeToWhat = currentStyleSheet?.href?.replace(location.origin + "/", "");
  if (type == "files")
    app.utils.processFile(e.detail.files[0], null, relativeToWhat).then(res => {
      if (res) changeUrlBackground(res, index)
    });
  else {
    var img = e.detail.placeholderHTML.querySelector("img");
    if (img) changeUrlBackground(img.src, index)
  }
});
appView.addEventListener("click", e => {
  var target = e.target.closest("[dropzone]");
  if (!target)
    return;
  var index = target.dataset.index;
  if (target && !target.classList.contains("ondrop")) {
    var currentStyleSheet = app.core.currentStyleSheet;
    var relativeToWhat = currentStyleSheet?.href?.replace(location.origin + "/", "");
    var imageSearch = dialogReader("img", relativeToWhat);
    imageSearch.then(imageSearchDialog => {
      imageSearchDialog.on("submit", res => changeUrlBackground(res, index));
    }, e => {
      opener.dialog.open(e.toString());
      console.error(e);
    })
  }
});