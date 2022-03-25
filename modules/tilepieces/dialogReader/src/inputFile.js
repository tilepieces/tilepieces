function inputFileEvents() {
  inputFile.addEventListener("change", e=> {
    globalModel.disableinputfile = "";
    var file = e.target.files[0];
    globalModel.miscpath += file.name;
    globalModel.fileUploaded = file;
    t.set("", globalModel)
  });
  fileButtonSave.addEventListener("click", async e=> {
    dialog.close();
    dialog.open("processing file...");
    try {
      var finalPath = await tilepieces.utils.processFile(
        globalModel.fileUploaded,globalModel.miscpath,docPath);
      dialog.close();
      evs.dispatch("submit", finalPath);
    }
    catch(e){
      console.error(e);
      dialog.close();
      alertDialog(e.err || e.error || e.toString(),true);
    }
  })
}