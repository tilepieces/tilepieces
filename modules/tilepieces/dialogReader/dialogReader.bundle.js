(()=>{
const paginationItems = 10;
const typeEnum = {
  "audio" : ".mp3,.ogg,.wav",
  "video" : ".mp4,.ogg,.webm",
  "img" : ".apng,.gif,.jpg,.jpeg,.avif,"+
  ".jfif,.pjpeg,.pjp,.png,.svg,.webp,.bmp,.ico,.cur",
  "fonts" : ".otf,.ttf,.svg,.woff,.woff2,.eot"
};
const searchEnum = {
  "audio" : "**/*(*.mp3|*.ogg|*.wav)",
  "video" : "**/*(*.mp4|*.ogg|*.webm)",
  "img" : "**/*(*.apng|*.gif|*.jpg|*.jpeg|*.avif|"+
    "*.jfif|*.pjpeg|*.pjp|*.png|*.svg|*.webp|*.bmp|*.ico|*.cur)",
  "fonts" : "**/*(*.otf,*.ttf,*.svg,*.woff,*.woff2,*.eot)"
}
let type;
let template = document.getElementById("tilepieces-search-template");
let t;
let evs;
let selected;
let dialogObj;
let pagination;
let globalModel = {
  pagination : null,
  resources : [],
  disabled:"disabled"
};
let docPath;
let inputFile,filePathInput,fileButtonSave,fileSearch;
function inputFileEvents(endsFilesAccepted) {
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
  fileSearchInput.addEventListener("keydown",e=>{
    if(e.key == "Enter"){
      e.preventDefault();
      submitSearch(endsFilesAccepted)
    }
  })
  fileSearchInput.addEventListener("change",e=>{
      submitSearch(endsFilesAccepted)
  })
  fileSearch.addEventListener("submit", async e=> {
    e.preventDefault();
    submitSearch(endsFilesAccepted)
  })
}
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
async function search(endsFilesAccepted,customSearch){
  try {
    searchResult = await storageInterface.search("",customSearch || searchEnum[type]);
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
  return {resources,pagination};
}
function selection(e){
  var target = e.target;
  if(target.closest(".upload-file-mask"))
    return;
  var figure = target.closest("figure");
  var button = target.nodeName == "BUTTON";
  if(figure){
    selected && selected.classList.remove("sel");
    selected = figure;
    selected.classList.add("sel");
    t.set("disabled","");
  }
  if(button && selected){
    dialogObj.dialog.removeEventListener("click",selection);
    dialog.close();
    var selectedValue = selected.dataset.value.replace(tilepieces.frameResourcePath() + "/","");
    evs.dispatch("submit",tilepieces.relativePaths ?
      tilepieces.utils.getRelativePath(docPath || tilepieces.utils.getDocumentPath(),selectedValue) :
      selectedValue[0] == "/" ? selectedValue : "/" + selectedValue
    );
  }
  if(typeof target.dataset.prev == "string" ||
    typeof target.dataset.next == "string"){
    var pointer = target.dataset.prev == "" ?
    globalModel.pagination.pointer-paginationItems :
    globalModel.pagination.pointer+paginationItems;
    var page = target.dataset.prev == "" ? globalModel.pagination.page-1 :
    globalModel.pagination.page+1;
    globalModel.resources = globalModel.pagination.total.slice(pointer,pointer + paginationItems);
    globalModel.pagination = {
      total : pagination.total,
      pages : globalModel.pagination.pages,
      page,
      pointer
    };
    t.set("",globalModel);
    globalModel =t.scope;
    selected && selected.classList.remove("sel");
  }
}
async function submitSearch(endsFilesAccepted){
  //dialog.open("searching...");
  try {
    var {resources,pagination} = await search(endsFilesAccepted,fileSearchInput.value);
    globalModel.resources = resources;
    globalModel.pagination = pagination;
    t.set("",globalModel)
    //dialog.close();
  }
  catch(e){
    console.error(e);
    dialog.close();
    alertDialog(e.err || e.error || e.toString(),true);
  }
}

})();