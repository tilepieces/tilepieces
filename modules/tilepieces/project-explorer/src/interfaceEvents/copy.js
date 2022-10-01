async function ptCopy(data) {
  /*
  if(!data || !Array.isArray(data))
    return;
  for(var i = 0;i<data.length;i++){
    var node = data[i];
    if(node.dataset.file){
      dialog.open("copying file in clipboard...",true);
      console.log("copying:", node);
      try {
        var dataFile = await app.storageInterface.read(node.dataset.path);
        var file = dataFile instanceof Blob ? dataFile : new Blob([dataFile],{type:"text/html"});
        var clipboardData = [new ClipboardItem({[file.type]: file})];
        await navigator.clipboard.write(clipboardData)
      }
      catch(e){
        console.error(e);
        opener.alertDialog("error on copying file ",true);
      }
      dialog.close();
    }
  }
  */
}