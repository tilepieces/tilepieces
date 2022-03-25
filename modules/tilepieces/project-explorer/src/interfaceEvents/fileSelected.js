function ptFileSelected(data) {
  storageIntegration.read(data.path).then(fileText => {
    var path = data.path;
    var name = path.split("/").pop();
    opener.dispatchEvent(new CustomEvent('file-selected',
      {
        detail: {
          path,
          name,
          ext: name.includes(".") ?
            name.split('.').pop() :
            null,
          file: fileText,
          fileText,
          data
        }
      }
    ));
  }, err => {
    console.error("[error in opening file]", err);
    alertDialog("Error in opening file " + data.path);
  })
}

/*
loadFile.addEventListener("click",e=> {
    var selected = pt && pt.selected[0];
    if(selected){
        ptFileSelected({
            path : selected.dataset.path,
            file : selected.dataset.file
        })
    }
});
    */