function ptDelete(data) {
  var confirm = confirmDialog(`Do you want to delete ${data.path}?`);
  confirm.events.on("confirm",value=>{
    if(value)
      confirmDelete(data)
    else
      data.reject();
  });
}
function confirmDelete(data) {
  storageIntegration.delete(data.path).then(res => {
    data.validate();
    opener.dispatchEvent(new CustomEvent('file-deleted',
      {
        detail: {
          path: data.path,
          data
        }
      }
    ));
  }, err => {
    console.error("[error in deleting path]", err);
    alertDialog("Error in deleting path " + data.path);
  })
}