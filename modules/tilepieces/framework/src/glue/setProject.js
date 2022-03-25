function setProject(e){
  var prName = e.detail.name;
  updateSettings(prName);
  var lastFileOpened = e.detail.lastFileOpened || tilepieces.project.lastFileOpened;
  if(!lastFileOpened) {
    dialog.close();
    tilepieces.setFrame("");
  }
  else {
    storageInterface.read(lastFileOpened)
      .then(res => {
        var name = lastFileOpened.split("/").pop();
        tilepieces.fileSelected = {
          path: lastFileOpened,
          name,
          ext: name.includes(".") ?
            name.split('.').pop() :
            null,
          file: res,
          fileText: res
        };
        tilepieces.setFrame(lastFileOpened, res)
        dialog.close();
      }, err => {
        var sentence = "error in reading file " + lastFileOpened + " in current project '" + prName + "'";
        console.error("[" + sentence + "]", err);
        dialog.close();
        alertDialog(sentence, true);
        tilepieces.core?.destroy();
        menuBarTrigger.classList.add("no-frame");
        //tilepieces.setFrame("");
      });
  }
  window.dispatchEvent(new Event("project-setted"));
}
function checkIfUpdateFileIsEmpty(e){
  dialog.open("Setting Project...", true);
  if(Object.keys(tilepieces.toUpdateFileObject).length){
    dialog.open("Files are finishing to be updated...", true);
    setTimeout(()=>{
      checkIfUpdateFileIsEmpty(e)
    },500)
  }
  else
    setProject(e)
}
window.addEventListener("set-project", checkIfUpdateFileIsEmpty);