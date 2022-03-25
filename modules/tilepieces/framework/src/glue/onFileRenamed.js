window.addEventListener('file-renamed', data => {
  var fileData = data.detail;
  if (tilepieces.currentPage &&
    fileData.oldPath == tilepieces.currentPage.path) {
    document.title = tilepieces.currentProject + " - " + fileData.newPath + " - tilepieces";
    tilepieces.storageInterface.setSettings({
      "projectSettings": {
        "lastFileOpened": fileData.newPath
      }
    });
    tilepieces.setFrame("/" + fileData.newPath, fileData.file);
  } else if (tilepieces.fileSelected && fileData.path == tilepieces.fileSelected.path) {
    tilepieces.fileSelected = {
      ext: fileData.newName.includes(".") ?
        fileData.newName.split('.').pop() :
        null,
      file: fileData.file,
      fileText: fileData.file,
      mainFrameLoad: true,
      name: fileData.newName,
      path: fileData.path
    }
  }
});