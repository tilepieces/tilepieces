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