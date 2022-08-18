function clickImageInProject(e) {
  var inputCssPlaceholder = e.target.closest(".input-css-placeholder");
  var pathhref = "";
  if (opener.tilepieces?.core?.currentStyleSheet?.ownerNode.tagName === "LINK") {
    var linkHref = opener.tilepieces.core.currentStyleSheet.href.replace(location.origin, "");
    var frameResourcePath = opener.tilepieces.utils.paddingURL(opener.tilepieces.frameResourcePath());
    pathhref = linkHref.replace(frameResourcePath, "");
  }
  var imageSearch = opener.dialogReader("img", pathhref);
  imageSearch.then(imageSearchDialog => {
    imageSearchDialog.on("submit", src => {
      e.target.nextElementSibling.textContent = "url(" + src + ")";
      setText(inputCssPlaceholder)
    });
  }, e => {
    opener.alertDialog(e.error || e.err || e.toString(), true);
    console.log(e);
  })
}
