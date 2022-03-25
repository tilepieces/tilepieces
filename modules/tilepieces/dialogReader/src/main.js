window.dialogReader = (typeProp = "img",path = "")=>{
  return new Promise(async (res,rej)=>{
    docPath = path;
    var div = document.createElement("div");
    type = typeProp;
    var blobAccepted = typeEnum[type];
    var searchResult,storageInterfaceError;
    var endsFilesAccepted = blobAccepted.split(",");
    dialog.open("please wait...",true);
    try {
      searchResult = await storageInterface.search("",searchEnum[type]);
    }
    catch(e){
      searchResult = {searchResult:[]};
      storageInterfaceError = true;
    }
    var searchResults = searchResult.searchResult.filter(v=>endsFilesAccepted.find(ef=>v.endsWith(ef)))
    var resources = searchResults.map(i=>{
        return{
            src:tilepieces.frameResourcePath() + "/" + i,
            filename:i.split(/[\\/]/).pop()
        }
    });
    if(resources.length>paginationItems) {
        pagination = {
            total : resources.slice(0),
            pages : Math.ceil(resources.length / paginationItems),
            page:1,
            pointer:0
        };
        resources = resources.slice(0, paginationItems);
    }
    else pagination = null;
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
    inputFileEvents();
    res(evs);
  })
};