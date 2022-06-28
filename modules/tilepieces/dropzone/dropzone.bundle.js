(()=>{
function dragLeave(e){
    e.preventDefault();
    var target = e.target;
    var dropzone = target.closest("[data-dropzone]");
    if(dropzone)
        dropzone.classList.remove("ondrop");
}
function dragover(e){
    e.preventDefault();
    var target = e.target;
    var dropzone = target.closest("[data-dropzone]");
    if(dropzone)
        dropzone.classList.add("ondrop");
}
function drop(e){
  e.preventDefault();
  var target = e.target;
  var dropzone = target.closest("[data-dropzone]");
  if(!dropzone)
    return;
  dropzone.classList.remove("ondrop");
  var files = e.dataTransfer.files;
  if(files.length) {
    dropzone.dispatchEvent(new CustomEvent("dropzone-dropping",{
      bubbles:true,
      detail:{
          type : "files",
          target : dropzone,
          files
      }
    }))
  }
  else{
    /*
    var html = e.dataTransfer.getData("text/html");
    var placeholder = document.createElement("div");
    placeholder.innerHTML = html;
    dropzone.dispatchEvent(new CustomEvent("dropzone-dropping",{
      bubbles:true,
        detail:{
            type : "url",
            target : dropzone,
            dataTransfer : e.dataTransfer,
            text : e.dataTransfer.getData("text"),
            placeholderHTML : placeholder
        }
      }))*/
  }
}
document.addEventListener("drop",drop,true);
document.addEventListener("dragover",dragover,true);
document.addEventListener("dragleave",dragLeave,true);
document.addEventListener("paste",onPaste,true);
// panel logic compatibility
window.addEventListener("window-popup-open", e => {
  var newWindowDocument = e.detail.newWindow.document;
  newWindowDocument.addEventListener("drop",drop,true);
  newWindowDocument.addEventListener("dragover",dragover,true);
  newWindowDocument.addEventListener("dragleave",dragLeave,true);
  newWindowDocument.addEventListener("paste",onPaste,true);
});
function onPaste(e){
  var target = e.target;
  var dropzone = target.closest("[data-dropzone]");
  if(!dropzone)
    return;
  var clipboardData = e.clipboardData;
  if (clipboardData.files.length) {
    e.preventDefault();
    dropzone.dispatchEvent(new CustomEvent("dropzone-dropping", {
      bubbles:true,
      detail:{
        type : "files",
        target : dropzone,
        files : clipboardData.files
      }
    }))
  }
}
})();