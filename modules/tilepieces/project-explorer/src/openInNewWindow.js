openInNewWindow.addEventListener("click", e => {
  var path = pt && pt.selected[0] && pt.selected[0].dataset.path;
  if (path) {
    var w = window.open(
      location.origin + "/" + app.frameResourcePath() + "/" + path, "_blank");
    w.opener = null;
  }
});