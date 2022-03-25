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