window.dialogReader = (typeProp = "img",path = "")=>{
  return new Promise(async (res,rej)=>{
    docPath = path;
    var div = document.createElement("div");
    type = typeProp;
    var blobAccepted = typeEnum[type];
    var searchResult,storageInterfaceError;
    var endsFilesAccepted = blobAccepted.split(",");
    dialog.open("please wait...",true);
    var {resources,pagination} = await search(endsFilesAccepted)
    globalModel = {
      pagination,
      resources,
      type,
      accept:blobAccepted,
      disabled:"disabled",
      disableinputfile:"disabled",
      storageInterfaceClass : storageInterfaceError ? "interface-error" : "",
      miscpath : tilepieces.utils.paddingURL(tilepieces.miscDir)
    };
    evs = events();
    var templateClone = template.cloneNode(true);
    t = new TT(templateClone.content,globalModel);
    dialogObj = dialog.open(templateClone.content);
    dialogObj.dialog.addEventListener("click",selection);
    dialogObj.events.on("close",e=>{
        evs.dispatch("close","");
    });
    inputFile = document.getElementById("dialog-reader-file-input");
    filePathInput = document.getElementById("dialog-reader-filepath-input");
    fileButtonSave= document.getElementById("dialog-reader-file-button");
    fileSearch = document.getElementById("dialog-reader-filepath-search-form");
    fileSearchInput = document.getElementById("dialog-reader-filepath-search");
    fileSearchInput.value=""
    inputFileEvents(endsFilesAccepted);
    res(evs);
  })
};