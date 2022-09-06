function createNewFileOnInput(filePath,fileString = ""){
  return new Promise((res,rej)=>{
    var configDialog = opener.confirmDialog(filePath +  " does not exists. Do you want to create it?");
    configDialog.events.on("confirm",async ()=>{
      try {
        await app.storageInterface.update(filePath, new Blob([fileString]));
      }
      catch(e){return rej()}
      res();
    });
    configDialog.events.on("reject",()=>rej({reason:"user reject"}));
  })
}