window.addEventListener("file-selected", data => {
  var fileData = data.detail;
  var path = fileData.path[0] != "/" ? "/" + fileData.path : fileData.path;
  if (fileData.mainFrameLoad) {
    console.log("double call, returning.", path);
    return;
  }
  tilepieces.fileSelected = fileData;
  if (fileData.ext == "html" || fileData.ext == "htm") {
    document.title = tilepieces.currentProject + " - " + fileData.path + " - tilepieces";
    tilepieces.storageInterface.setSettings({
      "projectSettings": {
        "lastFileOpened": path
      }
    });
    tilepieces.setFrame(path, fileData.fileText);
  }
});