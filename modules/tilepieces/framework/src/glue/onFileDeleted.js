window.addEventListener('file-deleted', data => {
  var fileData = data.detail;
  if (tilepieces.currentPage &&
    fileData.path == tilepieces.currentPage.path)
    tilepieces.setFrame("");
  if (tilepieces.fileSelected && fileData.path == tilepieces.fileSelected.path) {
    tilepieces.fileSelected = null;
  }
});