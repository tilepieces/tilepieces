async function ptPaste(data) {
  console.log("paste received:", data);
  dialog.open("copying files...", true);
  if (!data.oldPaths.length) {
    dialog.close();
    console.error("move no valid paths, return;");
    alertDialog("invalid move");
    return;
  }
  var move = data.type == "cut";
  for (var i = 0; i < data.oldPaths.length; i++) {
    var oldPath = data.oldPaths[i];
    var namePath = oldPath.file || oldPath.dir;
    var newPath = data.newPath + "/" + namePath;
    try {
      var copy = await storageIntegration.copy(oldPath.path, newPath, move);
    } catch (e) {
      dialog.close();
      console.error("[error in copying/moving files]", e);
      alertDialog("Error in copying/moving file " + oldPath.path + " in " + data.newPath + "/" + namePath);
      return;
    }
    move && pt.delete(oldPath.path, null, false);
    console.log("copy files ", copy);
    if(i == data.oldPaths.length-1){
      openRecursively(copy.newPath,true);
    }
  }

  // dispatch "paste"
  opener.dispatchEvent(new CustomEvent('file-pasted',
    {
      detail: {
        path: data.newPath,
        oldPath: oldPath.path
      }
    }
  ));
  dialog.close();
}