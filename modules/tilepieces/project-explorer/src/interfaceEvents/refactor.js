function ptRefactor(data) {
  var confirm = confirmDialog(`Do you want to refactor ${data.oldName} in ${data.newName}?`);
  confirm.events.on("confirm",value=>{
    if(value)
      confirmRefactor(data)
  });
}

function confirmRefactor(data) {
  var parentPath = data.path.split("/");
  parentPath.pop();
  parentPath = parentPath.length ? parentPath.join("/") + "/" : "";
  var newPath = parentPath + data.newName
  storageIntegration.copy(parentPath + data.oldName,
    newPath, true).then(rename => {
    data.validate();
    storageIntegration.read(newPath).then(newValue => {
      if (!data.isFile)
        pt.update(data.selected, newValue.value);
      else
        openRecursively(newPath,true);
      opener.dispatchEvent(new CustomEvent('file-renamed',
        {
          detail: {
            newName: data.newName,
            oldName: data.oldName,
            newPath: parentPath + data.newName,
            oldPath: parentPath + data.oldName,
            file: newValue
          }
        }
      ));
    }, err => {
      console.error("[error in reading path after refactoring]", err);
      alertDialog("Error in reading path " + data.path + " after refactoring");
    })
  }, err => {
    console.error("[error in refactoring path]", err);
    alertDialog("Error in deleting path " + data.path);
  })
}
